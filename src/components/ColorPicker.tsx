import React, { useState } from 'react';
import { ColorOption } from '../types';
import { Check, Palette, Hash } from 'lucide-react';

interface ColorPickerProps {
  colors: ColorOption[];
  selectedColor: ColorOption;
  onColorChange: (color: ColorOption) => void;
  label: string;
}

// Extended color palette with more options
const extendedColors: ColorOption[] = [
  // Whites & Neutrals
  { id: 'white', name: 'White', hex: '#FFFFFF', pantone: '11-0601 TCX' },
  { id: 'ivory', name: 'Ivory', hex: '#FFFFF0' },
  { id: 'cream', name: 'Cream', hex: '#FFFDD0' },
  { id: 'beige', name: 'Beige', hex: '#D4B896', pantone: '14-1118 TCX' },
  { id: 'tan', name: 'Tan', hex: '#D2B48C' },
  { id: 'khaki', name: 'Khaki', hex: '#C3B091' },
  // Grays
  { id: 'light-gray', name: 'Light Gray', hex: '#D1D5DB' },
  { id: 'gray', name: 'Heather Gray', hex: '#9CA3AF', pantone: '17-5102 TCX' },
  { id: 'dark-gray', name: 'Dark Gray', hex: '#6B7280' },
  { id: 'charcoal', name: 'Charcoal', hex: '#374151', pantone: '18-0601 TCX' },
  { id: 'black', name: 'Black', hex: '#1A1A1A', pantone: '19-0303 TCX' },
  // Blues
  { id: 'sky-blue', name: 'Sky Blue', hex: '#7DD3FC', pantone: '14-4318 TCX' },
  { id: 'light-blue', name: 'Light Blue', hex: '#93C5FD' },
  { id: 'baby-blue', name: 'Baby Blue', hex: '#BFDBFE' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#2563EB', pantone: '19-4037 TCX' },
  { id: 'navy', name: 'Navy Blue', hex: '#1E3A5F', pantone: '19-4024 TCX' },
  { id: 'midnight-blue', name: 'Midnight Blue', hex: '#1E3A8A' },
  { id: 'teal', name: 'Teal', hex: '#0D9488' },
  { id: 'cyan', name: 'Cyan', hex: '#06B6D4' },
  // Greens
  { id: 'mint', name: 'Mint', hex: '#A7F3D0' },
  { id: 'lime', name: 'Lime Green', hex: '#84CC16', pantone: '15-0545 TCX' },
  { id: 'green', name: 'Green', hex: '#22C55E' },
  { id: 'forest-green', name: 'Forest Green', hex: '#166534', pantone: '18-6024 TCX' },
  { id: 'olive', name: 'Olive', hex: '#6B8E23' },
  { id: 'army-green', name: 'Army Green', hex: '#4B5320' },
  // Reds
  { id: 'coral', name: 'Coral', hex: '#F87171' },
  { id: 'red', name: 'Red', hex: '#DC2626', pantone: '18-1763 TCX' },
  { id: 'crimson', name: 'Crimson', hex: '#B91C1C' },
  { id: 'burgundy', name: 'Burgundy', hex: '#7F1D1D', pantone: '19-1725 TCX' },
  { id: 'maroon', name: 'Maroon', hex: '#800000' },
  { id: 'wine', name: 'Wine', hex: '#722F37' },
  // Pinks
  { id: 'light-pink', name: 'Light Pink', hex: '#FBCFE8' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', pantone: '17-2127 TCX' },
  { id: 'hot-pink', name: 'Hot Pink', hex: '#DB2777' },
  { id: 'fuchsia', name: 'Fuchsia', hex: '#C026D3' },
  { id: 'magenta', name: 'Magenta', hex: '#A21CAF' },
  // Purples
  { id: 'lavender', name: 'Lavender', hex: '#DDD6FE' },
  { id: 'purple', name: 'Purple', hex: '#7C3AED', pantone: '18-3838 TCX' },
  { id: 'violet', name: 'Violet', hex: '#6D28D9' },
  { id: 'indigo', name: 'Indigo', hex: '#4F46E5' },
  { id: 'plum', name: 'Plum', hex: '#581C87' },
  // Oranges & Yellows
  { id: 'peach', name: 'Peach', hex: '#FDBA74' },
  { id: 'orange', name: 'Orange', hex: '#EA580C', pantone: '16-1364 TCX' },
  { id: 'burnt-orange', name: 'Burnt Orange', hex: '#C2410C' },
  { id: 'rust', name: 'Rust', hex: '#9A3412' },
  { id: 'lemon', name: 'Lemon', hex: '#FEF08A' },
  { id: 'yellow', name: 'Yellow', hex: '#FACC15', pantone: '13-0858 TCX' },
  { id: 'gold', name: 'Gold', hex: '#CA8A04' },
  { id: 'amber', name: 'Amber', hex: '#D97706' },
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorChange,
  label,
}) => {
  const [showExtended, setShowExtended] = useState(false);
  const [customHex, setCustomHex] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const displayColors = showExtended ? extendedColors : colors;

  const handleCustomColorApply = () => {
    let hex = customHex.trim();
    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }
    // Validate hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const customColor: ColorOption = {
        id: `custom-${hex}`,
        name: `Custom (${hex})`,
        hex: hex.toUpperCase(),
      };
      onColorChange(customColor);
      setCustomHex('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="text-sm text-gray-600">{selectedColor.name}</span>
        </div>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-8 gap-1.5">
        {displayColors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color)}
            className={`
              relative w-7 h-7 rounded-full transition-all duration-200
              ${selectedColor.hex === color.hex
                ? 'ring-2 ring-offset-1 ring-blue-500 scale-110 z-10'
                : 'hover:scale-110 hover:shadow-md hover:z-10'
              }
            `}
            style={{ backgroundColor: color.hex }}
            title={`${color.name} (${color.hex})${color.pantone ? ` - ${color.pantone}` : ''}`}
          >
            {selectedColor.hex === color.hex && (
              <Check
                className={`absolute inset-0 m-auto w-3.5 h-3.5 ${
                  isLightColor(color.hex) ? 'text-gray-800' : 'text-white'
                }`}
              />
            )}
            {isLightColor(color.hex) && (
              <span className="absolute inset-0 rounded-full border border-gray-300" />
            )}
          </button>
        ))}
      </div>

      {/* Show More / Custom Color Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowExtended(!showExtended)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
        >
          <Palette className="w-3 h-3" />
          {showExtended ? 'Show Less' : `Show ${extendedColors.length} Colors`}
        </button>
        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors"
        >
          <Hash className="w-3 h-3" />
          Custom Code
        </button>
      </div>

      {/* Custom Hex Input */}
      {showCustomInput && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1 flex-1">
            <span className="text-gray-500 text-sm font-mono">#</span>
            <input
              type="text"
              value={customHex.replace('#', '')}
              onChange={(e) => setCustomHex(e.target.value.replace('#', '').slice(0, 6))}
              placeholder="FF5733"
              maxLength={6}
              className="flex-1 px-2 py-1.5 text-sm font-mono border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 uppercase"
            />
          </div>
          {customHex.length === 6 && (
            <div
              className="w-8 h-8 rounded-md border border-gray-300"
              style={{ backgroundColor: `#${customHex}` }}
            />
          )}
          <button
            onClick={handleCustomColorApply}
            disabled={customHex.length !== 6}
            className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Current Color Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-2 py-1.5 rounded">
        <span>HEX: <span className="font-mono font-medium">{selectedColor.hex}</span></span>
        {selectedColor.pantone && (
          <span>Pantone: <span className="font-medium">{selectedColor.pantone}</span></span>
        )}
      </div>
    </div>
  );
};

// Helper function to determine if a color is light
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

export default ColorPicker;
