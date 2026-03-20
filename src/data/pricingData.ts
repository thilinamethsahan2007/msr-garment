import { PricingData, ColorOption, FabricOption, LaborCost, PrintMethodCost } from '../types';

export const fabrics: FabricOption[] = [
  {
    id: 'cotton-pique',
    name: 'Cotton Pique',
    pricePerMeter: 8.50,
    description: 'Premium 100% cotton pique fabric, 220 GSM',
  },
  {
    id: 'poly-cotton',
    name: 'Poly-Cotton Blend',
    pricePerMeter: 6.75,
    description: '65% Polyester, 35% Cotton, 200 GSM',
  },
  {
    id: 'performance',
    name: 'Performance Dry-Fit',
    pricePerMeter: 9.25,
    description: '100% Moisture-wicking polyester, 180 GSM',
  },
  {
    id: 'organic-cotton',
    name: 'Organic Cotton',
    pricePerMeter: 11.00,
    description: 'GOTS certified organic cotton, 230 GSM',
  },
  {
    id: 'bamboo-blend',
    name: 'Bamboo Blend',
    pricePerMeter: 10.50,
    description: '70% Bamboo, 30% Cotton, eco-friendly, 210 GSM',
  },
  {
    id: 'mercerized-cotton',
    name: 'Mercerized Cotton',
    pricePerMeter: 12.50,
    description: 'Premium mercerized cotton with silk-like finish, 240 GSM',
  },
];

export const colors: ColorOption[] = [
  { id: 'white', name: 'White', hex: '#FFFFFF', pantone: '11-0601 TCX' },
  { id: 'black', name: 'Black', hex: '#1A1A1A', pantone: '19-0303 TCX' },
  { id: 'navy', name: 'Navy Blue', hex: '#1E3A5F', pantone: '19-4024 TCX' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#2563EB', pantone: '19-4037 TCX' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#7DD3FC', pantone: '14-4318 TCX' },
  { id: 'red', name: 'Red', hex: '#DC2626', pantone: '18-1763 TCX' },
  { id: 'burgundy', name: 'Burgundy', hex: '#7F1D1D', pantone: '19-1725 TCX' },
  { id: 'forest-green', name: 'Forest Green', hex: '#166534', pantone: '18-6024 TCX' },
  { id: 'lime', name: 'Lime Green', hex: '#84CC16', pantone: '15-0545 TCX' },
  { id: 'yellow', name: 'Yellow', hex: '#FACC15', pantone: '13-0858 TCX' },
  { id: 'orange', name: 'Orange', hex: '#EA580C', pantone: '16-1364 TCX' },
  { id: 'purple', name: 'Purple', hex: '#7C3AED', pantone: '18-3838 TCX' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', pantone: '17-2127 TCX' },
  { id: 'gray', name: 'Heather Gray', hex: '#9CA3AF', pantone: '17-5102 TCX' },
  { id: 'charcoal', name: 'Charcoal', hex: '#374151', pantone: '18-0601 TCX' },
  { id: 'beige', name: 'Beige', hex: '#D4B896', pantone: '14-1118 TCX' },
];

export const laborCosts: LaborCost[] = [
  {
    id: 'cutting',
    name: 'Cutting',
    costPerUnit: 0.45,
    description: 'Fabric cutting and preparation',
  },
  {
    id: 'sewing',
    name: 'Sewing & Assembly',
    costPerUnit: 2.25,
    description: 'Complete garment assembly',
  },
  {
    id: 'finishing',
    name: 'Finishing',
    costPerUnit: 0.65,
    description: 'Thread trimming, ironing, quality check',
  },
  {
    id: 'collar-attachment',
    name: 'Collar Attachment',
    costPerUnit: 0.35,
    description: 'Polo collar and placket assembly',
  },
  {
    id: 'button-attachment',
    name: 'Button Attachment',
    costPerUnit: 0.20,
    description: 'Button sewing and buttonhole creation',
  },
];

export const printMethodCosts: PrintMethodCost[] = [
  {
    method: 'screen-print',
    setupCost: 45.00,
    costPerPrint: 1.50,
    minQuantity: 24,
  },
  {
    method: 'embroidery',
    setupCost: 35.00,
    costPerPrint: 3.50,
    minQuantity: 12,
  },
  {
    method: 'dtg',
    setupCost: 0,
    costPerPrint: 5.00,
    minQuantity: 1,
  },
  {
    method: 'heat-transfer',
    setupCost: 25.00,
    costPerPrint: 2.00,
    minQuantity: 12,
  },
  {
    method: 'sublimation',
    setupCost: 60.00,
    costPerPrint: 2.75,
    minQuantity: 50,
  },
];

export const pricingData: PricingData = {
  fabrics,
  colors,
  laborCosts,
  printMethodCosts,
  wastagePercentage: 5,
  packagingCostPerUnit: 0.35,
};

// Fabric usage per polo shirt (in meters)
export const FABRIC_USAGE_PER_POLO = 1.2;

// Calculate total labor cost per unit
export const getTotalLaborCost = (): number => {
  return laborCosts.reduce((sum, labor) => sum + labor.costPerUnit, 0);
};

// Get print method cost details
export const getPrintMethodCost = (method: string): PrintMethodCost | undefined => {
  return printMethodCosts.find(p => p.method === method);
};

// Size-based fabric multipliers
export const sizeMultipliers: Record<string, number> = {
  XS: 0.85,
  S: 0.92,
  M: 1.0,
  L: 1.08,
  XL: 1.16,
  XXL: 1.25,
  XXXL: 1.35,
};

export default pricingData;
