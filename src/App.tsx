import { useState, useCallback } from 'react';
import { GarmentConfig, ColorOption, FabricOption, Logo, SizeDistribution } from './types';
import { colors, fabrics } from './data/pricingData';
import { useCostCalculator } from './hooks/useCostCalculator';

import Polo3DVisualizer from './components/Polo3DVisualizer';
import { ErrorBoundary } from './components/ErrorBoundary';
import ColorPicker from './components/ColorPicker';
import FabricSelector from './components/FabricSelector';
import LogoUploader from './components/LogoUploader';
import QuantitySelector from './components/QuantitySelector';
import CostingPanel from './components/CostingPanel';
import QuoteSummary from './components/QuoteSummary';

import {
  Shirt,
  Palette,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCw,
} from 'lucide-react';

function App() {
  // Garment configuration state
  const [config, setConfig] = useState<GarmentConfig>({
    garmentType: 'polo',
    fabric: fabrics[0],
    color: colors[2], // Navy Blue
    collarColor: colors[0], // White
    sleeveColor: colors[2], // Navy Blue (same as body)
    logos: [],
    quantity: 100,
    sizes: {
      XS: 5,
      S: 15,
      M: 30,
      L: 25,
      XL: 15,
      XXL: 7,
      XXXL: 3,
    },
  });

  const [marginPercentage, setMarginPercentage] = useState(25);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'design' | 'quantity'>('design');
  const [garmentView, setGarmentView] = useState<'front' | 'back'>('front');
  const [draggingLogo, setDraggingLogo] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Calculate costs
  const costBreakdown = useCostCalculator({ config, marginPercentage });

  // Handlers
  const handleColorChange = useCallback((color: ColorOption) => {
    setConfig(prev => ({ ...prev, color, sleeveColor: color }));
  }, []);

  const handleCollarColorChange = useCallback((color: ColorOption) => {
    setConfig(prev => ({ ...prev, collarColor: color }));
  }, []);

  const handleFabricChange = useCallback((fabric: FabricOption) => {
    setConfig(prev => ({ ...prev, fabric }));
  }, []);

  const handleAddLogo = useCallback((logo: Logo) => {
    setConfig(prev => ({ ...prev, logos: [...prev.logos, logo] }));
  }, []);

  const handleRemoveLogo = useCallback((logoId: string) => {
    setConfig(prev => ({
      ...prev,
      logos: prev.logos.filter(l => l.id !== logoId),
    }));
  }, []);

  const handleUpdateLogo = useCallback((updatedLogo: Logo) => {
    setConfig(prev => ({
      ...prev,
      logos: prev.logos.map(l => (l.id === updatedLogo.id ? updatedLogo : l)),
    }));
  }, []);

  // Logo drag handlers
  const handleLogoDragStart = useCallback((logoId: string, event: React.MouseEvent) => {
    const logo = config.logos.find(l => l.id === logoId);
    if (!logo) return;

    // Get the SVG coordinates from the mouse event
    const svg = event.currentTarget.closest('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (400 / rect.width);
    const y = (event.clientY - rect.top) * (500 / rect.height);

    setDragOffset({
      x: x - logo.position.x,
      y: y - logo.position.y
    });
    setDraggingLogo(logoId);
  }, [config.logos]);

  const handleLogoDrag = useCallback((event: React.MouseEvent) => {
    if (!draggingLogo) return;

    const svg = event.currentTarget.closest('svg');
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (400 / rect.width);
    const y = (event.clientY - rect.top) * (500 / rect.height);

    const newX = Math.max(0, Math.min(400, x - dragOffset.x));
    const newY = Math.max(0, Math.min(500, y - dragOffset.y));

    setConfig(prev => ({
      ...prev,
      logos: prev.logos.map(l =>
        l.id === draggingLogo
          ? { ...l, position: { ...l.position, x: newX, y: newY } }
          : l
      ),
    }));
  }, [draggingLogo, dragOffset]);

  const handleLogoDragEnd = useCallback(() => {
    setDraggingLogo(null);
  }, []);

  const handleQuantityChange = useCallback((quantity: number) => {
    setConfig(prev => ({ ...prev, quantity }));
  }, []);

  const handleSizesChange = useCallback((sizes: SizeDistribution) => {
    setConfig(prev => ({ ...prev, sizes }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  M.S.R. Apparels
                </h1>
                <p className="text-xs text-slate-500">
                  Real-Time Garment Costing & Visualizer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Design-to-Deal Tool</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">
                  ${costBreakdown.unitPrice.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500">per unit</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Design Controls */}
        <aside
          className={`
            bg-white border-r border-slate-200 transition-all duration-300 overflow-hidden
            ${leftPanelOpen ? 'w-80' : 'w-0'}
          `}
        >
          <div className="w-80 h-full overflow-y-auto">
            {/* Tabs */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-2 z-10">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${activeTab === 'design'
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Palette className="w-4 h-4" />
                  Design
                </button>
                <button
                  onClick={() => setActiveTab('quantity')}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all
                    ${activeTab === 'quantity'
                      ? 'bg-white text-slate-900 shadow'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Order
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {activeTab === 'design' ? (
                <>
                  {/* Fabric Selector */}
                  <FabricSelector
                    fabrics={fabrics}
                    selectedFabric={config.fabric}
                    onFabricChange={handleFabricChange}
                  />

                  {/* Body Color */}
                  <ColorPicker
                    colors={colors}
                    selectedColor={config.color}
                    onColorChange={handleColorChange}
                    label="Body Color"
                  />

                  {/* Collar Color */}
                  <ColorPicker
                    colors={colors}
                    selectedColor={config.collarColor}
                    onColorChange={handleCollarColorChange}
                    label="Collar Color"
                  />

                  {/* Logo Uploader */}
                  <LogoUploader
                    logos={config.logos}
                    onAddLogo={handleAddLogo}
                    onRemoveLogo={handleRemoveLogo}
                    onUpdateLogo={handleUpdateLogo}
                  />
                </>
              ) : (
                <>
                  {/* Quantity Selector */}
                  <QuantitySelector
                    quantity={config.quantity}
                    sizes={config.sizes}
                    onQuantityChange={handleQuantityChange}
                    onSizesChange={handleSizesChange}
                  />
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Toggle Left Panel */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-200 rounded-r-lg p-1.5 shadow-md hover:bg-slate-50 transition-all"
          style={{ left: leftPanelOpen ? '318px' : '0' }}
        >
          {leftPanelOpen ? (
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Center - Visualizer */}
        <main className="flex-1 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-2xl aspect-[4/5] bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <ErrorBoundary>
              <Polo3DVisualizer
                bodyColor={config.color.hex}
                collarColor={config.collarColor.hex}
                sleeveColor={config.sleeveColor.hex}
                logos={config.logos}
                view={garmentView}
                onLogoDragStart={handleLogoDragStart}
                onLogoDrag={handleLogoDrag}
                onLogoDragEnd={handleLogoDragEnd}
              />
            </ErrorBoundary>
          </div>

          {/* View Toggle Button */}
          <button
            onClick={() => setGarmentView(garmentView === 'front' ? 'back' : 'front')}
            className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-md hover:bg-slate-50 transition-all"
          >
            <RotateCw className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {garmentView === 'front' ? 'Show Back' : 'Show Front'}
            </span>
          </button>

          {/* Product Info Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-6 py-3 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: config.color.hex }}
              />
              <span className="text-sm text-slate-600">{config.color.name}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-sm text-slate-600">
              {config.fabric.name}
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-sm font-semibold text-slate-900">
              {config.quantity} units
            </div>
          </div>
        </main>

        {/* Toggle Right Panel */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-slate-200 rounded-l-lg p-1.5 shadow-md hover:bg-slate-50 transition-all"
          style={{ right: rightPanelOpen ? '382px' : '0' }}
        >
          {rightPanelOpen ? (
            <ChevronRight className="w-4 h-4 text-slate-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Right Panel - Costing */}
        <aside
          className={`
            bg-white border-l border-slate-200 transition-all duration-300 overflow-hidden
            ${rightPanelOpen ? 'w-96' : 'w-0'}
          `}
        >
          <div className="w-96 h-full overflow-y-auto p-4 space-y-6">
            {/* Costing Panel */}
            <CostingPanel
              costBreakdown={costBreakdown}
              quantity={config.quantity}
              marginPercentage={marginPercentage}
              onMarginChange={setMarginPercentage}
            />

            <div className="h-px bg-slate-200" />

            {/* Quote Summary */}
            <QuoteSummary config={config} costBreakdown={costBreakdown} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
