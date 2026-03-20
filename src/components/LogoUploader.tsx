import React, { useCallback, useState } from 'react';
import { Logo, PrintMethod } from '../types';
import { Upload, X, Move, Maximize2, Trash2 } from 'lucide-react';

interface LogoUploaderProps {
  logos: Logo[];
  onAddLogo: (logo: Logo) => void;
  onRemoveLogo: (logoId: string) => void;
  onUpdateLogo: (logo: Logo) => void;
}

const placements = [
  { value: 'left-chest', label: 'Left Chest' },
  { value: 'right-chest', label: 'Right Chest' },
  { value: 'center-chest', label: 'Center Chest' },
  { value: 'back', label: 'Upper Back' },
  { value: 'back-center', label: 'Back Center' },
  { value: 'sleeve-left', label: 'Left Sleeve' },
  { value: 'sleeve-right', label: 'Right Sleeve' },
] as const;

const printMethods: { value: PrintMethod; label: string; description: string }[] = [
  { value: 'screen-print', label: 'Screen Print', description: 'Best for bulk orders' },
  { value: 'embroidery', label: 'Embroidery', description: 'Premium, durable finish' },
  { value: 'dtg', label: 'DTG Print', description: 'Full color, small orders' },
  { value: 'heat-transfer', label: 'Heat Transfer', description: 'Versatile, detailed designs' },
  { value: 'sublimation', label: 'Sublimation', description: 'Vivid colors, polyester only' },
];

const LogoUploader: React.FC<LogoUploaderProps> = ({
  logos,
  onAddLogo,
  onRemoveLogo,
  onUpdateLogo,
}) => {
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newLogo: Logo = {
          id: `logo-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          imageUrl: event.target?.result as string,
          position: {
            x: 0,
            y: 0,
            placement: 'left-chest',
          },
          size: {
            width: 40,
            height: 35,
          },
          printMethod: 'embroidery',
        };
        onAddLogo(newLogo);
        setSelectedLogoId(newLogo.id);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }, [onAddLogo]);

  const selectedLogo = logos.find(l => l.id === selectedLogoId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Logos & Branding
        </label>
        <span className="text-xs text-gray-500">{logos.length} logo(s)</span>
      </div>

      {/* Upload Button */}
      <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="text-center">
          <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">Click to upload logo</span>
          <span className="text-xs text-gray-400 block">PNG, JPG, SVG</span>
        </div>
      </label>

      {/* Uploaded Logos */}
      {logos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Uploaded Logos
          </p>
          <div className="grid grid-cols-3 gap-2">
            {logos.map((logo) => (
              <div
                key={logo.id}
                onClick={() => setSelectedLogoId(logo.id)}
                className={`
                  relative p-2 border rounded-lg cursor-pointer transition-all
                  ${selectedLogoId === logo.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="w-full h-12 object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLogo(logo.id);
                    if (selectedLogoId === logo.id) setSelectedLogoId(null);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logo Settings */}
      {selectedLogo && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Logo Settings</p>
            <button
              onClick={() => {
                onRemoveLogo(selectedLogo.id);
                setSelectedLogoId(null);
              }}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Placement */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 flex items-center gap-1">
              <Move className="w-3 h-3" /> Placement
            </label>
            <select
              value={selectedLogo.position.placement}
              onChange={(e) => onUpdateLogo({
                ...selectedLogo,
                position: { ...selectedLogo.position, placement: e.target.value as any },
              })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {placements.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 flex items-center gap-1">
              <Maximize2 className="w-3 h-3" /> Size (width x height)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={selectedLogo.size.width}
                onChange={(e) => onUpdateLogo({
                  ...selectedLogo,
                  size: { ...selectedLogo.size, width: Number(e.target.value) },
                })}
                min="20"
                max="100"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Width"
              />
              <span className="text-gray-400 self-center">x</span>
              <input
                type="number"
                value={selectedLogo.size.height}
                onChange={(e) => onUpdateLogo({
                  ...selectedLogo,
                  size: { ...selectedLogo.size, height: Number(e.target.value) },
                })}
                min="20"
                max="100"
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Height"
              />
            </div>
          </div>

          {/* Print Method */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500">Print Method</label>
            <select
              value={selectedLogo.printMethod}
              onChange={(e) => onUpdateLogo({
                ...selectedLogo,
                printMethod: e.target.value as PrintMethod,
              })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {printMethods.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label} - {pm.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
