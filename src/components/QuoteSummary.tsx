import React, { useState, useRef } from 'react';
import { GarmentConfig, CostBreakdown } from '../types';
import { formatCurrency } from '../hooks/useCostCalculator';
import {
  FileText,
  Download,
  Calendar,
  User,
  Hash,
  MessageSquare,
  Copy,
  Check,
  Printer,
  Image,
} from 'lucide-react';

interface QuoteSummaryProps {
  config: GarmentConfig;
  costBreakdown: CostBreakdown;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ config, costBreakdown }) => {
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const quoteNumber = `MSR-${Date.now().toString(36).toUpperCase()}`;
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Function to capture SVG as image data URL
  const captureSvgAsImage = async (): Promise<string> => {
    return new Promise((resolve) => {
      const svg = document.querySelector('.w-full.h-full.max-w-md') as SVGSVGElement;
      if (!svg) {
        resolve('');
        return;
      }

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svg);

      // Create a canvas to render the SVG
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('');
        return;
      }

      // Create image from SVG
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };

      img.src = url;
    });
  };

  // Function to download garment design as image
  const handleDownloadImage = async () => {
    const imageDataUrl = await captureSvgAsImage();
    if (!imageDataUrl) {
      alert('Unable to capture garment image. Please try again.');
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.download = `garment-design-${quoteNumber}.png`;
    link.href = imageDataUrl;
    link.click();
  };

  const generateQuoteText = () => {
    return `
═══════════════════════════════════════════════════
           M.S.R. APPARELS (PVT) LTD.
              QUOTATION
═══════════════════════════════════════════════════

Quote #: ${quoteNumber}
Date: ${today}
Valid Until: ${validUntil}
Customer: ${customerName || 'N/A'}

───────────────────────────────────────────────────
                 PRODUCT DETAILS
───────────────────────────────────────────────────

Product: Polo Shirt
Fabric: ${config.fabric.name}
Body Color: ${config.color.name}
Collar Color: ${config.collarColor.name}
Quantity: ${config.quantity} units

Size Distribution:
  XS: ${config.sizes.XS} | S: ${config.sizes.S} | M: ${config.sizes.M}
  L: ${config.sizes.L} | XL: ${config.sizes.XL} | XXL: ${config.sizes.XXL}
  XXXL: ${config.sizes.XXXL}

Logos/Branding: ${config.logos.length} item(s)
${config.logos.map(l => `  - ${l.name} (${l.position.placement}, ${l.printMethod})`).join('\n')}

───────────────────────────────────────────────────
                  COST BREAKDOWN
───────────────────────────────────────────────────

Fabric Cost:        ${formatCurrency(costBreakdown.fabricCost)}
Labor Cost:         ${formatCurrency(costBreakdown.laborCost)}
Printing/Branding:  ${formatCurrency(costBreakdown.printingCost)}
Wastage (5%):       ${formatCurrency(costBreakdown.wastage)}
Packaging:          ${formatCurrency(costBreakdown.packaging)}
                    ─────────────
Subtotal:           ${formatCurrency(costBreakdown.subtotal)}
Margin:             ${formatCurrency(costBreakdown.margin)}
                    ═════════════
TOTAL:              ${formatCurrency(costBreakdown.total)}

UNIT PRICE:         ${formatCurrency(costBreakdown.unitPrice)} per piece

───────────────────────────────────────────────────
                     NOTES
───────────────────────────────────────────────────
${notes || 'No additional notes.'}

═══════════════════════════════════════════════════
Terms & Conditions:
• 50% advance payment required to confirm order
• Balance due before shipment
• Production time: 15-20 working days
• Prices valid for 30 days from quote date

Thank you for your business!
M.S.R. Apparels (Pvt) Ltd.
═══════════════════════════════════════════════════
    `.trim();
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(generateQuoteText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintQuote = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quote ${quoteNumber} - M.S.R. Apparels</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #1a1a1a;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #1e3a5f;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e3a5f;
              margin: 0;
              font-size: 28px;
            }
            .header p {
              color: #666;
              margin: 5px 0 0;
            }
            .quote-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .quote-info div {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              background: #1e3a5f;
              color: white;
              padding: 10px 15px;
              margin: 0 0 15px;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 15px;
              border-bottom: 1px solid #eee;
            }
            .detail-row:hover {
              background: #f8f9fa;
            }
            .cost-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
            }
            .total-row {
              background: #1e3a5f;
              color: white;
              font-size: 18px;
              font-weight: bold;
            }
            .unit-price {
              background: #28a745;
              color: white;
              text-align: center;
              padding: 15px;
              font-size: 20px;
              margin-top: 15px;
              border-radius: 8px;
            }
            .terms {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              font-size: 12px;
              color: #666;
            }
            .terms h4 {
              margin: 0 0 10px;
              color: #1a1a1a;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>M.S.R. APPARELS (PVT) LTD.</h1>
            <p>Premium Apparel Manufacturing</p>
          </div>

          <div class="quote-info">
            <div>
              <strong>Quote #:</strong> ${quoteNumber}<br>
              <strong>Date:</strong> ${today}<br>
              <strong>Valid Until:</strong> ${validUntil}
            </div>
            <div>
              <strong>Customer:</strong><br>
              ${customerName || 'N/A'}
            </div>
          </div>

          <div class="section">
            <h3 class="section-title">Product Details</h3>
            <div class="detail-row"><span>Product</span><span>Polo Shirt</span></div>
            <div class="detail-row"><span>Fabric</span><span>${config.fabric.name}</span></div>
            <div class="detail-row"><span>Body Color</span><span>${config.color.name}</span></div>
            <div class="detail-row"><span>Collar Color</span><span>${config.collarColor.name}</span></div>
            <div class="detail-row"><span>Quantity</span><span>${config.quantity} units</span></div>
            <div class="detail-row">
              <span>Size Distribution</span>
              <span>XS:${config.sizes.XS} S:${config.sizes.S} M:${config.sizes.M} L:${config.sizes.L} XL:${config.sizes.XL} XXL:${config.sizes.XXL} XXXL:${config.sizes.XXXL}</span>
            </div>
            <div class="detail-row"><span>Logos/Branding</span><span>${config.logos.length} item(s)</span></div>
          </div>

          <div class="section">
            <h3 class="section-title">Cost Breakdown</h3>
            <div class="cost-row"><span>Fabric Cost</span><span>${formatCurrency(costBreakdown.fabricCost)}</span></div>
            <div class="cost-row"><span>Labor Cost</span><span>${formatCurrency(costBreakdown.laborCost)}</span></div>
            <div class="cost-row"><span>Printing/Branding</span><span>${formatCurrency(costBreakdown.printingCost)}</span></div>
            <div class="cost-row"><span>Wastage (5%)</span><span>${formatCurrency(costBreakdown.wastage)}</span></div>
            <div class="cost-row"><span>Packaging</span><span>${formatCurrency(costBreakdown.packaging)}</span></div>
            <div class="cost-row" style="border-top: 2px solid #ddd"><span>Subtotal</span><span>${formatCurrency(costBreakdown.subtotal)}</span></div>
            <div class="cost-row"><span>Margin</span><span>${formatCurrency(costBreakdown.margin)}</span></div>
            <div class="cost-row total-row"><span>TOTAL</span><span>${formatCurrency(costBreakdown.total)}</span></div>
            <div class="unit-price">Unit Price: ${formatCurrency(costBreakdown.unitPrice)} per piece</div>
          </div>

          ${notes ? `
          <div class="section">
            <h3 class="section-title">Notes</h3>
            <p style="padding: 15px;">${notes}</p>
          </div>
          ` : ''}

          <div class="terms">
            <h4>Terms & Conditions</h4>
            <ul>
              <li>50% advance payment required to confirm order</li>
              <li>Balance due before shipment</li>
              <li>Production time: 15-20 working days</li>
              <li>Prices valid for 30 days from quote date</li>
            </ul>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p><strong>M.S.R. Apparels (Pvt) Ltd.</strong></p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Quote Summary
        </h3>
        <span className="text-xs text-gray-500 font-mono">{quoteNumber}</span>
      </div>

      {/* Quote Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Valid until: {validUntil}</span>
        </div>

        {/* Customer Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <User className="w-3 h-3" /> Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Additional Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special requirements or notes..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Quick Summary */}
      <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Product</span>
          <span className="font-medium">Polo Shirt - {config.fabric.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Colors</span>
          <div className="flex items-center gap-1">
            <span
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: config.color.hex }}
            />
            <span
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: config.collarColor.hex }}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Quantity</span>
          <span className="font-medium">{config.quantity} units</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Logos</span>
          <span className="font-medium">{config.logos.length} item(s)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadImage}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Image className="w-4 h-4" />
          Download Image
        </button>
        <button
          onClick={handleCopyQuote}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Quote
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <button
          onClick={handlePrintQuote}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / PDF Quote
        </button>
      </div>
    </div>
  );
};

export default QuoteSummary;
