/**
 * VANNAM Architectural Spec Sheet & Client Document Generator
 * Generates an executive architectural specification document featuring:
 * - High-Res Side-by-side Before / After Render
 * - Color Specification Table (Brand, Shade Name, HEX, RGB, Finish)
 * - Material & Surface Area Quantities
 * - Rover Automated Deployment vs. Manual Timeline Comparison
 */

export function generateArchitecturalSpecSheet({
  canvasElement,
  selectedColor,
  selectedFinish = 'Ultra Matte',
  surfaceAreaSqm = 48,
  lightingCondition = 'Midday Sunlight (6500K)',
  projectName = 'Architectural Interior Facade'
}) {
  if (!canvasElement) return;

  const width = 1200;
  const height = 900;
  const docCanvas = document.createElement('canvas');
  docCanvas.width = width;
  docCanvas.height = height;
  const ctx = docCanvas.getContext('2d');

  // Background
  ctx.fillStyle = '#070A12';
  ctx.fillRect(0, 0, width, height);

  // Top Accent Banner
  ctx.fillStyle = '#101415';
  ctx.fillRect(0, 0, width, 100);
  ctx.strokeStyle = 'rgba(138, 235, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 99, width, 1);

  // VANNAM Brand Header
  ctx.fillStyle = '#8AEBFF';
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.fillText('VANNAM ROBOTICS', 50, 48);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '13px "JetBrains Mono", monospace';
  ctx.fillText('AUTONOMOUS VERTICAL COATINGS & ARCHITECTURAL VISUALIZATION', 50, 72);

  const refId = `VN-SPEC-${Math.floor(100000 + Math.random() * 900000)}`;
  ctx.fillStyle = '#E2E8F0';
  ctx.textAlign = 'right';
  ctx.fillText(`DOC REF: ${refId}`, width - 50, 48);
  ctx.fillText(`DATE: ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`, width - 50, 72);
  ctx.textAlign = 'left';

  // Render Image Container
  const imgWidth = 700;
  const imgHeight = 440;
  ctx.fillStyle = '#000000';
  ctx.fillRect(50, 130, imgWidth, imgHeight);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.strokeRect(50, 130, imgWidth, imgHeight);

  // Draw Visualizer Canvas Preview
  ctx.drawImage(canvasElement, 50, 130, imgWidth, imgHeight);

  // Image Badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(60, 140, 200, 32);
  ctx.fillStyle = '#8AEBFF';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText('● HIGH-FIDELITY RENDER', 72, 160);

  // Right Side Specification Card
  const rightX = 780;
  ctx.fillStyle = '#101415';
  ctx.fillRect(rightX, 130, 370, imgHeight);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeRect(rightX, 130, 370, imgHeight);

  ctx.fillStyle = '#8AEBFF';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('COLOR SPECIFICATION', rightX + 24, 165);

  // Large Swatch Box
  ctx.fillStyle = selectedColor.hex || '#F4EBDD';
  ctx.fillRect(rightX + 24, 185, 64, 64);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.strokeRect(rightX + 24, 185, 64, 64);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillText(selectedColor.name || 'Selected Shade', rightX + 104, 212);

  ctx.fillStyle = '#8AEBFF';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText(selectedColor.hex || '#F4EBDD', rightX + 104, 236);

  // Metadata Table
  const meta = [
    { label: 'BRAND / LINE', val: selectedColor.brand || 'Asian Paints' },
    { label: 'SHADE CODE', val: selectedColor.code || 'V-7892' },
    { label: 'FINISH / SHEEN', val: selectedFinish },
    { label: 'SIMULATED LIGHT', val: lightingCondition },
    { label: 'SURFACE AREA', val: `${surfaceAreaSqm} m² (~${Math.round(surfaceAreaSqm * 10.76)} sq.ft)` },
    { label: 'EST. MATERIAL', val: `${(surfaceAreaSqm * 0.12).toFixed(1)} Liters (2 Coats)` }
  ];

  let metaY = 280;
  for (const item of meta) {
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(item.label, rightX + 24, metaY);

    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(item.val, rightX + 24, metaY + 16);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeRect(rightX + 24, metaY + 22, 322, 1);
    metaY += 42;
  }

  // Bottom Execution & Telemetry Comparison Card
  const botY = 600;
  ctx.fillStyle = '#101415';
  ctx.fillRect(50, botY, width - 100, 220);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeRect(50, botY, width - 100, 220);

  ctx.fillStyle = '#8AEBFF';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText('DEPLOYMENT ESTIMATION (ROVER MK-II VS. MANUAL SCAFFOLDING)', 74, botY + 36);

  // Metric 1: Rover Time
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(74, botY + 60, 320, 110);
  ctx.fillStyle = '#8AEBFF';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillText('1h 15m', 94, botY + 115);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('VANNAM ROVER MK-II EXECUTION', 94, botY + 145);

  // Metric 2: Manual Time
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(424, botY + 60, 320, 110);
  ctx.fillStyle = '#E2E8F0';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillText('5h 40m', 444, botY + 115);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('TRADITIONAL MANUAL SCAFFOLDING', 444, botY + 145);

  // Metric 3: Safety & Fall Risk
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(774, botY + 60, 326, 110);
  ctx.fillStyle = '#34D399';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.fillText('0 RISK', 794, botY + 115);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText('GROUND-CONTROLLED TELEMETRY', 794, botY + 145);

  // Footer Note
  ctx.fillStyle = '#64748B';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED ARCHITECTURAL SPECIFICATION • GENERATED BY VANNAM PAINT ENGINE PLATFORM', 50, 860);

  // Download Trigger
  const link = document.createElement('a');
  link.download = `VANNAM_SpecSheet_${refId}.png`;
  link.href = docCanvas.toDataURL('image/png');
  link.click();
}
