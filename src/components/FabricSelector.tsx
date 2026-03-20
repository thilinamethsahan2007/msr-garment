import React from 'react';
import { FabricOption } from '../types';
import { Check, Sparkles } from 'lucide-react';

interface FabricSelectorProps {
  fabrics: FabricOption[];
  selectedFabric: FabricOption;
  onFabricChange: (fabric: FabricOption) => void;
}

const FabricSelector: React.FC<FabricSelectorProps> = ({
  fabrics,
  selectedFabric,
  onFabricChange,
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Fabric Type
      </label>

      <div className="grid grid-cols-1 gap-2">
        {fabrics.map((fabric) => (
          <button
            key={fabric.id}
            onClick={() => onFabricChange(fabric)}
            className={`
              relative p-3 rounded-lg border-2 text-left transition-all duration-200
              ${selectedFabric.id === fabric.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{fabric.name}</span>
                  {selectedFabric.id === fabric.id && (
                    <Check className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{fabric.description}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  ${fabric.pricePerMeter.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 block">/meter</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FabricSelector;
