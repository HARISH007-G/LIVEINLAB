import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import confetti from 'canvas-confetti';
import { ArrowLeft, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import { createPaintEngine, hexToRgb } from '../utils/advancedPaintEngine';
import { createSurfaceStore } from '../store/surfaceStore';
import { curatedPaintDatabase, BRANDS } from '../data/paintDatabase';
import { samplePresets } from '../data/samplePresets';
import { LIGHTING_PRESETS, getLightingPreset } from '../utils/lightingEngine';
import { FINISH_PRESETS, getFinishPreset } from '../utils/textureEngine';
import { generateArchitecturalPalette } from '../utils/colorHarmonizer';
import { RoverSimulator } from '../utils/roverSimulator';
import { generateArchitecturalSpecSheet } from '../utils/specSheetGenerator';
import { encodeMaskRLE, decodeMaskRLE, validateVannamProject } from '../utils/maskSerializer';

import ViewportIngestor from '../components/visualizer/ViewportIngestor';
import CadLayerMatrix from '../components/visualizer/CadLayerMatrix';
import InstrumentDock from '../components/visualizer/InstrumentDock';
import VernierCalipers from '../components/visualizer/VernierCalipers';
import HeliostatBar from '../components/visualizer/HeliostatBar';
import ComparisonSplitShutter from '../components/visualizer/ComparisonSplitShutter';
import LeicaLoupe from '../components/visualizer/LeicaLoupe';
import RoverTelemetryHud from '../components/visualizer/RoverTelemetryHud';
import PhysicalSwatchPlate from '../components/visualizer/PhysicalSwatchPlate';
import MaterialFinishTiles from '../components/visualizer/MaterialFinishTiles';
import PigmentSynthesizer from '../components/visualizer/PigmentSynthesizer';
import GoldenRatioHarmonizer from '../components/visualizer/GoldenRatioHarmonizer';
import FanDeckMatrix from '../components/visualizer/FanDeckMatrix';
import SpecSheetExporter from '../components/visualizer/SpecSheetExporter';
import MaskRefinementModal from '../components/visualizer/MaskRefinementModal';
import VannamSciFiLoader from '../components/VannamSciFiLoader';

import styles from './Visualizer.module.css';

// Helper to convert RGB numbers to Hex string
const rgbToHexStr = (r, g, b) => {
  const clamp = (val) => Math.max(0, Math.min(255, Math.round(Number(val) || 0)));
  const toHex = (n) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

// Helper to calculate Light Reflectance Value (LRV)
const calculateLRV = (hex) => {
  if (!hex || hex[0] !== '#') return 50;
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  const lrv = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return Math.round(lrv * 100);
};

const Visualizer = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Parse Initial Color from URL Query Parameters
  const initialColorFromUrl = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const colorHex = searchParams.get('color');
    const colorCode = searchParams.get('code');
    const colorName = searchParams.get('name');
    const colorBrand = searchParams.get('brand');

    if (colorHex) {
      const match = curatedPaintDatabase.find(
        (c) =>
          c.hex.toLowerCase() === colorHex.toLowerCase() ||
          (colorCode && c.code === colorCode)
      );
      if (match) return match;
      return {
        code: colorCode || 'CUSTOM',
        name: colorName || 'Custom Shade',
        brand: colorBrand || 'Custom Mix',
        hex: colorHex.startsWith('#') ? colorHex : `#${colorHex}`,
        tone: 'custom',
        type: 'both',
        finish: 'Matte',
        rooms: ['Living Room'],
        description: 'Custom shade selected by color code.'
      };
    }
    return curatedPaintDatabase[0];
  }, [location.search]);

  // Primary Viewport State
  const [activeImageSrc, setActiveImageSrc] = useState(samplePresets[0].src);
  const [activePresetId, setActivePresetId] = useState(samplePresets[0].id);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');

  // Multi-Surface CAD State
  const [surfaces, setSurfaces] = useState([]);
  const [activeSurfaceId, setActiveSurfaceId] = useState(null);
  const [hiddenSurfaces, setHiddenSurfaces] = useState(new Set());
  const [lockedSurfaces, setLockedSurfaces] = useState(new Set());
  const [isAddingSurface, setIsAddingSurface] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewSurfaceIndex, setReviewSurfaceIndex] = useState(0);

  // Tools & Settings
  const [activeTool, setActiveTool] = useState('smart-brush'); // 'smart-brush' | 'wand' | 'brush' | 'eraser' | 'loupe'
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [detectionSensitivity, setDetectionSensitivity] = useState(80);
  const [brushSize, setBrushSize] = useState(28);
  const [brushSoftness, setBrushSoftness] = useState(40);
  const [wandTolerance, setWandTolerance] = useState(35);
  const [edgeSnapSetting, setEdgeSnapSetting] = useState('MEDIUM'); // 'OFF' | 'LOW' | 'MEDIUM' | 'HIGH'
  const [debugMode, setDebugMode] = useState(false);

  const projectFileInputRef = useRef(null);

  // Lighting & Finish State
  const [activeLighting, setActiveLighting] = useState('midday');
  const [activeFinish, setActiveFinish] = useState('matte');

  // Paint Simulation Settings
  const [selectedColor, setSelectedColor] = useState(initialColorFromUrl);
  const [selectedBrand, setSelectedBrand] = useState('Asian Paints');

  // Custom Color Code Input Mode ('hex' | 'rgb')
  const [colorInputMode, setColorInputMode] = useState('hex');
  const [customHexInput, setCustomHexInput] = useState(initialColorFromUrl.hex);
  const [copiedHex, setCopiedHex] = useState(false);

  // Custom RGB inputs
  const initialRgb = hexToRgb(initialColorFromUrl.hex);
  const [customR, setCustomR] = useState(initialRgb.r);
  const [customG, setCustomG] = useState(initialRgb.g);
  const [customB, setCustomB] = useState(initialRgb.b);

  // Viewport & Comparison State
  const [splitPos, setSplitPos] = useState(0.5);
  const [showMask, setShowMask] = useState(false);

  // Rover Simulator State
  const [isRoverSimulating, setIsRoverSimulating] = useState(false);
  const [roverTelemetry, setRoverTelemetry] = useState(null);

  // Live Cursor Overlay & Magnifier Loupe
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100, visible: false });
  const [loupeState, setLoupeState] = useState({ x: -100, y: -100, visible: false });
  const loupeCanvasRef = useRef(null);

  // Refs for Stable Rendering Loop
  const canvasRef = useRef(null);
  const canvasCardRef = useRef(null);
  const engineRef = useRef(null);
  const surfaceStoreRef = useRef(createSurfaceStore());
  const roverSimRef = useRef(new RoverSimulator());
  const renderFrameIdRef = useRef(null);
  const roverAnimFrameRef = useRef(null);

  const isPointerDownRef = useRef(false);
  const isDraggingSplitRef = useRef(false);
  const isDraggingHandleRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const nativeColorPickerRef = useRef(null);

  // State Refs for Non-reactive Render Calls
  const surfacesRef = useRef(surfaces);
  surfacesRef.current = surfaces;

  const hiddenSurfacesRef = useRef(hiddenSurfaces);
  hiddenSurfacesRef.current = hiddenSurfaces;

  const activeLightingRef = useRef(activeLighting);
  activeLightingRef.current = activeLighting;

  const activeFinishRef = useRef(activeFinish);
  activeFinishRef.current = activeFinish;

  const splitPosRef = useRef(splitPos);
  splitPosRef.current = splitPos;

  const showMaskRef = useRef(showMask);
  showMaskRef.current = showMask;

  const activeSurfaceIdRef = useRef(activeSurfaceId);
  activeSurfaceIdRef.current = activeSurfaceId;

  const debugModeRef = useRef(debugMode);
  debugModeRef.current = debugMode;

  // Trigger Glitch-Free Redraw
  const triggerCanvasRedraw = useCallback(() => {
    if (renderFrameIdRef.current) {
      cancelAnimationFrame(renderFrameIdRef.current);
    }
    renderFrameIdRef.current = requestAnimationFrame(() => {
      if (engineRef.current && canvasRef.current) {
        // Filter out hidden surfaces
        const visibleSurfaces = surfacesRef.current.filter(
          (s) => !hiddenSurfacesRef.current.has(s.id)
        );
        engineRef.current.renderMultiSurfaceComposite(canvasRef.current, visibleSurfaces, {
          splitPosition: splitPosRef.current,
          lightingMode: activeLightingRef.current,
          finish: activeFinishRef.current,
          showMask: showMaskRef.current,
          activeSurfaceId: activeSurfaceIdRef.current,
          debugMode: debugModeRef.current
        });
      }
    });
  }, []);

  // Synchronize Brand Selection
  const filteredSwatches = useMemo(() => {
    return curatedPaintDatabase.filter(
      (c) => c.brand.toLowerCase() === selectedBrand.toLowerCase()
    );
  }, [selectedBrand]);

  // Synchronize 60-30-10 Architectural Harmonizer
  const harmonizerPalette = useMemo(() => {
    return generateArchitecturalPalette(selectedColor.hex);
  }, [selectedColor.hex]);

  // Load Image and Initialize Surface Segmentation
  const loadActiveImage = useCallback(
    async (src) => {
      setIsProcessing(true);
      setProcessingMsg('Analyzing architectural surfaces & planar creases...');
      setIsEngineReady(false);

      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async () => {
          try {
            const engine = createPaintEngine();
            await engine.loadImage(img);
            engineRef.current = engine;

            // Auto-detect independent wall surfaces
            const detectedSurfaces = await engine.segmentSurfaces({
              sensitivity: detectionSensitivity / 100
            });

            surfaceStoreRef.current.setSurfaces(detectedSurfaces);
            const currentList = surfaceStoreRef.current.getSurfaces();
            setSurfaces(currentList);

            if (currentList.length > 0) {
              setActiveSurfaceId(currentList[0].id);
              setSelectedColor({
                code: `SRF-${currentList[0].id}`,
                name: currentList[0].name,
                brand: 'Detected Surface',
                hex: currentList[0].color,
                finish: currentList[0].finish
              });
            }

            setIsEngineReady(true);
            setIsProcessing(false);
            triggerCanvasRedraw();
          } catch (innerErr) {
            console.warn('Engine load fallback', innerErr);
            setIsProcessing(false);
            setIsEngineReady(true);
            triggerCanvasRedraw();
          }
        };
        img.onerror = () => {
          console.warn('Failed to load image from:', src);
          setIsProcessing(false);
          setIsEngineReady(true);
        };
        img.src = src;
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    },
    [detectionSensitivity, triggerCanvasRedraw]
  );

  // Re-run Automatic Surface Detection on Demand
  const handleAutoDetectSurfaces = async () => {
    if (!engineRef.current) return;
    setIsProcessing(true);
    setProcessingMsg('Auto-detecting independent wall planes & protected boundaries...');
    try {
      const detectedSurfaces = await engineRef.current.segmentSurfaces({
        sensitivity: detectionSensitivity / 100
      });
      surfaceStoreRef.current.setSurfaces(detectedSurfaces);
      const currentList = surfaceStoreRef.current.getSurfaces();
      setSurfaces(currentList);
      if (currentList.length > 0) {
        setActiveSurfaceId(currentList[0].id);
      }
      setIsProcessing(false);
      triggerCanvasRedraw();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // Load Image when activeImageSrc changes
  useEffect(() => {
    loadActiveImage(activeImageSrc);
  }, [activeImageSrc, loadActiveImage]);

  // Re-render when visual parameters change
  useEffect(() => {
    if (isEngineReady) {
      triggerCanvasRedraw();
    }
  }, [
    isEngineReady,
    splitPos,
    showMask,
    activeLighting,
    activeFinish,
    activeSurfaceId,
    debugMode,
    hiddenSurfaces,
    triggerCanvasRedraw
  ]);

  // Rover Simulation Animation Loop
  const runRoverSimulationLoop = useCallback(() => {
    if (!isRoverSimulating) return;

    const sim = roverSimRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    sim.update(selectedColor.hex);
    setRoverTelemetry({ ...sim.telemetry });

    triggerCanvasRedraw();

    const ctx = canvas.getContext('2d');
    if (ctx) {
      sim.draw(ctx, canvas.width, canvas.height);
    }

    roverAnimFrameRef.current = requestAnimationFrame(runRoverSimulationLoop);
  }, [isRoverSimulating, selectedColor.hex, triggerCanvasRedraw]);

  useEffect(() => {
    if (isRoverSimulating) {
      const activeSurface = surfaces.find((s) => s.id === activeSurfaceId);
      const canvas = canvasRef.current;
      const width = canvas ? canvas.width : 800;
      const height = canvas ? canvas.height : 500;
      const mask = activeSurface?.mask || new Uint8Array(width * height);
      roverSimRef.current.planPathFromMask(mask, width, height);
      roverAnimFrameRef.current = requestAnimationFrame(runRoverSimulationLoop);
    } else {
      if (roverAnimFrameRef.current) {
        cancelAnimationFrame(roverAnimFrameRef.current);
      }
      roverSimRef.current.stop();
      setRoverTelemetry(null);
      triggerCanvasRedraw();
    }
    return () => {
      if (roverAnimFrameRef.current) {
        cancelAnimationFrame(roverAnimFrameRef.current);
      }
    };
  }, [isRoverSimulating, activeSurfaceId, runRoverSimulationLoop, triggerCanvasRedraw, surfaces]);

  // Surface Mutation Handlers
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setCustomHexInput(color.hex);
    const rgb = hexToRgb(color.hex);
    setCustomR(rgb.r);
    setCustomG(rgb.g);
    setCustomB(rgb.b);

    if (activeSurfaceId && !lockedSurfaces.has(activeSurfaceId)) {
      surfaceStoreRef.current.updateSurface(activeSurfaceId, {
        color: color.hex,
        finish: color.finish || activeFinish
      });
      setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
      triggerCanvasRedraw();
    }
  };

  const handleFinishSelect = (finishKey) => {
    setActiveFinish(finishKey);
    if (activeSurfaceId && !lockedSurfaces.has(activeSurfaceId)) {
      surfaceStoreRef.current.updateSurface(activeSurfaceId, { finish: finishKey });
      setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
      triggerCanvasRedraw();
    }
  };

  const handleHexInputChange = (e) => {
    let val = e.target.value.trim().toUpperCase();
    if (!val.startsWith('#')) val = `#${val}`;
    setCustomHexInput(val);

    if (/^#[0-9A-F]{6}$/i.test(val)) {
      const rgb = hexToRgb(val);
      setCustomR(rgb.r);
      setCustomG(rgb.g);
      setCustomB(rgb.b);
      handleColorSelect({
        code: `HEX-${val.replace('#', '')}`,
        name: `Custom ${val}`,
        brand: 'Custom Synthesis',
        hex: val,
        tone: 'custom',
        type: 'both',
        finish: activeFinish
      });
    }
  };

  const handleCopyHex = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(selectedColor.hex);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 1800);
  };

  const handleRgbChange = (channel, val) => {
    const num = Math.max(0, Math.min(255, parseInt(val, 10) || 0));
    let newR = customR;
    let newG = customG;
    let newB = customB;

    if (channel === 'r') {
      setCustomR(num);
      newR = num;
    }
    if (channel === 'g') {
      setCustomG(num);
      newG = num;
    }
    if (channel === 'b') {
      setCustomB(num);
      newB = num;
    }

    const hex = rgbToHexStr(newR, newG, newB);
    setCustomHexInput(hex);
    handleColorSelect({
      code: `RGB-${newR}-${newG}-${newB}`,
      name: `RGB(${newR}, ${newG}, ${newB})`,
      brand: 'Custom Synthesis',
      hex: hex,
      tone: 'custom',
      type: 'both',
      finish: activeFinish
    });
  };

  const handleNativePickerChange = (e) => {
    const val = e.target.value.toUpperCase();
    setCustomHexInput(val);
    const rgb = hexToRgb(val);
    setCustomR(rgb.r);
    setCustomG(rgb.g);
    setCustomB(rgb.b);
    handleColorSelect({
      code: `COLOR-${val.replace('#', '')}`,
      name: `Color ${val}`,
      brand: 'Custom Mix',
      hex: val,
      tone: 'custom',
      type: 'both',
      finish: activeFinish
    });
  };

  // Layer Lock & Visibility Toggles
  const handleToggleVisibility = (surfaceId, e) => {
    e.stopPropagation();
    setHiddenSurfaces((prev) => {
      const next = new Set(prev);
      if (next.has(surfaceId)) {
        next.delete(surfaceId);
      } else {
        next.add(surfaceId);
      }
      return next;
    });
  };

  const handleToggleLock = (surfaceId, e) => {
    e.stopPropagation();
    setLockedSurfaces((prev) => {
      const next = new Set(prev);
      if (next.has(surfaceId)) {
        next.delete(surfaceId);
      } else {
        next.add(surfaceId);
      }
      return next;
    });
  };

  // 1-Click Harmonizer Distribution with tactile Confetti burst
  const handleApplyHarmonizerToSurfaces = () => {
    if (!harmonizerPalette || surfaces.length === 0) return;

    const surfaceList = surfaceStoreRef.current.getSurfaces();
    const secondaryHex = (harmonizerPalette.subordinate || harmonizerPalette.secondary)?.hex;

    if (surfaceList.length >= 1 && harmonizerPalette.dominant?.hex) {
      surfaceStoreRef.current.updateSurface(surfaceList[0].id, {
        color: harmonizerPalette.dominant.hex
      });
    }
    if (surfaceList.length >= 2 && secondaryHex) {
      surfaceStoreRef.current.updateSurface(surfaceList[1].id, {
        color: secondaryHex
      });
    }
    if (surfaceList.length >= 3 && harmonizerPalette.accent?.hex) {
      surfaceStoreRef.current.updateSurface(surfaceList[2].id, {
        color: harmonizerPalette.accent.hex
      });
    }

    setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
    triggerCanvasRedraw();

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: [
          harmonizerPalette?.dominant?.hex || '#2563EB',
          secondaryHex || '#0EA5E9',
          harmonizerPalette?.accent?.hex || '#D97706'
        ]
      });
    } catch (_) {}
  };

  // 1-Click Executive Spec Sheet Export
  const handleExportSpecSheet = () => {
    const specData = generateArchitecturalSpecSheet({
      surfaces: surfaceStoreRef.current.getSurfaces(),
      activeLighting,
      activeFinish,
      buildingPreset: activePresetId
    });

    const blob = new Blob([specData.markdownContent], {
      type: 'text/markdown;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VANNAM-Architectural-Spec-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);

    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.85 },
        colors: ['#2563EB', '#0EA5E9', '#10B981']
      });
    } catch (_) {}
  };

  // High-Resolution Image Export (PNG)
  const handleExportRender = (format = 'png') => {
    if (!engineRef.current || !canvasRef.current) return;
    try {
      const exportCanvas = document.createElement('canvas');
      const currentSurfaces = surfaceStoreRef.current.getSurfaces().filter(
        (s) => !hiddenSurfacesRef.current.has(s.id)
      );

      engineRef.current.renderMultiSurfaceComposite(exportCanvas, currentSurfaces, {
        lightingMode: activeLightingRef.current,
        finish: activeFinishRef.current,
        showMask: false,
        debugMode: false
      });

      const dataUrl = exportCanvas.toDataURL(format === 'jpg' ? 'image/jpeg' : 'image/png', 0.95);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `VANNAM-Render-${Date.now()}.${format}`;
      a.click();

      try {
        confetti({
          particleCount: 45,
          spread: 75,
          origin: { y: 0.8 },
          colors: ['#2563EB', '#22D3EE', '#38BDF8']
        });
      } catch (_) {}
    } catch (err) {
      console.error('Export render failed', err);
    }
  };

  // Save Project to compact .vannam JSON (with RLE mask compression)
  const handleSaveProject = () => {
    try {
      const currentSurfaces = surfaceStoreRef.current.getSurfaces();
      const projectData = {
        app: 'VANNAM',
        version: '2.5',
        timestamp: new Date().toISOString(),
        activePresetId,
        activeImageSrc,
        activeLighting,
        activeFinish,
        activeSurfaceId,
        surfaces: currentSurfaces.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          color: s.color,
          finish: s.finish,
          strength: s.strength,
          lightingPreservation: s.lightingPreservation,
          textureRetention: s.textureRetention,
          coverage: s.coverage,
          confidence: s.confidence,
          mask: s.mask ? encodeMaskRLE(s.mask) : null
        }))
      };

      const blob = new Blob([JSON.stringify(projectData)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VANNAM-Project-${Date.now()}.vannam`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Save project failed', err);
    }
  };

  // Trigger Open Project File Dialog
  const handleOpenProject = () => {
    if (projectFileInputRef.current) {
      projectFileInputRef.current.click();
    }
  };

  // Load and Restore Project File (with validation & RLE/legacy decompression)
  const handleLoadProjectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validation = validateVannamProject(parsed);
        if (!validation.valid) {
          alert(`Invalid project file: ${validation.error}`);
          return;
        }

        const restoredSurfaces = parsed.surfaces.map((s) => ({
          ...s,
          mask: decodeMaskRLE(s.mask)
        }));

        surfaceStoreRef.current.setSurfaces(restoredSurfaces);
        setSurfaces([...surfaceStoreRef.current.getSurfaces()]);

        if (parsed.activeSurfaceId) setActiveSurfaceId(parsed.activeSurfaceId);
        if (parsed.activeLighting) setActiveLighting(parsed.activeLighting);
        if (parsed.activeFinish) setActiveFinish(parsed.activeFinish);
        if (parsed.activeImageSrc && parsed.activeImageSrc !== activeImageSrc) {
          setActiveImageSrc(parsed.activeImageSrc);
        }

        triggerCanvasRedraw();

        try {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.8 },
            colors: ['#22D3EE', '#2563EB', '#10B981']
          });
        } catch (_) {}
      } catch (err) {
        console.error('Failed to parse project file', err);
        alert('Could not parse project file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Mask Refinement Action
  const handleApplyMaskRefinement = (options) => {
    if (!engineRef.current || !activeSurfaceId) return;
    const activeSurface = surfaces.find((s) => s.id === activeSurfaceId);
    if (!activeSurface || !activeSurface.mask) return;

    const refined = engineRef.current.refineSurfaceMask(activeSurface, options);
    const newConf = engineRef.current.computeSurfaceConfidence(activeSurface);

    surfaceStoreRef.current.updateSurface(activeSurfaceId, {
      mask: refined,
      confidence: newConf
    });
    setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
    triggerCanvasRedraw();
  };

  // Undo / Redo
  const handleUndo = () => {
    surfaceStoreRef.current.undo();
    setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
    triggerCanvasRedraw();
  };

  const handleRedo = () => {
    surfaceStoreRef.current.redo();
    setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
    triggerCanvasRedraw();
  };

  // Add Surface Mode
  const handleStartAddSurface = () => {
    setIsAddingSurface(true);
    setActiveTool('wand');
  };

  const handleDeleteSurface = (surfaceId, e) => {
    e.stopPropagation();
    surfaceStoreRef.current.deleteSurface(surfaceId);
    const updated = surfaceStoreRef.current.getSurfaces();
    setSurfaces([...updated]);
    if (activeSurfaceId === surfaceId && updated.length > 0) {
      setActiveSurfaceId(updated[0].id);
    }
    triggerCanvasRedraw();
  };

  // Dropzone & File Upload Handlers
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setActiveImageSrc(e.target.result);
        setActivePresetId('custom-upload');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    noClick: true
  });

  const handleManualUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setActiveImageSrc(ev.target.result);
        setActivePresetId('custom-upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct Slider Drag Math with magnetic snapping
  const updateSplitFromClientX = useCallback(
    (clientX) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let newPos = (clientX - rect.left) / rect.width;
      // Magnetic snap to center
      if (Math.abs(newPos - 0.5) < 0.02) newPos = 0.5;
      newPos = Math.max(0.01, Math.min(0.99, newPos));
      setSplitPos(newPos);
      triggerCanvasRedraw();
    },
    [triggerCanvasRedraw]
  );

  const handleSplitPointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingHandleRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handleSplitPointerMove = (e) => {
    if (isDraggingHandleRef.current) {
      e.preventDefault();
      e.stopPropagation();
      updateSplitFromClientX(e.clientX);
    }
  };

  const handleSplitPointerUp = (e) => {
    isDraggingHandleRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Canvas Drawing Interactions & Magic Wand Multi-Surface
  const handlePointerDown = (e) => {
    if (!engineRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const relX = (clientX - rect.left) / rect.width;
    if (Math.abs(relX - splitPos) < 0.04) {
      isDraggingSplitRef.current = true;
      canvas.setPointerCapture(e.pointerId);
      return;
    }

    if (activeSurfaceId && lockedSurfaces.has(activeSurfaceId)) {
      return; // Locked surface prevents modifying
    }

    canvas.setPointerCapture(e.pointerId);
    isPointerDownRef.current = true;
    const { x, y } = engineRef.current.screenToCanvasCoordinates(clientX, clientY, canvas);
    lastPointerRef.current = { x, y };

    if (activeTool === 'wand' || isAddingSurface) {
      const floodResult = engineRef.current.floodFillSurface(x, y, {
        tolerance: wandTolerance,
        edgeSnap: edgeSnapSetting
      });

      if (floodResult && floodResult.mask) {
        if (isAddingSurface) {
          const newSurface = surfaceStoreRef.current.addSurface({
            name: `Custom Wall ${surfaces.length + 1}`,
            mask: floodResult.mask,
            color: selectedColor.hex,
            finish: activeFinish,
            confidence: floodResult.confidence
          });
          setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
          setActiveSurfaceId(newSurface.id);
          setIsAddingSurface(false);
        } else if (activeSurfaceId) {
          surfaceStoreRef.current.updateSurface(activeSurfaceId, {
            mask: floodResult.mask,
            confidence: floodResult.confidence
          });
          setSurfaces([...surfaceStoreRef.current.getSurfaces()]);
        }
      }
      triggerCanvasRedraw();
    } else if (activeTool === 'smart-brush' || activeTool === 'brush' || activeTool === 'eraser') {
      const activeSurface = surfaces.find((s) => s.id === activeSurfaceId);
      if (activeSurface) {
        const hardness = 1 - brushSoftness / 100;
        const snap = activeTool === 'smart-brush' ? (edgeSnapSetting === 'OFF' ? 'MEDIUM' : edgeSnapSetting) : (activeTool === 'brush' ? 'OFF' : edgeSnapSetting);
        engineRef.current.paintSmartBrush(
          activeSurface,
          x,
          y,
          x,
          y,
          {
            radius: brushSize,
            hardness,
            mode: activeTool === 'eraser' ? 'erase' : 'paint',
            edgeSnap: snap
          }
        );
        surfaceStoreRef.current.updateSurface(activeSurfaceId, { mask: activeSurface.mask });
        triggerCanvasRedraw();
      }
    } else if (activeTool === 'loupe') {
      // Loupe active, inspection only
    } else {
      // Automatic surface activation on click if touching a surface mask
      const dims = engineRef.current ? engineRef.current.getWorkingDimensions() : { width: canvas.width, height: canvas.height };
      const clickedSurface = surfaces.find(
        (s) => s.mask && s.mask[y * dims.width + x] > 20
      );
      if (clickedSurface && clickedSurface.id !== activeSurfaceId) {
        setActiveSurfaceId(clickedSurface.id);
        triggerCanvasRedraw();
      }
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (isDraggingSplitRef.current) {
      updateSplitFromClientX(clientX);
      return;
    }

    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      const relX = clientX - rect.left;
      const relY = clientY - rect.top;

      setCursorPos({
        x: relX,
        y: relY,
        visible: activeTool === 'smart-brush' || activeTool === 'brush' || activeTool === 'eraser'
      });

      if (activeTool === 'loupe') {
        const loupeCanvas = loupeCanvasRef.current;
        if (loupeCanvas && canvas) {
          const lCtx = loupeCanvas.getContext('2d');
          const { x: cX, y: cY } = engineRef.current
            ? engineRef.current.screenToCanvasCoordinates(clientX, clientY, canvas)
            : { x: 0, y: 0 };
          const zoomRadius = 28;
          lCtx.clearRect(0, 0, 140, 140);
          lCtx.save();
          lCtx.beginPath();
          lCtx.arc(70, 70, 70, 0, Math.PI * 2);
          lCtx.clip();
          lCtx.drawImage(
            canvas,
            cX - zoomRadius,
            cY - zoomRadius,
            zoomRadius * 2,
            zoomRadius * 2,
            0,
            0,
            140,
            140
          );
          lCtx.restore();
        }
        setLoupeState({
          x: relX,
          y: relY,
          visible: true
        });
      } else {
        setLoupeState((prev) => ({ ...prev, visible: false }));
      }
    } else {
      setCursorPos((prev) => ({ ...prev, visible: false }));
      setLoupeState((prev) => ({ ...prev, visible: false }));
    }

    if (!isPointerDownRef.current || !engineRef.current) return;

    if (activeTool === 'smart-brush' || activeTool === 'brush' || activeTool === 'eraser') {
      const { x, y } = engineRef.current.screenToCanvasCoordinates(clientX, clientY, canvas);
      const activeSurface = surfaces.find((s) => s.id === activeSurfaceId);
      if (activeSurface) {
        const hardness = 1 - brushSoftness / 100;
        const snap = activeTool === 'smart-brush' ? (edgeSnapSetting === 'OFF' ? 'MEDIUM' : edgeSnapSetting) : (activeTool === 'brush' ? 'OFF' : edgeSnapSetting);
        engineRef.current.paintSmartBrush(
          activeSurface,
          lastPointerRef.current.x,
          lastPointerRef.current.y,
          x,
          y,
          {
            radius: brushSize,
            hardness,
            mode: activeTool === 'eraser' ? 'erase' : 'paint',
            edgeSnap: snap
          }
        );
        surfaceStoreRef.current.updateSurface(activeSurfaceId, { mask: activeSurface.mask });
        lastPointerRef.current = { x, y };
        triggerCanvasRedraw();
      }
    }
  };

  const handlePointerUp = (e) => {
    isPointerDownRef.current = false;
    isDraggingSplitRef.current = false;
    isDraggingHandleRef.current = false;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Keyboard Shortcuts (W, B, E, L, Undo, Redo, Enter)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 's' || e.key === 'S') {
        setActiveTool('smart-brush');
        setIsAddingSurface(false);
      } else if (e.key === 'w' || e.key === 'W') {
        setActiveTool('wand');
        setIsAddingSurface(false);
      } else if (e.key === 'b' || e.key === 'B') {
        setActiveTool('brush');
        setIsAddingSurface(false);
      } else if (e.key === 'e' || e.key === 'E') {
        setActiveTool('eraser');
        setIsAddingSurface(false);
      } else if (e.key === 'l' || e.key === 'L') {
        setActiveTool('loupe');
        setIsAddingSurface(false);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      } else if (isReviewMode) {
        if (e.key === 'ArrowLeft') {
          const nextIdx = (reviewSurfaceIndex - 1 + surfaces.length) % surfaces.length;
          setReviewSurfaceIndex(nextIdx);
          setActiveSurfaceId(surfaces[nextIdx].id);
        } else if (e.key === 'ArrowRight') {
          const nextIdx = (reviewSurfaceIndex + 1) % surfaces.length;
          setReviewSurfaceIndex(nextIdx);
          setActiveSurfaceId(surfaces[nextIdx].id);
        } else if (e.key === 'Enter') {
          setIsReviewMode(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewMode, reviewSurfaceIndex, surfaces]);

  const activeSurfaceObj =
    surfaces.find((s) => s.id === activeSurfaceId) ||
    surfaces[0] || {
      name: 'Main Wall Plane',
      color: '#F4EBDD',
      coverage: 0,
      confidence: 0.95
    };

  const activeLrv = calculateLRV(selectedColor.hex);

  return (
    <div className={styles.studioPage} {...getRootProps()}>
      <input {...getInputProps()} />

      {/* Blueprint Background Grid */}
      <div className="blueprint-grid" />

      <div className={`container ${styles.workspaceContainer}`}>
        {/* =========================================================
            1. LEFT SIDEBAR: RETOUCH & MULTI-SURFACE CAD STACK (275px)
            ========================================================= */}
        <aside className={styles.leftStudio}>
          <div className={styles.studioHeader}>
            <div className={styles.studioTagBadge}>
              <span className={styles.pulseDot} />
              <span>SURFACE CAD LAB</span>
            </div>
            <span className={styles.resolutionTag}>4K • 16:9 RAW</span>
          </div>

          {/* 1. Architectural Viewport Ingestor */}
          <ViewportIngestor
            samplePresets={samplePresets}
            activePresetId={activePresetId}
            onSelectPreset={(preset) => {
              setActivePresetId(preset.id);
              setActiveImageSrc(preset.src);
            }}
            onUploadClick={() => fileInputRef.current?.click()}
            fileInputRef={fileInputRef}
            onManualUpload={handleManualUpload}
          />

          {/* 2. CAD Planar Surface Matrix */}
          <CadLayerMatrix
            surfaces={surfaces}
            activeSurfaceId={activeSurfaceId}
            hiddenSurfaces={hiddenSurfaces}
            lockedSurfaces={lockedSurfaces}
            isAddingSurface={isAddingSurface}
            onSelectSurface={(surface) => {
              setActiveSurfaceId(surface.id);
              if (surface.color) {
                setCustomHexInput(surface.color);
                const rgb = hexToRgb(surface.color);
                setCustomR(rgb.r);
                setCustomG(rgb.g);
                setCustomB(rgb.b);
                setSelectedColor({
                  code: `SRF-${surface.id}`,
                  name: surface.name,
                  brand: 'Surface Layer',
                  hex: surface.color,
                  finish: surface.finish
                });
              }
            }}
            onAutoDetect={handleAutoDetectSurfaces}
            onToggleVisibility={handleToggleVisibility}
            onToggleLock={handleToggleLock}
            onDeleteSurface={handleDeleteSurface}
            onStartAddSurface={handleStartAddSurface}
            isProcessing={isProcessing}
          />

          {/* 3. Machined Floating Instrument Dock */}
          <InstrumentDock
            activeTool={activeTool}
            isAddingSurface={isAddingSurface}
            showMask={showMask}
            debugMode={debugMode}
            isReviewMode={isReviewMode}
            onSelectTool={(tool) => {
              setActiveTool(tool);
              setIsAddingSurface(false);
            }}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onToggleMask={() => setShowMask((prev) => !prev)}
            onToggleDebug={() => setDebugMode((prev) => !prev)}
            onToggleReview={() => setIsReviewMode((prev) => !prev)}
            onRefineMask={() => setIsRefineModalOpen(true)}
          />

          {/* 4. Vernier Calipers & LiDAR Edge Snap */}
          <VernierCalipers
            brushSize={brushSize}
            brushSoftness={brushSoftness}
            edgeSnapSetting={edgeSnapSetting}
            onBrushSizeChange={setBrushSize}
            onBrushSoftnessChange={setBrushSoftness}
            onEdgeSnapChange={setEdgeSnapSetting}
          />
        </aside>

        {/* =========================================================
            2. CENTER CANVAS & HELIOSTAT VIEWPORT
            ========================================================= */}
        <main className={styles.centerCanvasArea}>
          {/* Heliostat Solar Bar */}
          <HeliostatBar
            activeLighting={activeLighting}
            onSelectLighting={setActiveLighting}
            isRoverSimulating={isRoverSimulating}
            onToggleRoverSimulation={() => setIsRoverSimulating((prev) => !prev)}
          />

          {/* Main Canvas Card Viewport */}
          <div
            ref={canvasCardRef}
            className={`${styles.canvasCard} ${isDragActive ? styles.dragActiveCard : ''}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <canvas ref={canvasRef} className={styles.mainCanvas} />

            {/* Active Surface Floating Badge */}
            <div className={styles.activeSurfaceFloatingBadge}>
              <span
                className={styles.floatingSurfaceDot}
                style={{ backgroundColor: activeSurfaceObj.color }}
              />
              <span className={styles.activeFloatingLabel}>
                ACTIVE PLANE: <strong>{activeSurfaceObj.name.toUpperCase()}</strong>{' '}
                <span className={styles.confPill}>
                  ({Math.round((activeSurfaceObj.confidence || 0.95) * 100)}% CONF)
                </span>
              </span>
            </div>

            {/* SpaceX / Polestar Avionics Telemetry HUD Overlay */}
            <RoverTelemetryHud
              isRoverSimulating={isRoverSimulating}
              roverTelemetry={roverTelemetry}
            />

            {/* Filmstrip Review Mode Step-Through Bar */}
            {isReviewMode && (
              <div className={styles.reviewModeBar}>
                <span>
                  SURFACE REVIEW: <strong>{activeSurfaceObj.name}</strong> (
                  {reviewSurfaceIndex + 1}/{surfaces.length})
                </span>
                <div className={styles.reviewActions}>
                  <button
                    type="button"
                    className={styles.reviewBtn}
                    onClick={() => {
                      const nextIdx =
                        (reviewSurfaceIndex - 1 + surfaces.length) % surfaces.length;
                      setReviewSurfaceIndex(nextIdx);
                      setActiveSurfaceId(surfaces[nextIdx].id);
                    }}
                  >
                    ◀ Prev (←)
                  </button>
                  <button
                    type="button"
                    className={styles.reviewBtn}
                    onClick={() => {
                      const nextIdx = (reviewSurfaceIndex + 1) % surfaces.length;
                      setReviewSurfaceIndex(nextIdx);
                      setActiveSurfaceId(surfaces[nextIdx].id);
                    }}
                  >
                    Next ▶ (→)
                  </button>
                  <button
                    type="button"
                    className={`${styles.reviewBtn} ${styles.reviewBtnAccept}`}
                    onClick={() => setIsReviewMode(false)}
                  >
                    Accept (Enter)
                  </button>
                </div>
              </div>
            )}

            {/* Canvas HUD Bottom Right Telemetry */}
            <div className={styles.canvasHudData}>
              <p>SURFACE: <strong>{activeSurfaceObj.name.toUpperCase()}</strong></p>
              <p>CODE: <strong>{selectedColor.code}</strong></p>
              <p>FINISH: <strong>{getFinishPreset(activeSurfaceObj.finish || activeFinish).name.toUpperCase()}</strong></p>
              <p>TEMP: <strong>{getLightingPreset(activeLighting).kelvin}</strong></p>
            </div>

            {/* Knurled Optical Comparison Split Shutter */}
            <ComparisonSplitShutter
              splitPos={splitPos}
              onPointerDown={handleSplitPointerDown}
              onPointerMove={handleSplitPointerMove}
              onPointerUp={handleSplitPointerUp}
            />

            {/* Processing Loading Spinner Overlay */}
            {isProcessing && (
              <div className={styles.processingOverlay}>
                <VannamSciFiLoader
                  scale={0.7}
                  message={processingMsg || 'Segmenting architectural surfaces...'}
                  telemetry="LiDAR OPTICS • PLANAR DEPTH CALIBRATION"
                />
              </div>
            )}

            {/* Live Custom Brush Pointer Indicator */}
            {cursorPos.visible && (
              <div
                className={styles.brushCursor}
                style={{
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                  width: `${brushSize * 2}px`,
                  height: `${brushSize * 2}px`,
                  borderColor: activeTool === 'eraser' ? '#ef4444' : 'var(--primary)'
                }}
              />
            )}

            {/* Leica 2.5x Optical Micro-Loupe Lens */}
            <LeicaLoupe
              loupeCanvasRef={loupeCanvasRef}
              loupeState={loupeState}
            />
          </div>

          {/* Bottom Continuous Range Scrub Bar */}
          <div className={styles.comparisonBar}>
            <span className={styles.compBarLabel}>Original Architecture</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(splitPos * 100)}
              onChange={(e) => {
                const val = Math.max(
                  0.01,
                  Math.min(0.99, parseInt(e.target.value, 10) / 100)
                );
                setSplitPos(val);
                triggerCanvasRedraw();
              }}
              className={styles.comparisonRangeInput}
            />
            <span className={styles.compBarLabelActive}>
              Coated Surface ({selectedColor.name})
            </span>
          </div>
        </main>

        {/* =========================================================
            3. RIGHT SIDEBAR: COLOR & MATERIAL SCIENCE (360px)
            ========================================================= */}
        <aside className={styles.rightStudio}>
          <div className={styles.studioHeader}>
            <span className={styles.studioTag}>COLOR & MATERIAL LAB</span>
            <span className={styles.deltaETag}>ΔE &lt; 0.3</span>
          </div>

          {/* 1. Physical Swatch Specimen Plate */}
          <PhysicalSwatchPlate
            selectedColor={selectedColor}
            activeLrv={activeLrv}
            copiedHex={copiedHex}
            onCopyHex={handleCopyHex}
            onOpenColorPicker={() => nativeColorPickerRef.current?.click()}
            nativeColorPickerRef={nativeColorPickerRef}
            onNativePickerChange={handleNativePickerChange}
          />

          {/* 2. 3D Tactile Material Finish Tiles */}
          <MaterialFinishTiles
            activeFinish={activeFinish}
            onSelectFinish={handleFinishSelect}
          />

          {/* 3. Architectural Pigment Synthesizer */}
          <PigmentSynthesizer
            colorInputMode={colorInputMode}
            customHexInput={customHexInput}
            customR={customR}
            customG={customG}
            customB={customB}
            onColorInputModeChange={setColorInputMode}
            onHexInputChange={handleHexInputChange}
            onRgbChange={handleRgbChange}
            onOpenNativePicker={() => nativeColorPickerRef.current?.click()}
          />

          {/* 4. Golden Ratio 60-30-10 Spatial Balance Deck */}
          <GoldenRatioHarmonizer
            harmonizerPalette={harmonizerPalette}
            activeFinish={activeFinish}
            onSelectColor={handleColorSelect}
            onApplyHarmonizerToSurfaces={handleApplyHarmonizerToSurfaces}
          />

          {/* 5. 1-Click Executive Spec Sheet & Project Exporter */}
          <SpecSheetExporter
            onExportSpecSheet={handleExportSpecSheet}
            onExportRender={handleExportRender}
            onSaveProject={handleSaveProject}
            onOpenProject={handleOpenProject}
          />

          {/* 6. Curated Architectural Fan-Deck Swatch Matrix */}
          <FanDeckMatrix
            brands={BRANDS}
            selectedBrand={selectedBrand}
            filteredSwatches={filteredSwatches}
            selectedColor={selectedColor}
            onSelectBrand={setSelectedBrand}
            onSelectColor={handleColorSelect}
          />
        </aside>
      </div>

      {/* Hidden File Input for .vannam Project Ingestion */}
      <input
        ref={projectFileInputRef}
        type="file"
        accept=".vannam,.json"
        style={{ display: 'none' }}
        onChange={handleLoadProjectFile}
      />

      {/* Mask Refinement Modal */}
      <MaskRefinementModal
        isOpen={isRefineModalOpen}
        surfaceName={activeSurfaceObj.name}
        onClose={() => setIsRefineModalOpen(false)}
        onApply={handleApplyMaskRefinement}
      />
    </div>
  );
};

export default Visualizer;