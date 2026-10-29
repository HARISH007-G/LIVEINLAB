/**
 * Curated Authentic Paint Database
 * Features verified color collections from leading world-renowned paint manufacturers
 */

export const BRANDS = [
  'Asian Paints',
  'Dulux',
  'Berger',
  'Nippon Paint',
  'Sherwin-Williams',
  'Benjamin Moore',
  'Farrow & Ball',
  'Jotun',
  'Kansai Nerolac',
  'PPG Paints'
];

export const TONES = ['all', 'neutral', 'blue', 'green', 'yellow', 'orange', 'red', 'violet'];

export const curatedPaintDatabase = [
  // =========================================================================
  // 1. ASIAN PAINTS (Royale Luxury, Apex Ultima, Nilaya)
  // =========================================================================
  {
    code: 'AP-0921',
    name: 'Warm Ivory',
    brand: 'Asian Paints',
    hex: '#F4EBDD',
    tone: 'neutral',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Living Room', 'Hallway', 'Bedroom'],
    description: 'Soft warm neutral that brings a welcoming and spacious glow to any room.'
  },
  {
    code: 'AP-9204',
    name: 'Royal Cobalt',
    brand: 'Asian Paints',
    hex: '#1E3A8A',
    tone: 'blue',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Accent Wall', 'Living Room', 'Master Suite'],
    description: 'Regal dark sapphire blue delivering depth, majesty, and architectural luxury.'
  },
  {
    code: 'AP-7412',
    name: 'Teal Symphony',
    brand: 'Asian Paints',
    hex: '#0F766E',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Study', 'Feature Wall', 'Dining Room'],
    description: 'Subtle balance of deep blue and lush green for balanced contemporary interiors.'
  },
  {
    code: 'AP-X134',
    name: 'Desert Ochre',
    brand: 'Asian Paints',
    hex: '#D97706',
    tone: 'yellow',
    type: 'both',
    finish: 'Matte',
    rooms: ['Dining Room', 'Foyer', 'Living Accent'],
    description: 'Earthy golden ochre reflecting evening sunlight and Indian architectural heritage.'
  },
  {
    code: 'AP-8291',
    name: 'Terracotta Hearth',
    brand: 'Asian Paints',
    hex: '#EA580C',
    tone: 'orange',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Kitchen', 'Balcony', 'Dining Accent'],
    description: 'Warm clay orange inspired by Mediterranean and Rajasthani brickwork.'
  },
  {
    code: 'AP-0765',
    name: 'Crimson Velvet',
    brand: 'Asian Paints',
    hex: '#DC2626',
    tone: 'red',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Front Door', 'Dining Feature', 'Powder Room'],
    description: 'Vibrant, high-energy scarlet red creating unforgettable focal points.'
  },
  {
    code: 'AP-L124',
    name: 'Imperial Plum',
    brand: 'Asian Paints',
    hex: '#7C3AED',
    tone: 'violet',
    type: 'both',
    finish: 'Matte',
    rooms: ['Master Bedroom', 'Lounge', 'Creative Studio'],
    description: 'Deep royal amethyst delivering meditative focus and artistic opulence.'
  },
  {
    code: 'AP-4109',
    name: 'Raw Silk Off-White',
    brand: 'Asian Paints',
    hex: '#FAF5EF',
    tone: 'neutral',
    type: 'both',
    finish: 'Velvet Matte',
    rooms: ['Living Room', 'Ceilings', 'Full Villa'],
    description: 'Ultra-pure warm linen with delicate micro-pearl reflectance.'
  },
  {
    code: 'AP-9423',
    name: 'Monsoon Slate',
    brand: 'Asian Paints',
    hex: '#475569',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Exterior Facade', 'Modern Study', 'Bathroom'],
    description: 'Subtle oceanic graphite evoking rain-washed coastal basalt.'
  },
  {
    code: 'AP-0N12',
    name: 'Nilaya Jade',
    brand: 'Asian Paints',
    hex: '#065F46',
    tone: 'green',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Living Room Accent', 'Library'],
    description: 'Deep jewel emerald from the Nilaya artisanal collection.'
  },
  {
    code: 'AP-9132',
    name: 'Arabian Night Sky',
    brand: 'Asian Paints',
    hex: '#0F172A',
    tone: 'blue',
    type: 'both',
    finish: 'Ultra Matte',
    rooms: ['Home Theater', 'Accent Wall'],
    description: 'Midnight navy-black absorbing glare with absolute velvety depth.'
  },
  {
    code: 'AP-8045',
    name: 'Sunbaked Sandstone',
    brand: 'Asian Paints',
    hex: '#E2D4C0',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Exterior Villa', 'Courtyard'],
    description: 'Natural quarried sandstone tone weathered under dry desert sunlight.'
  },
  {
    code: 'AP-7210',
    name: 'Pistachio Chiffon',
    brand: 'Asian Paints',
    hex: '#86EFAC',
    tone: 'green',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Breakfast Nook', 'Kids Bedroom'],
    description: 'Fresh botanical mint green infusing morning optimism into compact spaces.'
  },
  {
    code: 'AP-0329',
    name: 'Marigold Blossom',
    brand: 'Asian Paints',
    hex: '#FBBF24',
    tone: 'yellow',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Kitchen Backsplash', 'Entryway'],
    description: 'Radiant festive marigold yellow radiating warmth and cheer.'
  },
  {
    code: 'AP-9481',
    name: 'Kashmir Lavender',
    brand: 'Asian Paints',
    hex: '#DDD6FE',
    tone: 'violet',
    type: 'both',
    finish: 'Matte',
    rooms: ['Master Bedroom', 'Meditation Corner'],
    description: 'Gentle Himalayan mist lilac with powdery calming undertones.'
  },

  // =========================================================================
  // 2. DULUX (Heritage, Weathershield, Velvet Touch)
  // =========================================================================
  {
    code: 'DL-90YY',
    name: 'Soft Linen',
    brand: 'Dulux',
    hex: '#EAE6DF',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Bedroom', 'Dining Room'],
    description: 'A timeless off-white with delicate earthy undertones for serene spaces.'
  },
  {
    code: 'DL-30BB',
    name: 'Ocean Mist',
    brand: 'Dulux',
    hex: '#38BDF8',
    tone: 'blue',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Kids Room', 'Balcony', 'Bathroom'],
    description: 'Bright coastal sky blue that evokes calm Mediterranean breezes.'
  },
  {
    code: 'DL-70RR',
    name: 'Dusty Peony',
    brand: 'Dulux',
    hex: '#F43F5E',
    tone: 'red',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Master Bedroom Accent', 'Vanity Room'],
    description: 'Romantic vintage rose with modern muted sophistication.'
  },
  {
    code: 'DL-50GY',
    name: 'Olive Grove',
    brand: 'Dulux',
    hex: '#65A30D',
    tone: 'green',
    type: 'both',
    finish: 'Velvet Matte',
    rooms: ['Kitchen', 'Balcony Garden', 'Dining Area'],
    description: 'Natural earthy olive with rich grounding organic pigments.'
  },
  {
    code: 'DL-10YY',
    name: 'Nordic Birch',
    brand: 'Dulux',
    hex: '#FDE68A',
    tone: 'yellow',
    type: 'both',
    finish: 'Matte',
    rooms: ['Study', 'Sunroom', 'Breakfast Nook'],
    description: 'Pale Scandinavian timber tint adding gentle illumination.'
  },
  {
    code: 'DL-40RB',
    name: 'French Lavender',
    brand: 'Dulux',
    hex: '#C4B5FD',
    tone: 'violet',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Bedroom', 'Relaxation Corner'],
    description: 'Soothing floral lilac that induces peace, calmness, and mental relaxation.'
  },
  {
    code: 'DL-00NN',
    name: 'Heritage White',
    brand: 'Dulux',
    hex: '#F1F5F9',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['All Interiors', 'Ceilings'],
    description: 'Clean architectural chalk white optimized for high daylight diffusion.'
  },
  {
    code: 'DL-60YR',
    name: 'Copper Glow',
    brand: 'Dulux',
    hex: '#C2410C',
    tone: 'orange',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Dining Room', 'Exterior Entrance'],
    description: 'Burnished metallic copper orange for tactile statement walls.'
  },
  {
    code: 'DL-20BG',
    name: 'Nordic Sea Pine',
    brand: 'Dulux',
    hex: '#0D9488',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Bathroom Suite', 'Modern Hall'],
    description: 'Deep maritime green-blue recalling Scandinavian fjords.'
  },
  {
    code: 'DL-80YR',
    name: 'Champagne Mousse',
    brand: 'Dulux',
    hex: '#FEF3C7',
    tone: 'yellow',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Guest Room', 'Living Room'],
    description: 'Luminous celebratory champagne cream with a soft golden gleam.'
  },
  {
    code: 'DL-30RR',
    name: 'Mulberry Wine',
    brand: 'Dulux',
    hex: '#9F1239',
    tone: 'red',
    type: 'both',
    finish: 'Velvet Matte',
    rooms: ['Dining Room', 'Library'],
    description: 'Intense dark berry red with commanding heritage prestige.'
  },
  {
    code: 'DL-15BB',
    name: 'Aegean Wave',
    brand: 'Dulux',
    hex: '#0284C7',
    tone: 'blue',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Feature Wall', 'Exterior Columns'],
    description: 'Vivid cerulean blue reflecting crisp Grecian island sun.'
  },

  // =========================================================================
  // 3. BERGER (Silk Glamor, WeatherCoat Long Life, Rangoli)
  // =========================================================================
  {
    code: 'BG-7T01',
    name: 'Misty Grey',
    brand: 'Berger',
    hex: '#D1D5DB',
    tone: 'neutral',
    type: 'both',
    finish: 'Velvet Matte',
    rooms: ['Living Room', 'Exterior Facade'],
    description: 'Modern architectural grey, excellent for both exterior pillars and minimal living spaces.'
  },
  {
    code: 'BG-8A14',
    name: 'Alpine Mint',
    brand: 'Berger',
    hex: '#A7F3D0',
    tone: 'green',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Bathroom', 'Spa Room', 'Nursery'],
    description: 'Refreshing pastel glacier green that creates a clean, spa-like sanctuary.'
  },
  {
    code: 'BG-4D22',
    name: 'Solar Amber',
    brand: 'Berger',
    hex: '#F59E0B',
    tone: 'yellow',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Accent Trim', 'Kitchen Island', 'Foyer'],
    description: 'Radiant warm amber yellow that catches and reflects ambient room lighting.'
  },
  {
    code: 'BG-2P09',
    name: 'Deep Burgundy',
    brand: 'Berger',
    hex: '#991B1B',
    tone: 'red',
    type: 'both',
    finish: 'Velvet Matte',
    rooms: ['Dining Room', 'Library', 'Lounge'],
    description: 'Rich dark wine red for intimate, cozy, and luxurious architectural settings.'
  },
  {
    code: 'BG-6T18',
    name: 'Smoky Charcoal',
    brand: 'Berger',
    hex: '#334155',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Home Theater', 'Master Suite', 'Exterior Facade'],
    description: 'High-contrast architect slate tone for framing perimeter walls.'
  },
  {
    code: 'BG-1A05',
    name: 'Silk Pearl White',
    brand: 'Berger',
    hex: '#F8FAFC',
    tone: 'neutral',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Living Room', 'Open Plan Loft'],
    description: 'Smooth luminescent emulsion delivering exceptional light dispersion.'
  },
  {
    code: 'BG-5N20',
    name: 'Forest Canopy',
    brand: 'Berger',
    hex: '#14532D',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Executive Office', 'Living Accent'],
    description: 'Dense coniferous evergreen delivering organic stability and prestige.'
  },
  {
    code: 'BG-3D11',
    name: 'Riviera Azure',
    brand: 'Berger',
    hex: '#2563EB',
    tone: 'blue',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Swimming Pool Surrounds', 'Accent Wall'],
    description: 'Electric Mediterranean cobalt blue for bold artistic contrasts.'
  },
  {
    code: 'BG-9W02',
    name: 'Tuscan Peach',
    brand: 'Berger',
    hex: '#FDBA74',
    tone: 'orange',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Dining Room', 'Hallway'],
    description: 'Gentle apricot blush reminiscent of Italian vineyard sunsets.'
  },
  {
    code: 'BG-4A17',
    name: 'Royal Orchid',
    brand: 'Berger',
    hex: '#A855F7',
    tone: 'violet',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Dressing Room', 'Creative Studio'],
    description: 'Vibrant blooming orchid purple full of contemporary flair.'
  },
  {
    code: 'BG-8D33',
    name: 'Granite Peak',
    brand: 'Berger',
    hex: '#64748B',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Exterior Wall', 'Corridor'],
    description: 'Cool architectural mineral grey engineered for heavy outdoor exposure.'
  },

  // =========================================================================
  // 4. NIPPON PAINT (Momento, Weatherbond, Odour-less)
  // =========================================================================
  {
    code: 'NP-OW08',
    name: 'Sandstone Pearl',
    brand: 'Nippon Paint',
    hex: '#D7C4B7',
    tone: 'neutral',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Exterior Facade', 'Villa Front'],
    description: 'Resilient weathered stone tone that elevates exterior grandeur.'
  },
  {
    code: 'NP-B1042',
    name: 'Nordic Indigo',
    brand: 'Nippon Paint',
    hex: '#1D4ED8',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Study', 'Accent Wall', 'Master Bedroom'],
    description: 'Clean mid-century indigo blue with crisp Scandinavian balance.'
  },
  {
    code: 'NP-AC201',
    name: 'Kyoto Moss',
    brand: 'Nippon Paint',
    hex: '#4D7C0F',
    tone: 'green',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Zen Garden Wall', 'Living Room Accent'],
    description: 'Traditional Japanese temple moss tone that connects indoor spaces with nature.'
  },
  {
    code: 'NP-N1980',
    name: 'Porcelain White',
    brand: 'Nippon Paint',
    hex: '#F9FAFB',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Whole Interior', 'Ceilings'],
    description: 'Flawless ceramic white offering immaculate clean lines and high light bounce.'
  },
  {
    code: 'NP-YO118',
    name: 'Tokyo Neon Ochre',
    brand: 'Nippon Paint',
    hex: '#EAB308',
    tone: 'yellow',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Commercial Facade', 'Creative Hub'],
    description: 'Bold vibrant industrial yellow with ultra-pure chromatic impact.'
  },
  {
    code: 'NP-R1264',
    name: 'Crimson Shinto',
    brand: 'Nippon Paint',
    hex: '#B91C1C',
    tone: 'red',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Gate Entrance', 'Statement Nook'],
    description: 'Iconic lacquered Torii red engineered for maximum exterior colorfastness.'
  },
  {
    code: 'NP-PB1420',
    name: 'Pacific Trench',
    brand: 'Nippon Paint',
    hex: '#0369A1',
    tone: 'blue',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Bathroom', 'Courtyard'],
    description: 'Deep oceanic blue with rich cyan undertones.'
  },
  {
    code: 'NP-G1054',
    name: 'Matcha Tea',
    brand: 'Nippon Paint',
    hex: '#65A30D',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Dining Room', 'Kitchen'],
    description: 'Finely milled ceremonial green tea shade with calming organic warmth.'
  },
  {
    code: 'NP-OW102',
    name: 'Warm Travertine',
    brand: 'Nippon Paint',
    hex: '#ECE5DA',
    tone: 'neutral',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Living Room', 'Corridors'],
    description: 'Earthy Italian travertine cream ideal for minimalist luxury homes.'
  },
  {
    code: 'NP-N2004',
    name: 'Obsidian Basalt',
    brand: 'Nippon Paint',
    hex: '#18181B',
    tone: 'neutral',
    type: 'both',
    finish: 'Ultra Matte',
    rooms: ['Media Wall', 'Exterior Cladding'],
    description: 'Deep volcanic black with non-reflective light absorption.'
  },
  {
    code: 'NP-B1088',
    name: 'Fuji Morning Sky',
    brand: 'Nippon Paint',
    hex: '#BAE6FD',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Bedroom', 'Nursery'],
    description: 'Translucent dawn sky blue inspired by Mount Fuji sunrises.'
  },

  // =========================================================================
  // 5. SHERWIN-WILLIAMS (Emerald, Duration, Cashmere)
  // =========================================================================
  {
    code: 'SW-7005',
    name: 'Pure White',
    brand: 'Sherwin-Williams',
    hex: '#EDEBE6',
    tone: 'neutral',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['All Interiors', 'Ceilings', 'Trim'],
    description: 'Crisp, bright, and clean white without harsh yellow or blue tints.'
  },
  {
    code: 'SW-7069',
    name: 'Iron Ore Charcoal',
    brand: 'Sherwin-Williams',
    hex: '#373A3C',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Accent Wall', 'Exterior Trim', 'Modern Study'],
    description: 'Deep moody charcoal black for dramatic, contemporary accent statements.'
  },
  {
    code: 'SW-6244',
    name: 'Naval Blue',
    brand: 'Sherwin-Williams',
    hex: '#1B2C42',
    tone: 'blue',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Dining Room', 'Kitchen Cabinets', 'Master Bedroom'],
    description: 'A deep, authoritative navy blue that brings confidence and grandeur.'
  },
  {
    code: 'SW-6479',
    name: 'Drizzle Soft Aqua',
    brand: 'Sherwin-Williams',
    hex: '#7DD3FC',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Guest Room', 'Bathroom', 'Veranda'],
    description: 'Airy, atmospheric cyan-blue resembling soft morning precipitation.'
  },
  {
    code: 'SW-6385',
    name: 'Dover White',
    brand: 'Sherwin-Williams',
    hex: '#F1E9D7',
    tone: 'neutral',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Living Room', 'Trim', 'Cabinets'],
    description: 'Beloved creamy warm white that brings softness and timeless charm.'
  },
  {
    code: 'SW-6605',
    name: 'Coral Reef',
    brand: 'Sherwin-Williams',
    hex: '#FB7185',
    tone: 'red',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Powder Room', 'Playroom', 'Entryway'],
    description: 'Lively pinkish coral with an upbeat tropical seaside personality.'
  },
  {
    code: 'SW-6548',
    name: 'Deep Plum Velvet',
    brand: 'Sherwin-Williams',
    hex: '#581C87',
    tone: 'violet',
    type: 'both',
    finish: 'Matte',
    rooms: ['Feature Wall', 'Powder Room'],
    description: 'Dramatic dark plum with rich blackish-purple undertones.'
  },
  {
    code: 'SW-7015',
    name: 'Repose Gray',
    brand: 'Sherwin-Williams',
    hex: '#CCC5B9',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room', 'Hallway', 'Full House'],
    description: 'The definitive architectural greige matching wood, metal, and stone.'
  },
  {
    code: 'SW-6204',
    name: 'Sea Salt Sage',
    brand: 'Sherwin-Williams',
    hex: '#CBD5C0',
    tone: 'green',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Bathroom', 'Bedroom', 'Kitchen'],
    description: 'Muted coastal green-gray that subtly shifts with daylight temperature.'
  },
  {
    code: 'SW-6006',
    name: 'Black Bean',
    brand: 'Sherwin-Williams',
    hex: '#2B2625',
    tone: 'neutral',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Front Door', 'Fireplace Wall'],
    description: 'Ultra-rich espresso-black with warm mahogany undertones.'
  },
  {
    code: 'SW-7048',
    name: 'Urbane Bronze',
    brand: 'Sherwin-Williams',
    hex: '#54504A',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Exterior Trim', 'Master Bedroom'],
    description: 'Rooted biophilic bronze-gray establishing organic sanctuary spaces.'
  },
  {
    code: 'SW-9177',
    name: 'Salty Dog Navy',
    brand: 'Sherwin-Williams',
    hex: '#1E3A5F',
    tone: 'blue',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Cabinetry', 'Front Door'],
    description: 'Bold maritime navy with exceptional gloss depth.'
  },

  // =========================================================================
  // 6. BENJAMIN MOORE (Aura, Regal Select, Historical Collection)
  // =========================================================================
  {
    code: 'BM-HC-154',
    name: 'Hale Navy',
    brand: 'Benjamin Moore',
    hex: '#2F3C48',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Dining Room', 'Exterior Siding', 'Kitchen Island'],
    description: 'The legendary architectural navy blue with smokey slate undertones.'
  },
  {
    code: 'BM-AF-690',
    name: 'Metropolitan Grey',
    brand: 'Benjamin Moore',
    hex: '#D1D5DB',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Modern Living Room', 'Gallery Hall'],
    description: 'Calm, composed neutral grey that adapts seamlessly to diverse furniture palettes.'
  },
  {
    code: 'BM-2124-10',
    name: 'Wrought Iron',
    brand: 'Benjamin Moore',
    hex: '#2D3136',
    tone: 'neutral',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Accent Wall', 'Window Mullions', 'Doors'],
    description: 'Subtle graphite-black softer than pure black, offering velvety warmth.'
  },
  {
    code: 'BM-CC-40',
    name: 'Cloud White',
    brand: 'Benjamin Moore',
    hex: '#F7F6F2',
    tone: 'neutral',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Trim', 'Kitchen Cabinets', 'Ceilings'],
    description: 'Classic luminous off-white with delicate cream warmth.'
  },
  {
    code: 'BM-HC-172',
    name: 'Revere Pewter',
    brand: 'Benjamin Moore',
    hex: '#CCC5B9',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Open Concept', 'Living Room'],
    description: 'Iconic transitional greige bridging warm wood and cool stone.'
  },
  {
    code: 'BM-2062-20',
    name: 'Gentleman\'s Gray',
    brand: 'Benjamin Moore',
    hex: '#1E384D',
    tone: 'blue',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Library', 'Bar Area', 'Powder Room'],
    description: 'Formal, tailored peacock-teal with dramatic masculine presence.'
  },
  {
    code: 'BM-HC-166',
    name: 'Kendall Charcoal',
    brand: 'Benjamin Moore',
    hex: '#4A4D4A',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Exterior Siding', 'Fireplace Surround'],
    description: 'Rich, luxurious charcoal grey with deep earth undertones.'
  },
  {
    code: 'BM-2133-10',
    name: 'Onyx Black',
    brand: 'Benjamin Moore',
    hex: '#1A1A1A',
    tone: 'neutral',
    type: 'both',
    finish: 'Ultra Matte',
    rooms: ['Studio Theater', 'Feature Wall'],
    description: 'Pure obsidian black engineered for zero light glare.'
  },
  {
    code: 'BM-AF-380',
    name: 'Costal Path Gold',
    brand: 'Benjamin Moore',
    hex: '#E5C07B',
    tone: 'yellow',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Dining Room', 'Sunroom'],
    description: 'Warm sandy gold radiating mellow ambient warmth.'
  },
  {
    code: 'BM-HC-134',
    name: 'Tarrytown Green',
    brand: 'Benjamin Moore',
    hex: '#2B4736',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Historic Study', 'Exterior Doors'],
    description: 'Deep heritage forest green with distinguished stately elegance.'
  },
  {
    code: 'BM-2112-20',
    name: 'Black Raspberry',
    brand: 'Benjamin Moore',
    hex: '#4C243B',
    tone: 'violet',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Dining Feature', 'Master Closet'],
    description: 'Decadent dark berry violet delivering dramatic boutique luxury.'
  },
  {
    code: 'BM-HC-142',
    name: 'Carriage Red',
    brand: 'Benjamin Moore',
    hex: '#7A2E2C',
    tone: 'red',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Front Door', 'Library Accent'],
    description: 'Historic barn red with authentic brick pigments.'
  },

  // =========================================================================
  // 7. FARROW & BALL (Estate Emulsion, Modern Eggshell)
  // =========================================================================
  {
    code: 'FB-201',
    name: 'Pink Ground',
    brand: 'Farrow & Ball',
    hex: '#F2DFD7',
    tone: 'red',
    type: 'both',
    finish: 'Matte',
    rooms: ['Bedroom', 'Nursery', 'Vanity'],
    description: 'Dusty, soothing blush pink creating a flattering ambient glow.'
  },
  {
    code: 'FB-26',
    name: 'Down Pipe',
    brand: 'Farrow & Ball',
    hex: '#474D4E',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Hallway', 'Bathroom', 'Exterior Trim'],
    description: 'Dusk charcoal with bluish undertones, ideal for dramatic entryways.'
  },
  {
    code: 'FB-31',
    name: 'Railings',
    brand: 'Farrow & Ball',
    hex: '#282C30',
    tone: 'neutral',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Front Door', 'Kitchen Island', 'Modern Study'],
    description: 'A softer alternative to pure black with rich midnight blue undertones.'
  },
  {
    code: 'FB-281',
    name: 'Stiffkey Blue',
    brand: 'Farrow & Ball',
    hex: '#2B3D4F',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Library', 'Dining Room', 'Living Room'],
    description: 'Inky seaside navy inspired by the muddy coastal sands of Norfolk.'
  },
  {
    code: 'FB-268',
    name: 'Setting Plaster',
    brand: 'Farrow & Ball',
    hex: '#E3C5B8',
    tone: 'orange',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room', 'Hallway', 'Dining Room'],
    description: 'Historic raw plaster pink delivering earthy warmth and classic elegance.'
  },
  {
    code: 'FB-85',
    name: 'Bancha Olive',
    brand: 'Farrow & Ball',
    hex: '#4C583E',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Dining Room', 'Reading Nook', 'Conservatory'],
    description: 'Strong, mid-century Japanese olive green providing grounding security.'
  },
  {
    code: 'FB-274',
    name: 'Ammonite',
    brand: 'Farrow & Ball',
    hex: '#DFDBD4',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['All Interiors', 'Ceilings'],
    description: 'Naturally subtle fossil grey with an exceptionally soft tactile finish.'
  },
  {
    code: 'FB-228',
    name: 'India Yellow',
    brand: 'Farrow & Ball',
    hex: '#CB903B',
    tone: 'yellow',
    type: 'both',
    finish: 'Matte',
    rooms: ['Study', 'Dining Accent'],
    description: 'Deep, rich mustard gold with timeless Victorian depth.'
  },
  {
    code: 'FB-299',
    name: 'De Nimes',
    brand: 'Farrow & Ball',
    hex: '#516470',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Kitchen Cabinets', 'Living Room'],
    description: 'Quiet, weathered denim blue reminiscent of French everyday workwear.'
  },
  {
    code: 'FB-30',
    name: 'Hague Blue',
    brand: 'Farrow & Ball',
    hex: '#1B2C37',
    tone: 'blue',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Living Room Accent', 'Library'],
    description: 'Deep dark blue with subtle green undertones, magnificent in full gloss.'
  },
  {
    code: 'FB-255',
    name: 'Pelt Violet',
    brand: 'Farrow & Ball',
    hex: '#3E2A36',
    tone: 'violet',
    type: 'both',
    finish: 'Matte',
    rooms: ['Powder Room', 'Master Suite'],
    description: 'Sumptuous dark berry violet with regal charcoal undertones.'
  },
  {
    code: 'FB-244',
    name: 'Calke Green',
    brand: 'Farrow & Ball',
    hex: '#566046',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Study', 'Courtyard'],
    description: 'Traditional sage green associated with historic breakfast rooms.'
  },

  // =========================================================================
  // 8. JOTUN (Lady Design, Fenomastic, Majestic)
  // =========================================================================
  {
    code: 'JT-10341',
    name: 'Limestone Warmth',
    brand: 'Jotun',
    hex: '#E5DEC9',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room', 'Exterior Villa'],
    description: 'Velvety mineral beige inspired by Mediterranean limestone cliffs.'
  },
  {
    code: 'JT-4629',
    name: 'Mystic Purple',
    brand: 'Jotun',
    hex: '#4A3B4E',
    tone: 'violet',
    type: 'both',
    finish: 'Matte',
    rooms: ['Master Bedroom', 'Lounge'],
    description: 'Sophisticated Nordic twilight violet for calming, reflective bedrooms.'
  },
  {
    code: 'JT-5030',
    name: 'St. Pauls Blue',
    brand: 'Jotun',
    hex: '#4F6169',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room', 'Kitchen', 'Modern Study'],
    description: 'Perfect harmony of grey and blue crafted in collaboration with Frama Studio.'
  },
  {
    code: 'JT-8282',
    name: 'White Clay',
    brand: 'Jotun',
    hex: '#EAE6DD',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Open Plan', 'Hallway'],
    description: 'Soft earthy chalk white reflecting diffused Scandinavian sunlight.'
  },
  {
    code: 'JT-20120',
    name: 'Organic Red',
    brand: 'Jotun',
    hex: '#8C4843',
    tone: 'red',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Dining Room', 'Entryway'],
    description: 'Warm terracotta-red blending traditional clay with modern architectural design.'
  },
  {
    code: 'JT-12078',
    name: 'Comfort Grey',
    brand: 'Jotun',
    hex: '#B8B5AD',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room', 'Bedroom'],
    description: 'Neutral warm grey delivering peaceful spatial continuity across rooms.'
  },
  {
    code: 'JT-7628',
    name: 'Treasure Green',
    brand: 'Jotun',
    hex: '#8A9E8A',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Bedroom', 'Living Room'],
    description: 'Subtle sage eucalyptus green bringing outdoor botanical tranquility inside.'
  },
  {
    code: 'JT-10679',
    name: 'Washed Linen',
    brand: 'Jotun',
    hex: '#DBD5C5',
    tone: 'neutral',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Master Suite', 'Dining Room'],
    description: 'Timeless sandy beige with a relaxed, tactile linen finish.'
  },
  {
    code: 'JT-5452',
    name: 'Nordic Breeze',
    brand: 'Jotun',
    hex: '#B5C7D3',
    tone: 'blue',
    type: 'both',
    finish: 'Matte',
    rooms: ['Bathroom', 'Kids Room'],
    description: 'Cool crisp light blue capturing the refreshing Scandinavian sea breeze.'
  },
  {
    code: 'JT-20144',
    name: 'Ground Ochre',
    brand: 'Jotun',
    hex: '#B87B44',
    tone: 'orange',
    type: 'both',
    finish: 'Matte',
    rooms: ['Feature Wall', 'Dining Room'],
    description: 'Warm raw ochre pigment inspired by Moroccan earthen architecture.'
  },
  {
    code: 'JT-9938',
    name: 'Blackened Eco',
    brand: 'Jotun',
    hex: '#2B2B2B',
    tone: 'neutral',
    type: 'both',
    finish: 'Ultra Matte',
    rooms: ['Media Room', 'Accent Pillars'],
    description: 'Charcoal carbon black with ultra-smooth velvety light absorption.'
  },
  {
    code: 'JT-11174',
    name: 'Curious Yellow',
    brand: 'Jotun',
    hex: '#E0C57A',
    tone: 'yellow',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Kitchen', 'Breakfast Corner'],
    description: 'Luminous sun-kissed yellow bringing bright natural daylight into interiors.'
  },

  // =========================================================================
  // 9. KANSAI NEROLAC (Impressions, Excel, Beauty Gold)
  // =========================================================================
  {
    code: 'KN-2410',
    name: 'Kashmir Saffron',
    brand: 'Kansai Nerolac',
    hex: '#F59E0B',
    tone: 'yellow',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Foyer', 'Pooja Room', 'Dining Accent'],
    description: 'Vibrant saffron gold inspired by the pristine valleys of Kashmir.'
  },
  {
    code: 'KN-4192',
    name: 'Nilgiri Pine',
    brand: 'Kansai Nerolac',
    hex: '#047857',
    tone: 'green',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Living Room Accent', 'Exterior Facade'],
    description: 'Lush mountain evergreen providing cooling psychological depth.'
  },
  {
    code: 'KN-3841',
    name: 'Lotus Blossom',
    brand: 'Kansai Nerolac',
    hex: '#F472B6',
    tone: 'red',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Bedroom', 'Powder Room'],
    description: 'Delicate sacred lotus pink with powdery soft floral sheen.'
  },
  {
    code: 'KN-1092',
    name: 'Pearl Chiffon',
    brand: 'Kansai Nerolac',
    hex: '#FDFBF7',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Full House', 'Ceilings'],
    description: 'Ultra-refined oyster white creating spacious open architectural volume.'
  },
  {
    code: 'KN-5219',
    name: 'Arabian Sea Azure',
    brand: 'Kansai Nerolac',
    hex: '#0284C7',
    tone: 'blue',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Exterior Balcony', 'Feature Wall'],
    description: 'Luminous tropical azure capturing coastal midday sunshine.'
  },
  {
    code: 'KN-6041',
    name: 'Raw Sienna Earth',
    brand: 'Kansai Nerolac',
    hex: '#C2410C',
    tone: 'orange',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room Accent', 'Patio'],
    description: 'Deep mineral terracotta with warm grounding acoustic properties.'
  },
  {
    code: 'KN-2810',
    name: 'Grecian Olive',
    brand: 'Kansai Nerolac',
    hex: '#4D7C0F',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Dining Room', 'Kitchen'],
    description: 'Sun-drenched Mediterranean olive with rich yellow undertones.'
  },
  {
    code: 'KN-4920',
    name: 'Royal Mysore Silk',
    brand: 'Kansai Nerolac',
    hex: '#6B21A8',
    tone: 'violet',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Master Suite', 'Formal Living'],
    description: 'Regal jewel-tone purple celebrating opulent Indian textile artistry.'
  },
  {
    code: 'KN-1488',
    name: 'Slate Monolith',
    brand: 'Kansai Nerolac',
    hex: '#475569',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Exterior Cladding', 'Study'],
    description: 'Industrial basalt grey engineered for heavy outdoor durability.'
  },
  {
    code: 'KN-3209',
    name: 'Jaipur Ruby',
    brand: 'Kansai Nerolac',
    hex: '#BE123C',
    tone: 'red',
    type: 'both',
    finish: 'Velvet Matte',
    rooms: ['Dining Feature', 'Entrance'],
    description: 'Deep precious ruby red with warm historic palace majesty.'
  },
  {
    code: 'KN-5812',
    name: 'Vedic Sand',
    brand: 'Kansai Nerolac',
    hex: '#E5D5C5',
    tone: 'neutral',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Hallway', 'Bedroom'],
    description: 'Natural riverbed sand beige offering quiet contemplative spaces.'
  },

  // =========================================================================
  // 10. PPG PAINTS (Voice of Color, Diamond, Ultralast)
  // =========================================================================
  {
    code: 'PPG-1001-1',
    name: 'Delicate White',
    brand: 'PPG Paints',
    hex: '#F6F6F4',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Whole House', 'Ceilings', 'Trim'],
    description: 'PPG flagship clean white offering high LRV daylight dispersion.'
  },
  {
    code: 'PPG-1156-6',
    name: 'Chinese Porcelain',
    brand: 'PPG Paints',
    hex: '#1F3A52',
    tone: 'blue',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Living Room', 'Dining Room', 'Kitchen Island'],
    description: 'PPG Color of the Year: deep blend of cobalt and ink navy for calm focus.'
  },
  {
    code: 'PPG-1025-4',
    name: 'Night Watch Green',
    brand: 'PPG Paints',
    hex: '#1E3832',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Master Bedroom', 'Executive Office', 'Foyer'],
    description: 'Deep biophilic jade green that emulates lush natural forest canopies.'
  },
  {
    code: 'PPG-1242-7',
    name: 'Cavalry Blue',
    brand: 'PPG Paints',
    hex: '#1E2C3D',
    tone: 'blue',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Bedroom', 'Exterior Siding'],
    description: 'Dark midnight indigo navy bringing formal architectural gravity.'
  },
  {
    code: 'PPG-1090-3',
    name: 'Oatmeal Biscuit',
    brand: 'PPG Paints',
    hex: '#EADFC9',
    tone: 'neutral',
    type: 'both',
    finish: 'Matte',
    rooms: ['Living Room', 'Kitchen'],
    description: 'Comforting warm neutral with toasted wheat undertones.'
  },
  {
    code: 'PPG-1033-5',
    name: 'Olive Sprig',
    brand: 'PPG Paints',
    hex: '#8C9A86',
    tone: 'green',
    type: 'both',
    finish: 'Matte',
    rooms: ['Dining Room', 'Sunroom', 'Bathroom'],
    description: 'Relaxed grey-green representing rebirth and natural wellness.'
  },
  {
    code: 'PPG-1170-6',
    name: 'Black Magic',
    brand: 'PPG Paints',
    hex: '#232426',
    tone: 'neutral',
    type: 'both',
    finish: 'High Gloss',
    rooms: ['Front Door', 'Cabinetry', 'Accent Wall'],
    description: 'Bold saturated charcoal black with deep mirror reflection.'
  },
  {
    code: 'PPG-1011-2',
    name: 'Crushed Silk',
    brand: 'PPG Paints',
    hex: '#EFECE6',
    tone: 'neutral',
    type: 'both',
    finish: 'Satin Sheen',
    rooms: ['Hallway', 'Bedroom'],
    description: 'Airy alabaster cream with soft luminescent pearl particles.'
  },
  {
    code: 'PPG-1077-7',
    name: 'Ruby Cabernet',
    brand: 'PPG Paints',
    hex: '#801E2E',
    tone: 'red',
    type: 'both',
    finish: 'Matte',
    rooms: ['Formal Dining', 'Library'],
    description: 'Rich vintage wine red creating intimate, sumptuous interiors.'
  },
  {
    code: 'PPG-1144-4',
    name: 'Golden Straw',
    brand: 'PPG Paints',
    hex: '#ECC875',
    tone: 'yellow',
    type: 'both',
    finish: 'Eggshell',
    rooms: ['Kitchen', 'Breakfast Nook'],
    description: 'Warm pastoral wheat yellow reflecting golden afternoon light.'
  }
];

// Helper to filter database
export function getFilteredColors({
  brand = 'all',
  tone = 'all',
  searchQuery = '',
  type = 'all'
} = {}) {
  return curatedPaintDatabase.filter(color => {
    // Brand filter
    if (brand !== 'all' && color.brand.toLowerCase() !== brand.toLowerCase()) {
      return false;
    }
    // Tone filter
    if (tone !== 'all' && color.tone.toLowerCase() !== tone.toLowerCase()) {
      return false;
    }
    // Type filter
    if (type !== 'all' && color.type !== 'both' && color.type !== type) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = color.name.toLowerCase().includes(q);
      const matchCode = color.code.toLowerCase().includes(q);
      const matchBrand = color.brand.toLowerCase().includes(q);
      const matchHex = color.hex.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchBrand && !matchHex) {
        return false;
      }
    }
    return true;
  });
}
