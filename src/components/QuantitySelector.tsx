import React from 'react';
import { SizeDistribution } from '../types';
import { Package, Users } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  sizes: SizeDistribution;
  onQuantityChange: (quantity: number) => void;
  onSizesChange: (sizes: SizeDistribution) => void;
}

const sizeLabels = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  sizes,
  onQuantityChange,
  onSizesChange,
}) => {
  const totalFromSizes = Object.values(sizes).reduce((sum, val) => sum + val, 0);

  const handleSizeChange = (size: keyof SizeDistribution, value: number) => {
    const newSizes = { ...sizes, [size]: Math.max(0, value) };
    onSizesChange(newSizes);
    const newTotal = Object.values(newSizes).reduce((sum, val) => sum + val, 0);
    onQuantityChange(newTotal);
  };

  const handleTotalQuantityChange = (newTotal: number) => {
    if (newTotal <= 0) {
      onQuantityChange(0);
      onSizesChange({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
      return;
    }

    // Distribute proportionally based on current distribution or evenly if all zero
    const currentTotal = totalFromSizes || 7; // Use 7 if all sizes are 0 (one per size)
    const ratio = newTotal / currentTotal;

    if (totalFromSizes === 0) {
      // Default distribution (bell curve style)
      const defaultDist: SizeDistribution = {
        XS: Math.round(newTotal * 0.05),
        S: Math.round(newTotal * 0.15),
        M: Math.round(newTotal * 0.30),
        L: Math.round(newTotal * 0.25),
        XL: Math.round(newTotal * 0.15),
        XXL: Math.round(newTotal * 0.07),
        XXXL: Math.round(newTotal * 0.03),
      };
      // Adjust for rounding errors
      const distTotal = Object.values(defaultDist).reduce((s, v) => s + v, 0);
      defaultDist.M += newTotal - distTotal;
      onSizesChange(defaultDist);
    } else {
      const newSizes: SizeDistribution = {
        XS: Math.round(sizes.XS * ratio),
        S: Math.round(sizes.S * ratio),
        M: Math.round(sizes.M * ratio),
        L: Math.round(sizes.L * ratio),
        XL: Math.round(sizes.XL * ratio),
        XXL: Math.round(sizes.XXL * ratio),
        XXXL: Math.round(sizes.XXXL * ratio),
      };
      // Adjust for rounding errors
      const distTotal = Object.values(newSizes).reduce((s, v) => s + v, 0);
      const diff = newTotal - distTotal;
      if (diff !== 0) {
        // Add/subtract from largest size bucket
        const largestSize = (Object.entries(newSizes) as [keyof SizeDistribution, number][])
          .reduce((a, b) => (b[1] > a[1] ? b : a))[0];
        newSizes[largestSize] += diff;
      }
      onSizesChange(newSizes);
    }
    onQuantityChange(newTotal);
  };

  const presetQuantities = [50, 100, 250, 500, 1000];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Order Quantity
        </label>
        <span className="text-lg font-bold text-blue-600">{quantity} units</span>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2 flex-wrap">
        {presetQuantities.map((preset) => (
          <button
            key={preset}
            onClick={() => handleTotalQuantityChange(preset)}
            className={`
              px-3 py-1.5 text-sm rounded-md border transition-all
              ${quantity === preset
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }
            `}
          >
            {preset}
          </button>
        ))}
        <input
          type="number"
          value={quantity}
          onChange={(e) => handleTotalQuantityChange(Number(e.target.value))}
          min="0"
          className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Custom"
        />
      </div>

      {/* Size Distribution */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <Users className="w-3 h-3" />
            SIZE DISTRIBUTION
          </label>
          {totalFromSizes !== quantity && (
            <span className="text-xs text-orange-500">
              Total: {totalFromSizes} (differs from quantity)
            </span>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {sizeLabels.map((size) => (
            <div key={size} className="text-center">
              <label className="text-xs font-medium text-gray-600 block mb-1">
                {size}
              </label>
              <input
                type="number"
                value={sizes[size]}
                onChange={(e) => handleSizeChange(size, Number(e.target.value))}
                min="0"
                className="w-full px-1 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Visual Distribution Bar */}
        {quantity > 0 && (
          <div className="mt-3">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
              {sizeLabels.map((size) => {
                const percentage = (sizes[size] / quantity) * 100;
                if (percentage === 0) return null;
                return (
                  <div
                    key={size}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 border-r border-white last:border-r-0"
                    style={{ width: `${percentage}%` }}
                    title={`${size}: ${sizes[size]} (${percentage.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>XS</span>
              <span>XXXL</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantitySelector;
