import { jsPDF } from 'jspdf';
import { getContrastColor } from '../core/invoice-color.math';
import { getInvoiceSpacing } from '../core/invoice-spacing';
import { getInvoiceTypography } from '../core/invoice-typography';
import type { InvoicePdfContext } from '../core/invoice-document.model';
import type { InvoiceTemplateDefinition } from '../core/invoice-design.types';
import { loadInvoiceImageAsDataUrl } from '../services/invoice-image.service';

type PdfColor = [number, number, number];
type InvoiceLine = { name?: string; description?: string; sku?: string; quantity?: number; unit?: string; unitPrice?: number; discountPercent?: number; gstEnabled?: boolean; gstRate?: number; total?: number; amount?: number; };
type InvoiceCustomer = { name?: string; mobile?: string; phone?: string; email?: string; address?: string; gstin?: string; };
type InvoiceData = { invoiceNumber?: string; invoiceNo?: string; date?: string; createdAt?: string; customer?: InvoiceCustomer; customerName?: string; customerMobile?: string; customerEmail?: string; customerAddress?: string; customerGstin?: string; items?: InvoiceLine[]; subtotal?: number; discountTotal?: number; taxableAmount?: number; gstTotal?: number; total?: number; grandTotal?: number; paidAmount?: number; paymentAmount?: number; dueAmount?: number; paymentMethod?: string; notes?: string; };
type InvoiceSettingsExtras = { signatureDataUrl?: string; sealDataUrl?: string; };

const COLORS = {
  ivory: [244, 249, 244] as PdfColor,
  paper: [255, 255, 255] as PdfColor,
  charcoal: [35, 57, 39] as PdfColor,
  charcoalSoft: [63, 84, 66] as PdfColor,
  gold: [62, 132, 70] as PdfColor,
  goldLight: [183, 216, 185] as PdfColor,
  goldPale: [230, 243, 230] as PdfColor,
  muted: [103, 122, 104] as PdfColor,
  line: [211, 227, 211] as PdfColor,
  white: [255, 255, 255] as PdfColor,
};

const template: InvoiceTemplateDefinition = {
  id: 'green-minimal',
  name: 'Green Minimal',
  description: 'Airy minimal layout with a fine green rule.',
  layout: 'minimal',
  pdfStyle: 'minimal',
  label: 'GREEN MINIMAL',
  typography: { family: 'helvetica', headingWeight: 'normal' },
  density: 'airy',
  previewClass: 'invoice-preview--green-minimal',
};

export default template;


function normalizeHex(value: unknown): string {
  const raw = String(value || '').trim();

  if (!raw) {
    return '#B88A45';
  }

  const hex = raw.startsWith('#') ? raw : `#${raw}`;

  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  return /^#[0-9a-fA-F]{6}$/.test(hex)
    ? hex
    : '#B88A45';
}

function hexToRgb(value: string): PdfColor {
  const hex = normalizeHex(value).slice(1);

  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function mix(
  first: PdfColor,
  second: PdfColor,
  amount: number,
): PdfColor {
  const factor = Math.max(0, Math.min(1, amount));

  return [
    Math.round(first[0] * (1 - factor) + second[0] * factor),
    Math.round(first[1] * (1 - factor) + second[1] * factor),
    Math.round(first[2] * (1 - factor) + second[2] * factor),
  ];
}

function safeNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function money(value: unknown): string {
  return safeNumber(value).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function compactMoney(value: unknown): string {
  return `Rs. ${money(value)}`;
}

function setFill(pdf: jsPDF, color: PdfColor): void {
  pdf.setFillColor(color[0], color[1], color[2]);
}

function setText(pdf: jsPDF, color: PdfColor): void {
  pdf.setTextColor(color[0], color[1], color[2]);
}

function setStroke(pdf: jsPDF, color: PdfColor): void {
  pdf.setDrawColor(color[0], color[1], color[2]);
}

function roundRect(
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 2,
  style: 'F' | 'S' | 'FD' = 'F',
): void {
  pdf.roundedRect(
    x,
    y,
    width,
    height,
    radius,
    radius,
    style,
  );
}

function getLines(
  pdf: jsPDF,
  value: unknown,
  width: number,
): string[] {
  const text = String(value ?? '').trim();

  if (!text) {
    return [];
  }

  return pdf.splitTextToSize(
    text,
    Math.max(5, width),
  ) as string[];
}

function drawText(
  pdf: jsPDF,
  value: unknown,
  x: number,
  y: number,
  options?: {
    width?: number;
    fontSize?: number;
    color?: PdfColor;
    bold?: boolean;
    align?: 'left' | 'center' | 'right';
    maxLines?: number;
  },
): number {
  const {
    width,
    fontSize = 8,
    color = COLORS.charcoal,
    bold = false,
    align = 'left',
    maxLines,
  } = options || {};

  const text = String(value ?? '').trim();

  if (!text) {
    return 0;
  }

  pdf.setFont('helvetica', bold ? 'bold' : 'normal');
  pdf.setFontSize(fontSize);
  setText(pdf, color);

  let lines = width
    ? getLines(pdf, text, width)
    : [text];

  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);

    const lastIndex = lines.length - 1;

    lines[lastIndex] = `${lines[lastIndex].trim()}...`;
  }

  pdf.text(lines, x, y, { align });

  return lines.length;
}

function drawRule(
  pdf: jsPDF,
  x1: number,
  y: number,
  x2: number,
  color: PdfColor = COLORS.line,
  width = 0.25,
): void {
  setStroke(pdf, color);
  pdf.setLineWidth(width);
  pdf.line(x1, y, x2, y);
}

function drawLabel(
  pdf: jsPDF,
  label: string,
  x: number,
  y: number,
): void {
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.3);
  setText(pdf, COLORS.gold);
  pdf.text(label.toUpperCase(), x, y);
}

function drawSectionTitle(
  pdf: jsPDF,
  title: string,
  x: number,
  y: number,
  width: number,
  monochrome: boolean,
): void {
  setFill(
    pdf,
    monochrome ? [238, 238, 238] : COLORS.goldPale,
  );

  roundRect(
    pdf,
    x,
    y - 4.2,
    width,
    7,
    1.2,
    'F',
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(pdf, COLORS.charcoal);
  pdf.text(title.toUpperCase(), x + 3, y);
}

function formatDate(value: unknown): string {
  if (!value) {
    return '-';
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Loads a logo and creates a circular PNG.
 * The source image is center-cropped into a square before clipping.
 */
async function loadCircularLogoDataUrl(
  source: string,
): Promise<string | null> {
  const dataUrl = await loadInvoiceImageAsDataUrl(source);

  if (!dataUrl) {
    return null;
  }

  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => {
      try {
        const size = 320;
        const canvas = document.createElement('canvas');

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(null);
          return;
        }

        const imageSize = Math.min(
          image.naturalWidth,
          image.naturalHeight,
        );

        const sourceX = (image.naturalWidth - imageSize) / 2;
        const sourceY = (image.naturalHeight - imageSize) / 2;

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          imageSize,
          imageSize,
          0,
          0,
          size,
          size,
        );

        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        console.error('[Amber Luxe] Circular logo error:', error);
        resolve(null);
      }
    };

    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}

function addImageSafely(
  pdf: jsPDF,
  source: string | null | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  if (!source) {
    return false;
  }

  try {
    const properties = pdf.getImageProperties(source);

    const ratio = properties.width / properties.height;

    let drawWidth = width;
    let drawHeight = height;

    if (ratio > width / height) {
      drawHeight = width / ratio;
    } else {
      drawWidth = height * ratio;
    }

    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;

    pdf.addImage(
      source,
      properties.fileType || 'PNG',
      drawX,
      drawY,
      drawWidth,
      drawHeight,
      undefined,
      'FAST',
    );

    return true;
  } catch {
    return false;
  }
}

function drawEnvelopeIcon(
  pdf: jsPDF,
  x: number,
  y: number,
  color: PdfColor,
): void {
  setStroke(pdf, color);
  pdf.setLineWidth(0.35);

  pdf.roundedRect(
    x,
    y - 2.3,
    3.6,
    2.5,
    0.35,
    0.35,
    'S',
  );

  pdf.line(x + 0.15, y - 2.1, x + 1.8, y - 0.9);
  pdf.line(x + 3.45, y - 2.1, x + 1.8, y - 0.9);
}

function drawPhoneIcon(
  pdf: jsPDF,
  x: number,
  y: number,
  color: PdfColor,
): void {
  setStroke(pdf, color);
  pdf.setLineWidth(0.65);

  pdf.roundedRect(
    x + 0.5,
    y - 3,
    2.1,
    3.6,
    0.45,
    0.45,
    'S',
  );

  pdf.line(
    x + 1.2,
    y - 0.1,
    x + 1.9,
    y - 0.1,
  );
}

function drawPaymentIcon(
  pdf: jsPDF,
  x: number,
  y: number,
  color: PdfColor,
): void {
  setStroke(pdf, color);
  pdf.setLineWidth(0.4);

  pdf.roundedRect(
    x,
    y - 3,
    4,
    2.8,
    0.4,
    0.4,
    'S',
  );

  pdf.line(
    x + 0.3,
    y - 1.3,
    x + 3.7,
    y - 1.3,
  );
}

function drawPageFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin: number,
  footerText: string,
  poweredByText: string,
  pageNumber: number,
  pageCount: number,
  monochrome: boolean,
): void {
  const footerY = pageHeight - 19;
  const contentWidth = pageWidth - margin * 2;

  const footerColor = monochrome
    ? [90, 90, 90] as PdfColor
    : COLORS.muted;

  const rightWidth = 18;
  const leftWidth = contentWidth - rightWidth - 3;

  drawRule(
    pdf,
    margin,
    footerY - 3,
    pageWidth - margin,
    monochrome ? [130, 130, 130] : COLORS.gold,
    0.5,
  );

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.2);
  setText(pdf, footerColor);

  const firstFooter = footerText.trim();

  if (firstFooter) {
    const lines = getLines(
      pdf,
      firstFooter,
      leftWidth,
    ).slice(0, 2);

    pdf.text(lines, margin, footerY + 1);
  }

  const secondFooter = poweredByText.trim();

  if (secondFooter) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6);

    setText(
      pdf,
      monochrome ? [65, 65, 65] : COLORS.charcoalSoft,
    );

    const lines = getLines(
      pdf,
      secondFooter,
      leftWidth,
    ).slice(0, 1);

    pdf.text(lines, margin, pageHeight - 8);
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);

  setText(
    pdf,
    monochrome ? [60, 60, 60] : COLORS.gold,
  );

  pdf.text(
    `${pageNumber}/${pageCount}`,
    pageWidth - margin,
    pageHeight - 8,
    { align: 'right' },
  );
}

export async function renderGreenMinimalInvoicePdf(
  context: InvoicePdfContext,
): Promise<jsPDF> {
  const invoice = context.invoice as InvoiceData;
  const settings = context.settings;

  const pageSize = settings.pageSize || 'a4';

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: pageSize,
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = pageWidth < 150 ? 10 : 14;
  const contentWidth = pageWidth - margin * 2;

  const contentBottom = pageHeight - 25;

  const configuredBrand = String(settings.primaryColor || '').trim();
  const brand = configuredBrand && configuredBrand.toLowerCase() !== '#ff4d6d' ? hexToRgb(configuredBrand) : COLORS.gold;
  const accent = brand;

  const monochrome = settings.printColor === 'bw';

  const dark = monochrome
    ? [35, 35, 35] as PdfColor
    : COLORS.charcoal;

  const gold = monochrome
    ? [100, 100, 100] as PdfColor
    : COLORS.gold;

  const paleGold = monochrome
    ? [238, 238, 238] as PdfColor
    : COLORS.goldPale;

  const lineColor = monochrome
    ? [205, 205, 205] as PdfColor
    : COLORS.line;

  const ivory = monochrome
    ? COLORS.white
    : COLORS.ivory;

  const paper = monochrome
    ? COLORS.white
    : COLORS.paper;

  const typography = getInvoiceTypography(
    'helvetica',
    'bold',
    'compact',
  );

  const spacing = getInvoiceSpacing('compact');
  void typography;
  void spacing;
  void getContrastColor;
  void mix;

  const customer = invoice.customer || {};
  const items = Array.isArray(invoice.items)
    ? invoice.items
    : [];

  const businessName = String(
    settings.businessName || 'Your Business',
  ).trim();

  const email = String(settings.email || '').trim();
  const phone = String(settings.phone || '').trim();
  const address = String(settings.address || '').trim();
  const gstin = String(settings.gstin || '').trim();

  const invoiceNumber = String(
    invoice.invoiceNumber || invoice.invoiceNo || '-',
  );

  const invoiceDate = formatDate(
    invoice.date || invoice.createdAt,
  );

  const subtotal = safeNumber(
    invoice.subtotal ??
    items.reduce(
      (sum, item) =>
        sum +
        safeNumber(item.quantity) *
        safeNumber(item.unitPrice),
      0,
    ),
  );

  const discountTotal = safeNumber(invoice.discountTotal);
  const taxableAmount = safeNumber(invoice.taxableAmount);
  const gstTotal = safeNumber(invoice.gstTotal);

  const grandTotal = safeNumber(
    invoice.grandTotal ?? invoice.total,
  );

  const paidAmount = safeNumber(
    invoice.paidAmount ?? invoice.paymentAmount,
  );

  const dueAmount = safeNumber(
    invoice.dueAmount ?? Math.max(0, grandTotal - paidAmount),
  );

  // Settings logo has priority over profile logo.
  const logoSource = String(
    settings.logoDataUrl || context.businessLogo || '',
  ).trim();

  const logoDataUrl = logoSource
    ? await loadCircularLogoDataUrl(logoSource)
    : null;

  let y = 0;

  const startNewPage = (): void => {
    pdf.addPage();

    setFill(pdf, ivory);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    y = margin + 5;
  };

  const ensureSpace = (height: number): void => {
    if (y + height > contentBottom) {
      startNewPage();
    }
  };

  // Background
  setFill(pdf, ivory);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header
  const headerHeight = 48; // green-minimal PDF layout: minimal

  setFill(pdf, paper);
  pdf.rect(0, 0, pageWidth, headerHeight, 'F');
  setStroke(pdf, gold); pdf.setLineWidth(1.1); pdf.line(margin, headerHeight - 2, pageWidth - margin, headerHeight - 2);
  setFill(pdf, gold); pdf.rect(margin, 0, 2.2, headerHeight - 2, 'F');

  const headerTextColor: PdfColor = [35, 43, 53];

  const logoX = margin;
  const logoY = 9;
  const logoSize = 20;

  if (logoDataUrl) {
    // Circular logo background and metallic border.
    setFill(pdf, COLORS.white);

    pdf.circle(
      logoX + logoSize / 2,
      logoY + logoSize / 2,
      logoSize / 2 + 0.9,
      'F',
    );

    setStroke(pdf, gold);
    pdf.setLineWidth(0.65);

    pdf.circle(
      logoX + logoSize / 2,
      logoY + logoSize / 2,
      logoSize / 2 + 0.9,
      'S',
    );

    pdf.addImage(
      logoDataUrl,
      'PNG',
      logoX,
      logoY,
      logoSize,
      logoSize,
      undefined,
      'FAST',
    );
  }

  const textX = logoDataUrl
    ? logoX + logoSize + 5
    : margin;

  const textWidth = pageWidth * 0.52;

  // Business name
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(
    businessName.length > 26 ? 16 : 19,
  );

  setText(pdf, headerTextColor);

  const businessLines = getLines(
    pdf,
    businessName,
    textWidth,
  ).slice(0, 2);

  pdf.text(businessLines, textX, 16);

  let contactY = 16 + Math.max(1, businessLines.length) * 6 + 1;

  const contactColor = monochrome
    ? [110, 110, 110] as PdfColor
    : [105, 113, 124] as PdfColor;

  // Email first
  if (email && contactY < 37) {
    drawEnvelopeIcon(
      pdf,
      textX,
      contactY - 0.5,
      gold,
    );

    drawText(
      pdf,
      email,
      textX + 5,
      contactY,
      {
        width: textWidth - 5,
        fontSize: 7,
        color: contactColor,
        maxLines: 1,
      },
    );

    contactY += 4.5;
  }

  // Mobile second
  if (phone && contactY < 41) {
    drawPhoneIcon(
      pdf,
      textX,
      contactY - 0.3,
      gold,
    );

    drawText(
      pdf,
      phone,
      textX + 5,
      contactY,
      {
        width: textWidth - 5,
        fontSize: 7,
        color: contactColor,
        maxLines: 1,
      },
    );

    contactY += 4.5;
  }

  // Business address
  if (address && contactY < 43) {
    drawText(
      pdf,
      address,
      textX,
      contactY,
      {
        width: textWidth,
        fontSize: 6.5,
        color: contactColor,
        maxLines: 1,
      },
    );

    contactY += 4;
  }

  // Business GSTIN
  if (gstin && contactY < 46) {
    drawText(
      pdf,
      `GSTIN: ${gstin}`,
      textX,
      contactY,
      {
        width: textWidth,
        fontSize: 6.5,
        color: contactColor,
        maxLines: 1,
      },
    );
  }

  // Invoice title
  const titleX = pageWidth - margin;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(21);

  setText(
    pdf,
    monochrome || true ? (headerTextColor) : COLORS.goldLight,
  );

  pdf.text(
    'INVOICE',
    titleX,
    17,
    { align: 'right' },
  );

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  setText(pdf, headerTextColor);

  pdf.text(
    'INVOICE DOCUMENT',
    titleX,
    23,
    { align: 'right' },
  );

  setFill(pdf, gold);

  roundRect(
    pdf,
    pageWidth - margin - 39,
    28,
    39,
    9,
    1.5,
    'F',
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(pdf, dark);

  pdf.text(
    invoiceNumber,
    pageWidth - margin - 19.5,
    33.7,
    { align: 'center' },
  );

  // Invoice metadata
  y = headerHeight + 8;

  const metaHeight = 19;

  setFill(pdf, paper);

  roundRect(
    pdf,
    margin,
    y,
    contentWidth,
    metaHeight,
    2,
    'F',
  );

  setStroke(pdf, lineColor);

  roundRect(
    pdf,
    margin,
    y,
    contentWidth,
    metaHeight,
    2,
    'S',
  );

  const metaColumnWidth = contentWidth / 2;

  drawLabel(
    pdf,
    'Invoice Number',
    margin + 4,
    y + 6,
  );

  drawText(
    pdf,
    invoiceNumber,
    margin + 4,
    y + 13,
    {
      fontSize: 9,
      bold: true,
      color: dark,
    },
  );

  drawLabel(
    pdf,
    'Invoice Date',
    margin + metaColumnWidth + 4,
    y + 6,
  );

  drawText(
    pdf,
    invoiceDate,
    margin + metaColumnWidth + 4,
    y + 13,
    {
      fontSize: 9,
      bold: true,
      color: dark,
    },
  );

  y += metaHeight + 8;

  // Customer details
  const customerName = String(
    customer.name ||
    invoice.customerName ||
    'Walk-in Customer',
  );

  const customerAddress = String(
    customer.address ||
    invoice.customerAddress ||
    '',
  );

  const customerMobile = String(
    customer.mobile ||
    customer.phone ||
    invoice.customerMobile ||
    '',
  );

  const customerEmail = String(
    customer.email ||
    invoice.customerEmail ||
    '',
  );

  const customerGstin = String(
    customer.gstin ||
    invoice.customerGstin ||
    '',
  );

  const customerDetails = [
    customerMobile ? `Mobile: ${customerMobile}` : '',
    customerEmail ? `Email: ${customerEmail}` : '',
    customerAddress ? `Address: ${customerAddress}` : '',
    customerGstin ? `GSTIN: ${customerGstin}` : '',
  ].filter(Boolean);

  const customerPanelHeight = Math.max(
    27,
    15 + customerDetails.length * 4,
  );

  ensureSpace(customerPanelHeight + 8);

  drawSectionTitle(
    pdf,
    'Bill To',
    margin,
    y + 2,
    contentWidth,
    monochrome,
  );

  setFill(pdf, paper);

  roundRect(
    pdf,
    margin,
    y + 5,
    contentWidth,
    customerPanelHeight,
    2,
    'F',
  );

  setStroke(pdf, lineColor);

  roundRect(
    pdf,
    margin,
    y + 5,
    contentWidth,
    customerPanelHeight,
    2,
    'S',
  );

  drawText(
    pdf,
    customerName,
    margin + 4,
    y + 13,
    {
      fontSize: 10,
      bold: true,
      color: dark,
    },
  );

  let customerY = y + 19;

  customerDetails.forEach((detail) => {
    drawText(
      pdf,
      detail,
      margin + 4,
      customerY,
      {
        width: contentWidth - 8,
        fontSize: 7,
        color: COLORS.muted,
        maxLines: 1,
      },
    );

    customerY += 4;
  });

  y += customerPanelHeight + 14;

  // Product table
  const tableHeaderHeight = 11;

  const columns = {
    description: margin + 3,
    quantity: margin + contentWidth * 0.57,
    rate: margin + contentWidth * 0.70,
    discount: margin + contentWidth * 0.80,
    tax: margin + contentWidth * 0.89,
    amount: pageWidth - margin - 3,
  };

  const descriptionWidth = contentWidth * 0.40;

  const drawTableHeader = (): void => {
    setFill(pdf, dark);

    roundRect(
      pdf,
      margin,
      y,
      contentWidth,
      tableHeaderHeight,
      1.5,
      'F',
    );

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.3);
    setText(pdf, COLORS.goldLight);

    pdf.text(
      'DESCRIPTION',
      columns.description,
      y + 7,
    );

    pdf.text(
      'QTY',
      columns.quantity,
      y + 7,
      { align: 'right' },
    );

    pdf.text(
      'RATE',
      columns.rate,
      y + 7,
      { align: 'right' },
    );

    pdf.text(
      'DISC.',
      columns.discount,
      y + 7,
      { align: 'right' },
    );

    pdf.text(
      'GST',
      columns.tax,
      y + 7,
      { align: 'right' },
    );

    pdf.text(
      'AMOUNT',
      columns.amount,
      y + 7,
      { align: 'right' },
    );

    y += tableHeaderHeight;
  };

  drawTableHeader();

  items.forEach((item, index) => {
    const name = String(
      item.name || `Item ${index + 1}`,
    );

    const description = String(
      item.description || '',
    ).trim();

    const sku = String(
      item.sku || '',
    ).trim();

    const productParts = [
      name,
      description,
      sku ? `SKU: ${sku}` : '',
    ].filter(Boolean);

    const productLines = productParts.flatMap(
      (part) => getLines(
        pdf,
        part,
        descriptionWidth - 5,
      ),
    );

    const quantity = safeNumber(item.quantity);
    const rate = safeNumber(item.unitPrice);

    const discountPercent = safeNumber(
      item.discountPercent,
    );

    const gstRate = item.gstEnabled === false
      ? 0
      : safeNumber(item.gstRate);

    const gross = quantity * rate;
    const discount = gross * discountPercent / 100;
    const taxable = gross - discount;
    const tax = taxable * gstRate / 100;

    const calculatedAmount = taxable + tax;

    const amount = Number.isFinite(Number(item.total))
      ? safeNumber(item.total)
      : Number.isFinite(Number(item.amount))
        ? safeNumber(item.amount)
        : calculatedAmount;

    const visibleProductLines = productLines.slice(0, 4);

    const rowHeight = Math.max(
      12,
      visibleProductLines.length * 3.5 + 5,
    );

    ensureSpace(rowHeight + tableHeaderHeight + 2);

    // New page: repeat table heading.
    if (y + rowHeight > contentBottom) {
      startNewPage();
      drawTableHeader();
    }

    if (index % 2 === 0) {
      setFill(
        pdf,
        monochrome
          ? [248, 248, 248]
          : [255, 253, 248],
      );

      pdf.rect(
        margin,
        y,
        contentWidth,
        rowHeight,
        'F',
      );
    }

    const productY = y + 4.5;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.2);
    setText(pdf, dark);

    pdf.text(
      visibleProductLines[0] || name,
      columns.description,
      productY,
    );

    if (visibleProductLines.length > 1) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.2);
      setText(pdf, COLORS.muted);

      pdf.text(
        visibleProductLines.slice(1),
        columns.description,
        productY + 3.3,
      );
    }

    const quantityText = item.unit
      ? `${money(quantity)} ${item.unit}`
      : money(quantity);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.7);
    setText(pdf, dark);

    pdf.text(
      quantityText,
      columns.quantity,
      productY,
      { align: 'right' },
    );

    pdf.text(
      compactMoney(rate),
      columns.rate,
      productY,
      { align: 'right' },
    );

    pdf.text(
      `${money(discountPercent)}%`,
      columns.discount,
      productY,
      { align: 'right' },
    );

    pdf.text(
      `${money(gstRate)}%`,
      columns.tax,
      productY,
      { align: 'right' },
    );

    pdf.setFont('helvetica', 'bold');

    pdf.text(
      compactMoney(amount),
      columns.amount,
      productY,
      { align: 'right' },
    );

    drawRule(
      pdf,
      margin,
      y + rowHeight,
      pageWidth - margin,
      lineColor,
      0.2,
    );

    y += rowHeight;
  });

  if (!items.length) {
    const emptyHeight = 16;

    setFill(pdf, paper);

    pdf.rect(
      margin,
      y,
      contentWidth,
      emptyHeight,
      'F',
    );

    drawText(
      pdf,
      'No items added',
      margin + 4,
      y + 9,
      {
        fontSize: 8,
        color: COLORS.muted,
      },
    );

    y += emptyHeight;
  }

  y += 9;

  // Totals
  const totalsHeight = 55;

  ensureSpace(totalsHeight + 10);

  const totalsWidth = Math.min(
    contentWidth * 0.58,
    88,
  );

  const totalsX = pageWidth - margin - totalsWidth;

  setFill(pdf, paper);

  roundRect(
    pdf,
    totalsX,
    y,
    totalsWidth,
    totalsHeight,
    2,
    'F',
  );

  setStroke(pdf, gold);
  pdf.setLineWidth(0.45);

  roundRect(
    pdf,
    totalsX,
    y,
    totalsWidth,
    totalsHeight,
    2,
    'S',
  );

  const labelX = totalsX + 4;
  const valueX = totalsX + totalsWidth - 4;

  const drawTotalRow = (
    label: string,
    value: number,
    rowY: number,
    bold = false,
  ): void => {
    pdf.setFont(
      'helvetica',
      bold ? 'bold' : 'normal',
    );

    pdf.setFontSize(bold ? 7.5 : 7);

    setText(
      pdf,
      bold ? dark : COLORS.muted,
    );

    pdf.text(label, labelX, rowY);

    pdf.setFont(
      'helvetica',
      bold ? 'bold' : 'normal',
    );

    setText(pdf, dark);

    pdf.text(
      compactMoney(value),
      valueX,
      rowY,
      { align: 'right' },
    );
  };

  drawTotalRow(
    'Subtotal',
    subtotal,
    y + 7,
  );

  drawTotalRow(
    'Discount',
    discountTotal,
    y + 14,
  );

  drawTotalRow(
    'Taxable Amount',
    taxableAmount,
    y + 21,
  );

  drawTotalRow(
    'GST',
    gstTotal,
    y + 28,
  );

  drawRule(
    pdf,
    labelX,
    y + 32,
    valueX,
    gold,
    0.4,
  );

  drawTotalRow(
    'Amount Received',
    paidAmount,
    y + 39,
  );

  drawTotalRow(
    'Balance Due',
    dueAmount,
    y + 46,
    true,
  );

  // Grand total highlight
  const grandY = y + totalsHeight + 4;

  setFill(pdf, gold);

  roundRect(
    pdf,
    totalsX,
    grandY,
    totalsWidth,
    13,
    1.5,
    'F',
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  setText(pdf, dark);

  pdf.text(
    'GRAND TOTAL',
    totalsX + 4,
    grandY + 8.3,
  );

  pdf.setFontSize(9);

  pdf.text(
    compactMoney(grandTotal),
    valueX,
    grandY + 8.3,
    { align: 'right' },
  );

  y = grandY + 21;

  // Payment method
  const paymentMethod = String(
    invoice.paymentMethod || '',
  ).trim();

  if (paymentMethod) {
    ensureSpace(12);

    drawPaymentIcon(
      pdf,
      margin + 1,
      y + 1,
      accent,
    );

    drawLabel(
      pdf,
      'Payment Method',
      margin + 7,
      y,
    );

    drawText(
      pdf,
      paymentMethod,
      margin + 7,
      y + 6,
      {
        fontSize: 8,
        bold: true,
        color: dark,
      },
    );

    y += 13;
  }

  // Notes
  const notes = String(
    invoice.notes || '',
  ).trim();

  if (notes) {
    const noteLines = getLines(
      pdf,
      notes,
      contentWidth - 10,
    );

    const noteHeight = Math.max(
      16,
      Math.min(noteLines.length, 5) * 4 + 9,
    );

    ensureSpace(noteHeight + 5);

    drawSectionTitle(
      pdf,
      'Notes',
      margin,
      y + 2,
      contentWidth,
      monochrome,
    );

    setFill(pdf, paper);

    roundRect(
      pdf,
      margin,
      y + 5,
      contentWidth,
      noteHeight,
      1.5,
      'F',
    );

    drawText(
      pdf,
      notes,
      margin + 4,
      y + 12,
      {
        width: contentWidth - 8,
        fontSize: 7,
        color: COLORS.charcoalSoft,
        maxLines: 5,
      },
    );

    y += noteHeight + 11;
  }

  // Custom settings footer
  const customFooter = String(
    settings.footer || '',
  ).trim();

  if (customFooter) {
    const footerLines = getLines(
      pdf,
      customFooter,
      contentWidth - 8,
    );

    const customHeight = Math.max(
      14,
      Math.min(footerLines.length, 4) * 4 + 8,
    );

    ensureSpace(customHeight + 5);

    setFill(pdf, paleGold);

    roundRect(
      pdf,
      margin,
      y,
      contentWidth,
      customHeight,
      1.5,
      'F',
    );

    drawText(
      pdf,
      customFooter,
      margin + 4,
      y + 7,
      {
        width: contentWidth - 8,
        fontSize: 6.8,
        color: dark,
        maxLines: 4,
      },
    );

    y += customHeight + 7;
  }

  // Signature and seal
  const extras = settings as typeof settings & InvoiceSettingsExtras;

  const signature = extras.signatureDataUrl || '';
  const seal = extras.sealDataUrl || '';

  if (signature || seal) {
    ensureSpace(30);

    const signatureY = y + 3;

    const imageWidth = 30;
    const imageHeight = 15;

    if (seal) {
      addImageSafely(
        pdf,
        seal,
        margin + 3,
        signatureY,
        imageWidth,
        imageHeight,
      );

      drawText(
        pdf,
        'Authorized Seal',
        margin + 3,
        signatureY + 20,
        {
          fontSize: 6,
          color: COLORS.muted,
        },
      );
    }

    if (signature) {
      addImageSafely(
        pdf,
        signature,
        pageWidth - margin - imageWidth - 3,
        signatureY,
        imageWidth,
        imageHeight,
      );

      drawText(
        pdf,
        'Authorized Signature',
        pageWidth - margin - imageWidth - 3,
        signatureY + 20,
        {
          fontSize: 6,
          color: COLORS.muted,
        },
      );
    }
  }

  // System footer and powered-by text
  const systemFooter = String(
    context.footerText ||
    'This is a computer-generated invoice.',
  );

  const poweredBy = String(
    context.poweredByText ||
    'Powered by BRAIN TECHNO | www.braintechno.com',
  );

  // Apply footer to all pages.
  const pageCount = pdf.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page);

    drawPageFooter(
      pdf,
      pageWidth,
      pageHeight,
      margin,
      systemFooter,
      poweredBy,
      page,
      pageCount,
      monochrome,
    );
  }

  return pdf;
}
