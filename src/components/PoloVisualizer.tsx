import React from 'react';
import { Logo } from '../types';

interface PoloVisualizerProps {
  bodyColor: string;
  collarColor: string;
  sleeveColor: string;
  logos: Logo[];
  view?: 'front' | 'back';
  onLogoClick?: (logoId: string) => void;
  onLogoDragStart?: (logoId: string, event: React.MouseEvent) => void;
  onLogoDrag?: (event: React.MouseEvent) => void;
  onLogoDragEnd?: () => void;
}

const PoloVisualizer: React.FC<PoloVisualizerProps> = ({
  bodyColor,
  collarColor,
  sleeveColor,
  logos,
  view = 'front',
  onLogoClick,
  onLogoDragStart,
  onLogoDrag,
  onLogoDragEnd,
}) => {
  // Filter logos based on view
  const visibleLogos = view === 'front'
    ? logos.filter(l => l.position.placement !== 'back')
    : logos.filter(l => l.position.placement === 'back');

  const getLogoPosition = (logo: Logo) => {
    // If logo has custom position (dragged), use that
    if (logo.position.x !== 0 || logo.position.y !== 0) {
      return { x: logo.position.x, y: logo.position.y };
    }

    // Otherwise use default positions based on placement
    switch (logo.position.placement) {
      case 'left-chest':
        return { x: 145, y: 180 };
      case 'right-chest':
        return { x: 255, y: 180 };
      case 'center-chest':
        return { x: 200, y: 180 };
      case 'back':
        return { x: 200, y: 220 };
      case 'sleeve-left':
        return { x: 85, y: 160 };
      case 'sleeve-right':
        return { x: 315, y: 160 };
      default:
        return { x: 200, y: 200 };
    }
  };

  // Front View Component
  const FrontView = () => (
    <>
      {/* Left Sleeve */}
      <path
        d="M80 170 Q40 180 25 240 L35 280 Q45 290 70 280 L80 240 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <path
        d="M80 170 Q40 180 25 240 L35 280 Q45 290 70 280 L80 240 Z"
        fill="url(#fabricGradient)"
      />
      <path
        d="M80 170 Q40 180 25 240 L35 280 Q45 290 70 280 L80 240 Z"
        fill="url(#fabricTexture)"
      />

      {/* Sleeve cuff - left */}
      <path
        d="M25 235 Q22 250 35 278 Q45 288 68 278 L70 265 Q45 272 40 260 L42 242 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
        style={{ filter: 'brightness(0.9)' }}
      />

      {/* Right Sleeve */}
      <path
        d="M320 170 Q360 180 375 240 L365 280 Q355 290 330 280 L320 240 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <path
        d="M320 170 Q360 180 375 240 L365 280 Q355 290 330 280 L320 240 Z"
        fill="url(#fabricGradient)"
      />
      <path
        d="M320 170 Q360 180 375 240 L365 280 Q355 290 330 280 L320 240 Z"
        fill="url(#fabricTexture)"
      />

      {/* Sleeve cuff - right */}
      <path
        d="M375 235 Q378 250 365 278 Q355 288 332 278 L330 265 Q355 272 360 260 L358 242 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
        style={{ filter: 'brightness(0.9)' }}
      />

      {/* Main Body */}
      <path
        d="M120 130 Q100 140 80 170 L70 280 Q68 380 75 450 L325 450 Q332 380 330 280 L320 170 Q300 140 280 130 L260 130 Q250 150 200 150 Q150 150 140 130 Z"
        fill={bodyColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <path
        d="M120 130 Q100 140 80 170 L70 280 Q68 380 75 450 L325 450 Q332 380 330 280 L320 170 Q300 140 280 130 L260 130 Q250 150 200 150 Q150 150 140 130 Z"
        fill="url(#fabricGradient)"
      />
      <path
        d="M120 130 Q100 140 80 170 L70 280 Q68 380 75 450 L325 450 Q332 380 330 280 L320 170 Q300 140 280 130 L260 130 Q250 150 200 150 Q150 150 140 130 Z"
        fill="url(#fabricTexture)"
      />

      {/* Side seams */}
      <path
        d="M75 280 Q73 365 75 450"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
      <path
        d="M325 280 Q327 365 325 450"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />

      {/* Collar */}
      <path
        d="M140 130 Q150 115 160 110 L175 125 Q185 135 200 138 Q215 135 225 125 L240 110 Q250 115 260 130 Q250 135 240 138 L230 145 Q215 155 200 158 Q185 155 170 145 L160 138 Q150 135 140 130 Z"
        fill={collarColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />

      {/* Collar inner edge */}
      <path
        d="M160 115 Q180 130 200 132 Q220 130 240 115"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />

      {/* Collar fold line */}
      <path
        d="M145 128 Q170 138 200 140 Q230 138 255 128"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />

      {/* Placket */}
      <rect
        x="193"
        y="140"
        width="14"
        height="90"
        fill={bodyColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />

      {/* Placket inner line */}
      <line x1="200" y1="145" x2="200" y2="225" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

      {/* Buttons */}
      <circle cx="200" cy="160" r="4" fill="#F5F5F5" stroke="#DDD" strokeWidth="1" />
      <circle cx="200" cy="160" r="1.5" fill="#DDD" />

      <circle cx="200" cy="185" r="4" fill="#F5F5F5" stroke="#DDD" strokeWidth="1" />
      <circle cx="200" cy="185" r="1.5" fill="#DDD" />

      <circle cx="200" cy="210" r="4" fill="#F5F5F5" stroke="#DDD" strokeWidth="1" />
      <circle cx="200" cy="210" r="1.5" fill="#DDD" />

      {/* Bottom hem */}
      <path
        d="M75 445 Q200 455 325 445"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="2"
      />
    </>
  );

  // Back View Component
  const BackView = () => (
    <>
      {/* Left Sleeve - Back */}
      <path
        d="M80 170 Q40 180 25 240 L35 280 Q45 290 70 280 L80 240 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <path
        d="M80 170 Q40 180 25 240 L35 280 Q45 290 70 280 L80 240 Z"
        fill="url(#fabricGradient)"
      />
      <path
        d="M80 170 Q40 180 25 240 L35 280 Q45 290 70 280 L80 240 Z"
        fill="url(#fabricTexture)"
      />

      {/* Sleeve cuff - left */}
      <path
        d="M25 235 Q22 250 35 278 Q45 288 68 278 L70 265 Q45 272 40 260 L42 242 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
        style={{ filter: 'brightness(0.9)' }}
      />

      {/* Right Sleeve - Back */}
      <path
        d="M320 170 Q360 180 375 240 L365 280 Q355 290 330 280 L320 240 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <path
        d="M320 170 Q360 180 375 240 L365 280 Q355 290 330 280 L320 240 Z"
        fill="url(#fabricGradient)"
      />
      <path
        d="M320 170 Q360 180 375 240 L365 280 Q355 290 330 280 L320 240 Z"
        fill="url(#fabricTexture)"
      />

      {/* Sleeve cuff - right */}
      <path
        d="M375 235 Q378 250 365 278 Q355 288 332 278 L330 265 Q355 272 360 260 L358 242 Z"
        fill={sleeveColor}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
        style={{ filter: 'brightness(0.9)' }}
      />

      {/* Main Body - Back */}
      <path
        d="M120 130 Q100 140 80 170 L70 280 Q68 380 75 450 L325 450 Q332 380 330 280 L320 170 Q300 140 280 130 L260 130 Q250 150 200 150 Q150 150 140 130 Z"
        fill={bodyColor}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
        filter="url(#shadow)"
      />
      <path
        d="M120 130 Q100 140 80 170 L70 280 Q68 380 75 450 L325 450 Q332 380 330 280 L320 170 Q300 140 280 130 L260 130 Q250 150 200 150 Q150 150 140 130 Z"
        fill="url(#fabricGradient)"
      />
      <path
        d="M120 130 Q100 140 80 170 L70 280 Q68 380 75 450 L325 450 Q332 380 330 280 L320 170 Q300 140 280 130 L260 130 Q250 150 200 150 Q150 150 140 130 Z"
        fill="url(#fabricTexture)"
      />

      {/* Side seams */}
      <path
        d="M75 280 Q73 365 75 450"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
      <path
        d="M325 280 Q327 365 325 450"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />

      {/* Back Collar - More prominent than front */}
      <path
        d="M140 130 Q150 120 165 115 L185 130 Q200 135 215 130 L235 115 Q250 120 260 130 Q250 140 235 145 L215 155 Q200 160 185 155 L165 145 Q150 140 140 130 Z"
        fill={collarColor}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.5"
      />

      {/* Collar inner shadow */}
      <path
        d="M150 132 Q175 142 200 145 Q225 142 250 132"
        fill="none"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />

      {/* Center seam */}
      <line x1="200" y1="150" x2="200" y2="450" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />

      {/* Bottom hem */}
      <path
        d="M75 445 Q200 455 325 445"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="2"
      />
    </>
  );

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      onMouseMove={onLogoDrag}
      onMouseUp={onLogoDragEnd}
      onMouseLeave={onLogoDragEnd}
    >
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full max-w-md"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
      >
        {/* Definitions for gradients and patterns */}
        <defs>
          <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>

          <pattern id="fabricTexture" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="transparent" />
            <circle cx="1" cy="1" r="0.5" fill="rgba(0,0,0,0.03)" />
            <circle cx="3" cy="3" r="0.5" fill="rgba(255,255,255,0.03)" />
          </pattern>

          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Render Front or Back View */}
        {view === 'front' ? <FrontView /> : <BackView />}

        {/* Logos - Render based on current view */}
        {visibleLogos.map((logo) => {
          const pos = getLogoPosition(logo);
          return (
            <g
              key={logo.id}
              transform={`translate(${pos.x - logo.size.width / 2}, ${pos.y - logo.size.height / 2})`}
              onClick={() => onLogoClick?.(logo.id)}
              onMouseDown={(e) => onLogoDragStart?.(logo.id, e)}
              style={{ cursor: 'grab' }}
            >
              <image
                href={logo.imageUrl}
                width={logo.size.width}
                height={logo.size.height}
                preserveAspectRatio="xMidYMid meet"
              />
              <rect
                width={logo.size.width}
                height={logo.size.height}
                fill="transparent"
                stroke="rgba(59, 130, 246, 0.5)"
                strokeWidth="1"
                strokeDasharray="4,2"
                rx="2"
              />
            </g>
          );
        })}

        {/* Logo placement guides - Show based on view */}
        {visibleLogos.length === 0 && view === 'front' && (
          <>
            <rect
              x="130"
              y="165"
              width="40"
              height="35"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
              strokeDasharray="4,2"
              rx="2"
            />
            <text x="150" y="188" fontSize="6" fill="rgba(0,0,0,0.2)" textAnchor="middle">
              Left Chest
            </text>
          </>
        )}

        {visibleLogos.length === 0 && view === 'back' && (
          <>
            <rect
              x="175"
              y="200"
              width="50"
              height="40"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
              strokeDasharray="4,2"
              rx="2"
            />
            <text x="200" y="225" fontSize="6" fill="rgba(0,0,0,0.2)" textAnchor="middle">
              Back Center
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

export default PoloVisualizer;
