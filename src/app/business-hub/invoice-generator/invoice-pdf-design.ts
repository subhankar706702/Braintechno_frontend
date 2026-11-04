
import { jsPDF } from 'jspdf';
import { InvoiceSettings } from '../models/invoice-settings.service';

export interface InvoicePdfData {
  invoiceNumber: string;
  invoiceDate?: string | Date;
  customer: {
    name?: string;
    mobile?: string;
    email?: string;
    address?: string;
    gstin?: string;
  };
  items: Array<{
    name: string;
    description?: string;
    sku?: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    discountPercent?: number;
    lineSubtotal?: number;
    lineDiscount?: number;
    lineTax?: number;
    lineTotal?: number;
    gstRate?: number;
  }>;
  calculation: {
    subtotal: number;
    discountTotal: number;
    taxableAmount: number;
    gstTotal: number;
    roundOff: number;
    total: number;
    paidAmount: number;
    dueAmount: number;
  };
  paymentMethod: string;
  notes?: string;
}

type RGB = [number, number, number];

interface Palette {
  main: RGB;
  dark: RGB;
  mid: RGB;
  light: RGB;
  pale: RGB;
  text: RGB;
  muted: RGB;
  border: RGB;
}

const DEFAULT_BRAND = '#DC2626';

function hexToRgb(hex: string): RGB {
  const value = String(hex || DEFAULT_BRAND)
    .replace('#', '')
    .trim();

  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    return [220, 38, 38];
  }

  return [
    parseInt(value.substring(0, 2), 16),
    parseInt(value.substring(2, 4), 16),
    parseInt(value.substring(4, 6), 16),
  ];
}

function mixColor(a: RGB, b: RGB, amount: number): RGB {
  return [
    Math.round(a[0] * (1 - amount) + b[0] * amount),
    Math.round(a[1] * (1 - amount) + b[1] * amount),
    Math.round(a[2] * (1 - amount) + b[2] * amount),
  ];
}

function getPalette(settings: InvoiceSettings): Palette {
  if (settings.printColor === 'bw') {
    return {
      main: [45, 45, 45],
      dark: [15, 15, 15],
      mid: [95, 95, 95],
      light: [210, 210, 210],
      pale: [245, 245, 245],
      text: [35, 35, 35],
      muted: [110, 110, 110],
      border: [220, 220, 220],
    };
  }

  const main = hexToRgb(settings.primaryColor);

  return {
    main,
    dark: mixColor(main, [0, 0, 0], 0.38),
    mid: mixColor(main, [255, 255, 255], 0.18),
    light: mixColor(main, [255, 255, 255], 0.65),
    pale: mixColor(main, [255, 255, 255], 0.92),
    text: [38, 42, 52],
    muted: [105, 112, 125],
    border: [225, 225, 225],
  };
}

function money(value: number): string {
  return `Rs. ${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function createInvoicePdfDesign(
  invoice: InvoicePdfData,
  settings: InvoiceSettings,
): jsPDF {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: settings.pageSize || 'a4',
  });

  const palette = getPalette(settings);
  const template = settings.template || 'classic';

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 14;
  const right = pageWidth - margin;
  const width = right - margin;

  const small = 7;

  let y = 18;

  const fill = (value: RGB): void => {
    pdf.setFillColor(...value);
  };

  const draw = (value: RGB): void => {
    pdf.setDrawColor(...value);
  };

  const color = (value: RGB): void => {
    pdf.setTextColor(...value);
  };

  const write = (
    value: string,
    x: number,
    yPos: number,
    align: 'left' | 'center' | 'right' = 'left',
  ): void => {
    pdf.text(String(value || ''), x, yPos, { align });
  };

  const wrap = (
    value: string,
    x: number,
    yPos: number,
    maxWidth: number,
    fontSize = small,
  ): number => {
    pdf.setFontSize(fontSize);

    const lines = pdf.splitTextToSize(
      String(value || ''),
      maxWidth,
    ) as string[];

    pdf.text(lines, x, yPos);

    return lines.length * (fontSize * 0.48 + 1);
  };

  const addPage = (): void => {
    pdf.addPage();
    y = 18;
  };

  const ensureSpace = (height: number): void => {
    if (y + height > pageHeight - 25) {
      addPage();
    }
  };

  const businessDetails = [
    settings.address,
    settings.phone ? `Phone: ${settings.phone}` : '',
    settings.email ? `Email: ${settings.email}` : '',
    settings.gstin ? `GSTIN: ${settings.gstin}` : '',
  ].filter(Boolean);

  const businessName = settings.businessName || 'YOUR BUSINESS';

  const drawLogo = (x: number, top: number): number => {
    if (!settings.logoDataUrl) return 0;

    try {
      const info = pdf.getImageProperties(settings.logoDataUrl);

      const maxWidth = 17;
      const maxHeight = 14;
      const ratio = info.width / info.height;

      let imageWidth = maxWidth;
      let imageHeight = imageWidth / ratio;

      if (imageHeight > maxHeight) {
        imageHeight = maxHeight;
        imageWidth = imageHeight * ratio;
      }

      pdf.addImage(
        settings.logoDataUrl,
        info.fileType || 'PNG',
        x,
        top,
        imageWidth,
        imageHeight,
        undefined,
        'FAST',
      );

      return imageWidth + 4;
    } catch (error) {
      console.warn('Invoice logo could not be rendered:', error);
      return 0;
    }
  };

  const drawBusiness = (
    x: number,
    top: number,
    maxWidth: number,
    inverted = false,
  ): number => {
    const logoWidth = drawLogo(x, top - 3);
    const textX = x + logoWidth;
    const textWidth = Math.max(20, maxWidth - logoWidth);

    color(inverted ? [255, 255, 255] : palette.text);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    write(businessName, textX, top + 2);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(small);

    let detailY = top + 7;

    for (const detail of businessDetails) {
      color(inverted ? [245, 245, 245] : palette.muted);

      detailY += wrap(
        detail,
        textX,
        detailY,
        textWidth,
      ) + 1;
    }

    return Math.max(detailY, top + 15);
  };

  const drawInvoiceTitle = (
    title = 'INVOICE',
    top = y,
    inverted = false,
  ): void => {
    color(inverted ? [255, 255, 255] : palette.main);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);

    write(title, right, top, 'right');

    color(inverted ? [245, 245, 245] : palette.muted);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    write(
      `# ${invoice.invoiceNumber}`,
      right,
      top + 6,
      'right',
    );
  };

  // Template-specific invoice headers.
  const drawHeader = (): void => {
    switch (template) {
      case 'corporate':
      case 'gradient':
      case 'modern-pro':
      case 'design-studio': {
        fill(palette.dark);
        pdf.rect(0, 0, pageWidth, 48, 'F');

        if (
          template === 'gradient' ||
          template === 'design-studio'
        ) {
          fill(palette.main);
          pdf.rect(
            pageWidth * 0.68,
            0,
            pageWidth * 0.32,
            48,
            'F',
          );
        }

        drawBusiness(margin, 17, width * 0.60, true);
        drawInvoiceTitle('INVOICE', 23, true);

        y = 60;
        break;
      }

      case 'sidebar': {
        fill(palette.dark);
        pdf.rect(0, 0, 9, pageHeight, 'F');

        drawBusiness(margin + 3, 19, width - 3);
        drawInvoiceTitle('INVOICE', 24);

        y = 58;
        break;
      }

      case 'creative': {
        fill(palette.pale);
        pdf.roundedRect(
          margin,
          10,
          width,
          40,
          4,
          4,
          'F',
        );

        fill(palette.main);
        pdf.roundedRect(
          margin,
          10,
          5,
          40,
          2,
          2,
          'F',
        );

        drawBusiness(margin + 10, 22, width * 0.58);
        drawInvoiceTitle('INVOICE', 27);

        y = 60;
        break;
      }

      case 'luxury':
      case 'signature':
      case 'elegant': {
        draw(palette.dark);
        pdf.setLineWidth(0.7);
        pdf.line(margin, 11, right, 11);
        pdf.line(margin, 14, right, 14);

        drawBusiness(margin, 27, width * 0.60);
        drawInvoiceTitle('INVOICE', 31);

        draw(palette.main);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 49, right, 49);

        y = 60;
        break;
      }

      case 'executive': {
        fill(palette.pale);
        pdf.rect(margin, 10, width, 40, 'F');

        fill(palette.main);
        pdf.rect(margin, 10, width, 3, 'F');

        drawBusiness(margin + 7, 23, width * 0.58);
        drawInvoiceTitle('INVOICE', 29);

        y = 60;
        break;
      }

      case 'minimal':
      case 'mono': {
        drawBusiness(margin, 20, width * 0.60);
        drawInvoiceTitle('INVOICE', 25);

        draw(palette.border);
        pdf.setLineWidth(0.4);
        pdf.line(margin, 49, right, 49);

        y = 60;
        break;
      }

      case 'basic-blue': {
        fill(palette.pale);
        pdf.rect(margin, 10, width, 40, 'F');

        drawBusiness(margin + 6, 22, width * 0.58);
        drawInvoiceTitle('INVOICE', 28);

        y = 60;
        break;
      }

      case 'gst': {
        drawBusiness(margin, 20, width * 0.60);
        drawInvoiceTitle('TAX INVOICE', 25);

        fill(palette.pale);
        pdf.rect(margin, 50, width, 9, 'F');

        color(palette.dark);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        write('GST TAX INVOICE', margin + 3, 56);

        y = 67;
        break;
      }

      case 'my-brand': {
        fill(palette.pale);
        pdf.rect(0, 0, pageWidth, 4, 'F');

        fill(palette.main);
        pdf.rect(margin, 12, 2, 36, 'F');

        drawBusiness(margin + 7, 22, width * 0.57);
        drawInvoiceTitle('INVOICE', 28);

        y = 60;
        break;
      }

      case 'premium': {
        fill(palette.dark);
        pdf.rect(0, 0, pageWidth, 52, 'F');

        fill(palette.main);
        pdf.rect(0, 49, pageWidth, 3, 'F');

        drawBusiness(margin, 19, width * 0.58, true);
        drawInvoiceTitle('INVOICE', 26, true);

        y = 62;
        break;
      }

      default: {
        drawBusiness(margin, 20, width * 0.60);
        drawInvoiceTitle('INVOICE', 25);

        draw(palette.main);
        pdf.setLineWidth(0.7);
        pdf.line(margin, 49, right, 49);

        y = 60;
        break;
      }
    }
  };

  // Customer and invoice information.
  const drawMeta = (): void => {
    ensureSpace(36);

    const date = invoice.invoiceDate
      ? new Date(invoice.invoiceDate)
      : new Date();

    const dateText = Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('en-IN');

    const leftWidth = width * 0.61;
    const gap = 5;
    const rightWidth = width - leftWidth - gap;
    const cardHeight = 31;

    const plain = ['minimal', 'mono'].includes(template);

    if (!plain) {
      fill(palette.pale);

      pdf.roundedRect(
        margin,
        y,
        leftWidth,
        cardHeight,
        2,
        2,
        'F',
      );

      pdf.roundedRect(
        margin + leftWidth + gap,
        y,
        rightWidth,
        cardHeight,
        2,
        2,
        'F',
      );
    }

    const leftX = margin + (plain ? 0 : 4);
    const rightX = margin + leftWidth + gap + (plain ? 0 : 4);

    color(palette.main);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    write('BILL TO', leftX, y + 7);

    color(palette.text);
    pdf.setFontSize(9);
    write(invoice.customer?.name || 'Customer', leftX, y + 13);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);

    let customerY = y + 18;

    const customerFields = [
      invoice.customer?.mobile
        ? `Mobile: ${invoice.customer.mobile}`
        : '',
      invoice.customer?.email
        ? `Email: ${invoice.customer.email}`
        : '',
      invoice.customer?.address || '',
      invoice.customer?.gstin
        ? `GSTIN: ${invoice.customer.gstin}`
        : '',
    ].filter(Boolean);

    for (const field of customerFields) {
      color(palette.muted);

      customerY +=
        wrap(field, leftX, customerY, leftWidth - 9) + 0.5;
    }

    color(palette.main);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    write('INVOICE DATE', rightX, y + 7);

    color(palette.text);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    write(dateText, rightX, y + 14);

    color(palette.main);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    write('PAYMENT METHOD', rightX, y + 21);

    color(palette.text);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    write(invoice.paymentMethod || '-', rightX, y + 27);

    y += cardHeight + 10;
  };

  // Product table.
  const columns = [
    width * 0.36,
    width * 0.10,
    width * 0.14,
    width * 0.12,
    width * 0.12,
    width * 0.16,
  ];

  const positions = [margin];

  columns.forEach(column => {
    positions.push(
      positions[positions.length - 1] + column,
    );
  });

  const drawTableHeader = (): void => {
    fill(palette.main);

    pdf.roundedRect(
      margin,
      y - 5,
      width,
      10,
      1.5,
      1.5,
      'F',
    );

    const headings = [
      'DESCRIPTION',
      'QTY',
      'RATE',
      'DISC.',
      'GST',
      'TOTAL',
    ];

    color([255, 255, 255]);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);

    headings.forEach((heading, index) => {
      if (index === 0) {
        write(heading, positions[index] + 2, y + 1);
      } else {
        write(
          heading,
          positions[index + 1] - 2,
          y + 1,
          'right',
        );
      }
    });

    y += 10;
  };

  const drawItems = (): void => {
    drawTableHeader();

    invoice.items.forEach((item, index) => {
      const discount = Number(
        item.lineDiscount ??
          (
            item.quantity *
            item.unitPrice *
            Number(item.discountPercent || 0) /
            100
          ),
      );

      const tax = Number(item.lineTax || 0);

      const total = Number(
        item.lineTotal ??
          (
            item.quantity * item.unitPrice -
            discount +
            tax
          ),
      );

      const productText = [
        item.name || 'Product',
        item.description || '',
        item.sku ? `SKU: ${item.sku}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const lines = pdf.splitTextToSize(
        productText,
        columns[0] - 5,
      ) as string[];

      const rowHeight = Math.max(
        9,
        lines.length * 4 + 3,
      );

      if (y + rowHeight > pageHeight - 25) {
        addPage();
        drawTableHeader();
      }

      if (
        index % 2 === 1 &&
        !['minimal', 'mono'].includes(template)
      ) {
        fill(palette.pale);
        pdf.rect(margin, y - 5, width, rowHeight, 'F');
      }

      color(palette.text);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);

      pdf.text(lines, positions[0] + 2, y);

      const values = [
        `${item.quantity} ${item.unit || ''}`.trim(),
        Number(item.unitPrice || 0).toFixed(2),
        discount.toFixed(2),
        tax.toFixed(2),
        total.toFixed(2),
      ];

      values.forEach((value, valueIndex) => {
        const columnIndex = valueIndex + 1;

        write(
          value,
          positions[columnIndex + 1] - 2,
          y,
          'right',
        );
      });

      y += rowHeight;

      draw(palette.border);
      pdf.setLineWidth(0.2);
      pdf.line(margin, y - 2, right, y - 2);
    });

    y += 5;
  };

  // Invoice totals.
  const drawTotals = (): void => {
    const calc = invoice.calculation;

    const boxWidth = Math.min(84, width * 0.57);
    const boxX = right - boxWidth;

    const rows: Array<[string, number]> = [
      ['Subtotal', calc.subtotal],
      ['Discount', -calc.discountTotal],
      ['Taxable amount', calc.taxableAmount],
      ['GST total', calc.gstTotal],
      ['Round off', calc.roundOff],
      ['Amount received', calc.paidAmount],
      ['Balance due', calc.dueAmount],
    ];

    const boxHeight = rows.length * 6 + 17;

    ensureSpace(boxHeight + 4);

    if (
      ['luxury', 'executive', 'modern-pro', 'premium'].includes(
        template,
      )
    ) {
      fill(palette.pale);

      pdf.roundedRect(
        boxX - 4,
        y - 5,
        boxWidth + 4,
        boxHeight,
        2,
        2,
        'F',
      );
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    rows.forEach(([label, value]) => {
      color(palette.muted);
      write(label, boxX, y);

      color(palette.text);
      write(money(value), right, y, 'right');

      y += 6;
    });

    y += 2;

    fill(palette.dark);

    pdf.roundedRect(
      boxX - 3,
      y - 5,
      boxWidth + 3,
      13,
      2,
      2,
      'F',
    );

    color([255, 255, 255]);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);

    write('GRAND TOTAL', boxX, y + 3);
    write(money(calc.total), right - 2, y + 3, 'right');

    y += 19;
  };

  // Notes and footer.
  const drawFooter = (): void => {
    if (invoice.notes?.trim()) {
      const noteLines = pdf.splitTextToSize(
        invoice.notes,
        width,
      ) as string[];

      const noteHeight = noteLines.length * 4 + 10;

      ensureSpace(noteHeight);

      color(palette.main);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      write('NOTES', margin, y);

      y += 5;

      color(palette.muted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);

      pdf.text(noteLines, margin, y);

      y += noteLines.length * 4 + 4;
    }

    if (settings.footer?.trim()) {
      const footerLines = pdf.splitTextToSize(
        settings.footer,
        width - 8,
      ) as string[];

      const footerHeight = Math.max(
        12,
        footerLines.length * 4 + 7,
      );

      ensureSpace(footerHeight + 5);

      fill(palette.pale);

      pdf.roundedRect(
        margin,
        y,
        width,
        footerHeight,
        2,
        2,
        'F',
      );

      color(palette.dark);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);

      pdf.text(
        footerLines,
        pageWidth / 2,
        y + 5,
        { align: 'center' },
      );

      y += footerHeight + 5;
    }

    const footerY = pageHeight - 15;

    draw(palette.border);
    pdf.setLineWidth(0.3);
    pdf.line(margin, footerY - 5, right, footerY - 5);

    color(palette.muted);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);

    write(
      'This is a computer-generated invoice.',
      pageWidth / 2,
      footerY,
      'center',
    );

    write(
      'Powered by BRAIN TECHNO | www.braintechno.com',
      pageWidth / 2,
      footerY + 4,
      'center',
    );
  };

  drawHeader();
  drawMeta();
  drawItems();
  drawTotals();
  drawFooter();

  return pdf;
}
