import { useMemo } from 'react';
import { GarmentConfig, CostBreakdown, SizeDistribution } from '../types';
import {
  getTotalLaborCost,
  getPrintMethodCost,
  FABRIC_USAGE_PER_POLO,
  sizeMultipliers,
  pricingData,
} from '../data/pricingData';

interface UseCostCalculatorProps {
  config: GarmentConfig;
  marginPercentage: number;
}

export function useCostCalculator({ config, marginPercentage }: UseCostCalculatorProps): CostBreakdown {
  return useMemo(() => {
    const { fabric, logos, quantity, sizes } = config;

    if (quantity === 0) {
      return {
        fabricCost: 0,
        laborCost: 0,
        printingCost: 0,
        wastage: 0,
        packaging: 0,
        subtotal: 0,
        margin: 0,
        total: 0,
        unitPrice: 0,
      };
    }

    // Calculate weighted fabric usage based on size distribution
    const calculateWeightedFabricUsage = (sizes: SizeDistribution): number => {
      let weightedUsage = 0;
      let totalUnits = 0;

      (Object.entries(sizes) as [keyof SizeDistribution, number][]).forEach(([size, count]) => {
        const multiplier = sizeMultipliers[size] || 1;
        weightedUsage += FABRIC_USAGE_PER_POLO * multiplier * count;
        totalUnits += count;
      });

      return totalUnits > 0 ? weightedUsage : FABRIC_USAGE_PER_POLO * quantity;
    };

    // 1. Fabric Cost
    const totalFabricUsage = calculateWeightedFabricUsage(sizes);
    const fabricCost = totalFabricUsage * fabric.pricePerMeter;

    // 2. Labor Cost
    const laborCostPerUnit = getTotalLaborCost();
    const laborCost = laborCostPerUnit * quantity;

    // 3. Printing Cost (for all logos)
    let printingCost = 0;
    logos.forEach((logo) => {
      const printMethod = getPrintMethodCost(logo.printMethod);
      if (printMethod) {
        // Setup cost (one-time per logo)
        printingCost += printMethod.setupCost;
        // Per-print cost
        printingCost += printMethod.costPerPrint * quantity;
      }
    });

    // 4. Wastage
    const subtotalBeforeWastage = fabricCost + laborCost + printingCost;
    const wastage = subtotalBeforeWastage * (pricingData.wastagePercentage / 100);

    // 5. Packaging
    const packaging = pricingData.packagingCostPerUnit * quantity;

    // 6. Subtotal
    const subtotal = subtotalBeforeWastage + wastage + packaging;

    // 7. Margin
    const margin = subtotal * (marginPercentage / 100);

    // 8. Total
    const total = subtotal + margin;

    // 9. Unit Price
    const unitPrice = quantity > 0 ? total / quantity : 0;

    return {
      fabricCost: Math.round(fabricCost * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      printingCost: Math.round(printingCost * 100) / 100,
      wastage: Math.round(wastage * 100) / 100,
      packaging: Math.round(packaging * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      margin: Math.round(margin * 100) / 100,
      total: Math.round(total * 100) / 100,
      unitPrice: Math.round(unitPrice * 100) / 100,
    };
  }, [config, marginPercentage]);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Calculate break-even quantity
export function calculateBreakEvenQuantity(
  fixedCosts: number,
  variableCostPerUnit: number,
  sellingPricePerUnit: number
): number {
  if (sellingPricePerUnit <= variableCostPerUnit) return Infinity;
  return Math.ceil(fixedCosts / (sellingPricePerUnit - variableCostPerUnit));
}

// Get quantity-based discount
export function getQuantityDiscount(quantity: number): number {
  if (quantity >= 1000) return 15;
  if (quantity >= 500) return 10;
  if (quantity >= 250) return 5;
  if (quantity >= 100) return 2;
  return 0;
}

export default useCostCalculator;
