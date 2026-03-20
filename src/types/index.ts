// Type definitions for the Garment Costing & Visualizer application

export interface FabricOption {
  id: string;
  name: string;
  pricePerMeter: number;
  description: string;
  pattern?: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  pantone?: string;
}

export interface Logo {
  id: string;
  name: string;
  imageUrl: string;
  position: LogoPosition;
  size: LogoSize;
  printMethod: PrintMethod;
}

export interface LogoPosition {
  x: number;
  y: number;
  placement: 'left-chest' | 'right-chest' | 'center-chest' | 'back' | 'back-center' | 'sleeve-left' | 'sleeve-right';
}

export interface LogoSize {
  width: number;
  height: number;
}

export type PrintMethod = 'screen-print' | 'embroidery' | 'dtg' | 'heat-transfer' | 'sublimation';

export interface GarmentConfig {
  garmentType: 'polo';
  fabric: FabricOption;
  color: ColorOption;
  collarColor: ColorOption;
  sleeveColor: ColorOption;
  logos: Logo[];
  quantity: number;
  sizes: SizeDistribution;
}

export interface SizeDistribution {
  XS: number;
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
  XXXL: number;
}

export interface LaborCost {
  id: string;
  name: string;
  costPerUnit: number;
  description: string;
}

export interface PrintMethodCost {
  method: PrintMethod;
  setupCost: number;
  costPerPrint: number;
  minQuantity: number;
}

export interface CostBreakdown {
  fabricCost: number;
  laborCost: number;
  printingCost: number;
  wastage: number;
  packaging: number;
  subtotal: number;
  margin: number;
  total: number;
  unitPrice: number;
}

export interface QuoteDetails {
  quoteNumber: string;
  date: string;
  customerName: string;
  garmentConfig: GarmentConfig;
  costBreakdown: CostBreakdown;
  notes: string;
  validUntil: string;
}

export interface PricingData {
  fabrics: FabricOption[];
  colors: ColorOption[];
  laborCosts: LaborCost[];
  printMethodCosts: PrintMethodCost[];
  wastagePercentage: number;
  packagingCostPerUnit: number;
}
