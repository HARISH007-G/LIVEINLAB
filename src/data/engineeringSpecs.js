/**
 * Robotics Engineering Specifications & Interactive Hotspots Data
 */

export const ROVER_HOTSPOTS = [
  {
    id: 'adhesion',
    num: '01',
    name: 'Dynamic Vacuum Adhesion',
    shortDesc: 'Dual-chamber differential pressure adhesion system',
    fullDesc: 'Maintains steady vertical wall contact across uneven brick, concrete, and stucco surfaces with active torque balancing.',
    specs: [
      { label: 'Surface Pressure', val: '1.8 kPa Adaptive' },
      { label: 'Max Vertical Incline', val: '90° True Vertical' },
      { label: 'Payload Capacity', val: '14.5 kg' },
      { label: 'Adhesion Redundancy', val: 'Dual Turbofan System' }
    ],
    tag: 'Core Adhesion'
  },
  {
    id: 'spray',
    num: '02',
    name: 'Precision Atomizing Nozzle',
    shortDesc: 'High-pressure airless spray delivery with variable fan angle',
    fullDesc: 'Micro-actuator controlled spray head ensures uniform micron-level paint thickness with minimal overspray or airborne drift.',
    specs: [
      { label: 'Coating Precision', val: '±0.4 mm' },
      { label: 'Spray Width', val: '150 – 450 mm Dynamic' },
      { label: 'Flow Rate', val: '1.2 L/min' },
      { label: 'Transfer Efficiency', val: '94.8%' }
    ],
    tag: 'Coating Engine'
  },
  {
    id: 'telemetry',
    num: '03',
    name: 'Bluetooth 5.3 & LiDAR Telemetry',
    shortDesc: 'Real-time surface mapping and mobile app control loop',
    fullDesc: 'Transmits live positional coordinates, paint reservoir levels, and battery metrics to the Vannam mobile app at 50 Hz.',
    specs: [
      { label: 'Wireless Range', val: 'Up to 100 m Line of Sight' },
      { label: 'Telemetry Rate', val: '50 Hz Real-Time' },
      { label: 'Obstacle Detection', val: 'ToF Laser Distance Array' },
      { label: 'Mobile App OS', val: 'iOS & Android' }
    ],
    tag: 'Sensors & Control'
  },
  {
    id: 'tether',
    num: '04',
    name: 'Automated Safety Tether',
    shortDesc: 'Active tension-controlled secondary fail-safe system',
    fullDesc: 'Top-anchored high-tensile braided Dyneema line with automated motorized spooling prevents free-fall in extreme wind conditions.',
    specs: [
      { label: 'Tensile Strength', val: '8.5 kN Breaking Load' },
      { label: 'Spool Response', val: '< 15 ms Lock Time' },
      { label: 'Wind Resistance', val: 'Up to 45 km/h' },
      { label: 'Fail-Safe Mode', val: 'Mechanical Deadman Lock' }
    ],
    tag: 'Safety System'
  },
  {
    id: 'power',
    num: '05',
    name: 'Modular LiFePO4 Battery Array',
    shortDesc: 'Quick-swap high-density power pack for continuous operations',
    fullDesc: 'Designed for rapid 2-minute battery swapping on job sites, delivering uninterrupted painting shifts on commercial buildings.',
    specs: [
      { label: 'Continuous Runtime', val: '3.5 Hours per Pack' },
      { label: 'Charge Time', val: '45 mins (Fast Charge)' },
      { label: 'Cell Chemistry', val: 'LiFePO4 Thermal-Stable' },
      { label: 'Cycle Life', val: '2000+ Cycles' }
    ],
    tag: 'Power Unit'
  }
];

export const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Digital Capture',
    desc: 'Capture or upload your architectural facade directly into the Vannam studio.'
  },
  {
    num: '02',
    title: 'Intelligent Segmentation',
    desc: 'Our computer vision engine automatically distinguishes wall surfaces from windows, ground, and sky.'
  },
  {
    num: '03',
    title: 'Shade Simulation',
    desc: 'Test thousands of authentic verified paint shades under photorealistic daylighting conditions.'
  },
  {
    num: '04',
    title: 'Job Planning & Estimates',
    desc: 'Generate exact paint volume calculations, labor savings, and robotic cycle times.'
  },
  {
    num: '05',
    title: 'Robotic Execution',
    desc: 'Deploy the Vannam vertical rover for safe, high-speed, and human-fall-free execution.'
  }
];
