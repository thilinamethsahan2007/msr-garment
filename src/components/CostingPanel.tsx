import React from 'react';
import { CostBreakdown } from '../types';
import { formatCurrency, getQuantityDiscount } from '../hooks/useCostCalculator';
import {
  DollarSign,
  Scissors,
  Paintbrush,
  AlertTriangle,
  Package,
  TrendingUp,
  Calculator,
  Percent,
} from 'lucide-react';

interface CostingPanelProps {
  costBreakdown: CostBreakdown;
  quantity: number;
  marginPercentage: number;
  onMarginChange: (margin: number) => void;
}

const CostingPanel: React.FC<CostingPanelProps> = ({
  costBreakdown,
  quantity,
  marginPercentage,
  onMarginChange,
}) => {
  const discount = getQuantityDiscount(quantity);

  const costItems = [
    {
      icon: Scissors,
      label: 'Fabric Cost',
      value: costBreakdown.fabricCost,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Paintbrush,
      label: 'Labor Cost',
      value: costBreakdown.laborCost,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Paintbrush,
      label: 'Printing/Branding',
      value: costBreakdown.printingCost,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      icon: AlertTriangle,
      label: 'Wastage (5%)',
      value: costBreakdown.wastage,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Package,
      label: 'Packaging',
      value: costBreakdown.packaging,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          Cost Breakdown
        </h3>
        {discount > 0 && (
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            {discount}% Volume Discount
          </span>
        )}
      </div>

      {/* Cost Items */}
      <div className="space-y-2">
        {costItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${item.bgColor}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-sm text-gray-700">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(costBreakdown.subtotal)}
          </span>
        </div>
      </div>

      {/* Margin Slider */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-500" />
            Profit Margin
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={marginPercentage}
              onChange={(e) => onMarginChange(Number(e.target.value))}
              min="0"
              max="100"
              className="w-16 px-2 py-1 text-sm text-right border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>
        <input
          type="range"
          value={marginPercentage}
          onChange={(e) => onMarginChange(Number(e.target.value))}
          min="0"
          max="100"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Margin Amount</span>
          <span className="text-sm font-medium text-indigo-600">
            +{formatCurrency(costBreakdown.margin)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-300">Total Order Value</span>
          <span className="text-2xl font-bold">
            {formatCurrency(costBreakdown.total)}
          </span>
        </div>
        <div className="h-px bg-gray-700 my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-300">Unit Price</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-green-400">
              {formatCurrency(costBreakdown.unitPrice)}
            </span>
            <span className="text-xs text-gray-400 block">per piece</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {quantity > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <DollarSign className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Cost per Unit</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(costBreakdown.subtotal / quantity)}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg text-center">
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Profit per Unit</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(costBreakdown.margin / quantity)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostingPanel;
