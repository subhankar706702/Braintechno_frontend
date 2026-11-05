import { jsPDF } from 'jspdf';
import { getInvoiceTemplateDesign } from '../core/invoice-design.registry';
import { getContrastColor } from '../core/invoice-color.math';
import { getInvoiceSpacing } from '../core/invoice-spacing';
import { getInvoiceTypography } from '../core/invoice-typography';
import type { InvoicePdfContext } from '../core/invoice-document.model';

/** Existing renderer retained for every non-Amber template. */
export async function renderLegacyInvoicePdf(context: InvoicePdfContext): Promise<jsPDF> {
  const invoice = context.invoice;

    const settings = context.settings;

    const pdfExtras = settings as typeof settings & {
      signatureDataUrl?: string;
      sealDataUrl?: string;
    };

    const pdf = new jsPDF({
      unit: 'mm',
      format: settings.pageSize,
    });

    const monochrome = settings.printColor === 'bw';
    const hex = settings.primaryColor || '#ff4d6d';
    const colorMatch = /^#?([a-f0-9]{6})$/i.exec(hex.trim());

    const rgb: [number, number, number] = colorMatch
      ? [
          parseInt(colorMatch[1].slice(0, 2), 16),
          parseInt(colorMatch[1].slice(2, 4), 16),
          parseInt(colorMatch[1].slice(4, 6), 16),
        ]
      : [255, 77, 109];

    const accent: [number, number, number] = monochrome
      ? [0, 0, 0]
      : rgb;

    const contrastHex = monochrome
      ? '#FFFFFF'
      : getContrastColor(colorMatch ? `#${colorMatch[1]}` : '#ff4d6d');
    const contrastMatch = /^#([a-f0-9]{6})$/i.exec(contrastHex);
    const contrastRgb: [number, number, number] = contrastMatch
      ? [
          parseInt(contrastMatch[1].slice(0, 2), 16),
          parseInt(contrastMatch[1].slice(2, 4), 16),
          parseInt(contrastMatch[1].slice(4, 6), 16),
        ]
      : [255, 255, 255];

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const right = pageWidth - margin;

    let y = 18;

    const footerReserve = 28;

    const rupees = (value: unknown): string =>
      `Rs. ${Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

    const line = (
      text: string,
      x = margin,
      maxWidth = pageWidth - margin * 2,
    ): void => {
      const wrapped = pdf.splitTextToSize(text, maxWidth) as string[];
      pdf.text(wrapped, x, y);
      y += wrapped.length * 5;
    };

    const ensureSpace = (height: number): void => {
      if (y + height > pageHeight - footerReserve) {
        pdf.addPage();
        y = 18;
      }
    };

    const emojiPattern =
      /[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Regional_Indicator}\uFE0F\u20E3]/u;

    const createEmojiCanvasContext = (
      fontSize: number,
      bold: boolean,
    ): {
      canvas: HTMLCanvasElement;
      context: CanvasRenderingContext2D;
      scale: number;
      fontPixels: number;
    } => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error(
          'This browser cannot render emoji for the invoice PDF.',
        );
      }

      const scale = 3;
      const fontPixels = fontSize * 96 / 72;

      context.font =
        `${bold ? '700' : '400'} ${fontPixels}px Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;

      context.textBaseline = 'middle';
      context.textAlign = 'left';

      return { canvas, context, scale, fontPixels };
    };

    const splitIntoGraphemes = (value: string): string[] => {
      const Segmenter = (Intl as unknown as {
        Segmenter?: new (
          locale?: string | string[],
          options?: { granularity: 'grapheme' },
        ) => {
          segment(input: string): Iterable<{ segment: string }>;
        };
      }).Segmenter;

      if (Segmenter) {
        return Array.from(
          new Segmenter(undefined, { granularity: 'grapheme' })
            .segment(value),
          part => part.segment,
        );
      }

      return Array.from(value);
    };

    const wrapEmojiParagraph = (
      paragraph: string,
      maxWidth: number,
      fontSize: number,
      bold: boolean,
    ): string[] => {
      const { context } = createEmojiCanvasContext(fontSize, bold);
      const maxWidthPixels = Math.max(1, maxWidth * 96 / 25.4);
      const words = paragraph.trim().split(/\s+/u).filter(Boolean);

      if (!words.length) {
        return [''];
      }

      const lines: string[] = [];
      let currentLine = '';

      const pushLongWord = (word: string): void => {
        let part = '';

        for (const grapheme of splitIntoGraphemes(word)) {
          const candidate = part + grapheme;

          if (
            part &&
            context.measureText(candidate).width > maxWidthPixels
          ) {
            lines.push(part);
            part = grapheme;
          } else {
            part = candidate;
          }
        }

        if (part) {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = '';
          }

          lines.push(part);
        }
      };

      for (const word of words) {
        const candidate = currentLine
          ? `${currentLine} ${word}`
          : word;

        if (context.measureText(candidate).width <= maxWidthPixels) {
          currentLine = candidate;
        } else if (!currentLine) {
          pushLongWord(word);
        } else {
          lines.push(currentLine);
          currentLine = '';

          if (context.measureText(word).width <= maxWidthPixels) {
            currentLine = word;
          } else {
            pushLongWord(word);
          }
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines.length ? lines : [''];
    };

    const getWrappedTextLines = (
      value: string,
      maxWidth: number,
      fontSize: number,
      bold = false,
    ): string[] => {
      const safeText = String(value || '').replace(/\r/g, '');
      const paragraphs = safeText.split('\n');

      return paragraphs.flatMap(paragraph => {
        if (!paragraph) {
          return [''];
        }

        return emojiPattern.test(paragraph)
          ? wrapEmojiParagraph(paragraph, maxWidth, fontSize, bold)
          : pdf.splitTextToSize(paragraph, maxWidth) as string[];
      });
    };

    const drawWrappedText = (
      value: string,
      x: number,
      startY: number,
      maxWidth: number,
      fontSize: number,
      align: 'left' | 'center' | 'right' = 'left',
      color: [number, number, number] = [0, 0, 0],
      bold = false,
    ): number => {
      const lines = getWrappedTextLines(
        value,
        maxWidth,
        fontSize,
        bold,
      );

      const lineHeight = Math.max(4, fontSize * 0.48);
      let currentY = startY;

      for (const textLine of lines) {
        if (emojiPattern.test(textLine)) {
          const {
            canvas,
            context,
            scale,
            fontPixels,
          } = createEmojiCanvasContext(fontSize, bold);

          const measuredWidth = Math.max(
            1,
            context.measureText(textLine).width,
          );

          const contentWidth = measuredWidth + 8;
          const contentHeight = fontPixels * 1.6;

          canvas.width = Math.ceil(contentWidth * scale);
          canvas.height = Math.ceil(contentHeight * scale);

          const renderContext = canvas.getContext('2d');

          if (!renderContext) {
            throw new Error(
              'This browser cannot render emoji for the invoice PDF.',
            );
          }

          renderContext.scale(scale, scale);

          renderContext.font =
            `${bold ? '700' : '400'} ${fontPixels}px Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;

          renderContext.fillStyle =
            `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

          renderContext.textBaseline = 'middle';
          renderContext.textAlign = 'left';
          renderContext.fillText(textLine, 4, contentHeight / 2);

          const imageWidth = contentWidth * 25.4 / 96;
          const imageHeight = contentHeight * 25.4 / 96;

          let imageX = x;

          if (align === 'center') {
            imageX = x - imageWidth / 2;
          }

          if (align === 'right') {
            imageX = x - imageWidth;
          }

          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            imageX,
            currentY - imageHeight * 0.76,
            imageWidth,
            imageHeight,
            undefined,
            'FAST',
          );
        } else if (textLine) {
          pdf.setFont('helvetica', bold ? 'bold' : 'normal');
          pdf.setFontSize(fontSize);
          pdf.setTextColor(...color);
          pdf.text(textLine, x, currentY, { align });
        }

        currentY += lineHeight;
      }

      return currentY;
    };

    const loadImageDataUrl = async (
      source: string,
    ): Promise<string> => {
      const value = String(source || '').trim();

      if (!value) {
        return '';
      }

      if (/^data:image\//i.test(value)) {
        return value;
      }

      return new Promise(resolve => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const maxDimension = 1200;

            const ratio = Math.min(
              1,
              maxDimension / Math.max(
                image.naturalWidth,
                image.naturalHeight,
              ),
            );

            canvas.width = Math.max(
              1,
              Math.round(image.naturalWidth * ratio),
            );

            canvas.height = Math.max(
              1,
              Math.round(image.naturalHeight * ratio),
            );

            const context = canvas.getContext('2d');

            if (!context) {
              resolve('');
              return;
            }

            context.drawImage(
              image,
              0,
              0,
              canvas.width,
              canvas.height,
            );

            resolve(canvas.toDataURL('image/png'));
          } catch (error) {
            console.warn(
              'Invoice logo could not be converted for PDF:',
              error,
            );

            resolve('');
          }
        };

        image.onerror = () => resolve('');
        image.src = value;
      });
    };

    const template = String(
      settings.template || 'classic',
    ).toLowerCase();

    const registeredTemplate = getInvoiceTemplateDesign(template);
    const templateTypography = getInvoiceTypography(
      registeredTemplate.typography.family,
      registeredTemplate.typography.headingWeight,
      registeredTemplate.density,
    );
    const templateSpacing = getInvoiceSpacing(registeredTemplate.density);
    const addedTemplateIds = new Set([
      'ref-red-gold', 'ref-teal-clean', 'ref-green-classic', 'ref-proforma',
      'ref-teal-wave', 'wave-corporate', 'green-minimal', 'navy-executive',
      'royal-elegance', 'orange-creative', 'emerald-modern', 'slate-minimal',
      'rose-premium', 'ocean-business', 'amber-luxe',
    ]);
    const addedTemplateStyle = addedTemplateIds.has(template)
      ? {
          label: registeredTemplate.label,
          style: registeredTemplate.pdfStyle,
          secondary: (monochrome
            ? [95, 95, 95]
            : [accent[1], accent[2], accent[0]]) as [number, number, number],
        }
      : undefined;

    if (addedTemplateStyle) {
      const secondary = addedTemplateStyle.secondary;

      const headerHeight =
        addedTemplateStyle.style === 'minimal' ? 3 : 18;

      if (addedTemplateStyle.style === 'minimal') {
        pdf.setFillColor(...accent);
        pdf.rect(
          margin,
          9,
          pageWidth - margin * 2,
          headerHeight,
          'F',
        );

        pdf.setFillColor(...secondary);
        pdf.rect(margin, 12, 24, 1.4, 'F');

        y = 23;
      } else if (addedTemplateStyle.style === 'split') {
        pdf.setFillColor(...accent);
        pdf.rect(0, 0, pageWidth * 0.68, 19, 'F');

        pdf.setFillColor(...secondary);
        pdf.rect(
          pageWidth * 0.68,
          0,
          pageWidth * 0.32,
          19,
          'F',
        );

        y = 27;
      } else if (addedTemplateStyle.style === 'luxury') {
        pdf.setDrawColor(...secondary);
        pdf.setLineWidth(1);
        pdf.line(margin, 9, right, 9);

        pdf.setDrawColor(...accent);
        pdf.setLineWidth(0.35);
        pdf.line(margin, 13, right, 13);

        y = 30;
      } else {
        pdf.setFillColor(...accent);
        pdf.rect(0, 0, pageWidth, 18, 'F');

        pdf.setFillColor(...secondary);
        pdf.rect(0, 18, pageWidth, 2, 'F');

        y = 27;
      }

      pdf.setFont(templateTypography.family, templateTypography.headingWeight);
      pdf.setFontSize(Math.round(templateTypography.titleSize * 0.86));

      const headingColor =
        addedTemplateStyle.style === 'minimal' ||
        addedTemplateStyle.style === 'luxury'
          ? accent
          : contrastRgb;

      pdf.setTextColor(...headingColor);

      pdf.text(
        template === 'ref-proforma'
          ? 'PROFORMA INVOICE'
          : 'INVOICE',
        margin + (
          addedTemplateStyle.style === 'split' ? 2 : 0
        ),
        addedTemplateStyle.style === 'minimal' ? 20 : 12,
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(templateTypography.metaSize);
      pdf.setTextColor(...secondary);

      pdf.text(
        addedTemplateStyle.label,
        right,
        addedTemplateStyle.style === 'luxury' ? 22 : 25,
        { align: 'right' },
      );
    } else if (registeredTemplate.pdfStyle === 'executive') {
      pdf.setFillColor(...accent);
      pdf.rect(0, 0, pageWidth, 15, 'F');

      pdf.setTextColor(...contrastRgb);
      pdf.setFont(templateTypography.family, templateTypography.headingWeight);
      pdf.setFontSize(templateTypography.titleSize);
      pdf.text('INVOICE', margin, 10);

      y = 25;
    } else if (registeredTemplate.pdfStyle === 'sidebar') {
      pdf.setFillColor(...accent);
      pdf.rect(0, 0, 4, pageHeight, 'F');

      pdf.setTextColor(...accent);
      pdf.setFont(templateTypography.family, templateTypography.headingWeight);
      pdf.setFontSize(templateTypography.titleSize);
      pdf.text('INVOICE', margin + 2, y);

      y += 12;
    } else if (registeredTemplate.pdfStyle === 'royal' || registeredTemplate.pdfStyle === 'luxe') {
      pdf.setTextColor(35, 35, 35);
      pdf.setFont(templateTypography.family, templateTypography.headingWeight);
      pdf.setFontSize(templateTypography.titleSize);
      pdf.text('INVOICE', margin, y);

      y += 3;

      pdf.setDrawColor(...accent);
      pdf.setLineWidth(0.8);
      pdf.line(margin, y + 2, right, y + 2);

      y += 12;
    } else if (registeredTemplate.pdfStyle === 'creative') {
      pdf.setFillColor(...accent);
      pdf.roundedRect(
        margin,
        y - 8,
        43,
        12,
        2,
        2,
        'F',
      );

      pdf.setTextColor(...contrastRgb);
      pdf.setFont(templateTypography.family, templateTypography.headingWeight);
      pdf.setFontSize(templateTypography.titleSize * 0.72);
      pdf.text('INVOICE', margin + 4, y);

      y += 13;
    } else {
      pdf.setTextColor(...accent);
      pdf.setFont(templateTypography.family, templateTypography.headingWeight);
      pdf.setFontSize(templateTypography.titleSize);
      pdf.text('INVOICE', margin, y);

      y += 10;
    }

    y += templateSpacing.sectionGap * 0.2;

    const profileLogo = String(
      context.businessLogo || '',
    ).trim();

    const selectedLogo = settings.logoDataUrl?.trim() || '';

    let logo = await loadImageDataUrl(
      selectedLogo || profileLogo,
    );

    if (!logo && profileLogo && profileLogo !== selectedLogo) {
      logo = await loadImageDataUrl(profileLogo);
    }

    let logoHeight = 0;

    if (logo) {
      try {
        const logoWidth = 18;
        const logoMaxHeight = 15;

        const imageProperties = pdf.getImageProperties(logo);
        const ratio = imageProperties.width / imageProperties.height;

        const width = Math.min(
          logoWidth,
          logoMaxHeight * ratio,
        );

        const height = width / ratio;

        pdf.addImage(
          logo,
          imageProperties.fileType || 'PNG',
          margin,
          y,
          width,
          height,
          undefined,
          'FAST',
        );

        logoHeight = height;
      } catch (error) {
        console.warn('Invoice logo could not be added:', error);
      }
    }

    const businessFields = [
      settings.businessName?.trim(),
      settings.address?.trim().replace(/\s*\+P\s*/gi, ' • '),
      settings.phone?.trim()
        ? `Phone: ${settings.phone.trim()}`
        : '',
      settings.email?.trim()
        ? `Email: ${settings.email.trim()}`
        : '',
      settings.gstin?.trim()
        ? `GSTIN: ${settings.gstin.trim()}`
        : '',
    ].filter((value): value is string => Boolean(value));

    const businessTextX = logo ? margin + 17 : margin;
    const businessStartY = y;

    let businessTextY = businessStartY;

    if (businessFields.length) {
      businessTextY = drawWrappedText(
        businessFields[0],
        businessTextX,
        businessTextY + 1,
        right - businessTextX,
        16,
        'left',
        [0, 0, 0],
        true,
      );
    }

    for (const field of businessFields.slice(1)) {
      businessTextY = drawWrappedText(
        field,
        businessTextX,
        businessTextY,
        right - businessTextX,
        9,
        'left',
        [55, 55, 55],
        false,
      );
    }

    y = Math.max(
      businessStartY + logoHeight,
      businessTextY,
    ) + 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    ensureSpace(10);

    pdf.text(
      `Invoice No: ${invoice.invoiceNumber}`,
      margin,
      y,
    );

    const invoiceDate = invoice.invoiceDate
      ? new Date(invoice.invoiceDate)
      : new Date();

    pdf.text(
      `Date: ${invoiceDate.toLocaleDateString('en-IN')}`,
      right,
      y,
      { align: 'right' },
    );

    y += 8;

    const drawColor: [number, number, number] = monochrome
      ? [90, 90, 90]
      : rgb;

    pdf.setDrawColor(...drawColor);
    pdf.line(margin, y, right, y);

    y += 8;

    pdf.setFont('helvetica', 'bold');
    line('BILL TO');

    pdf.setFont('helvetica', 'normal');

    if (invoice.customer?.name?.trim()) {
      y = drawWrappedText(
        invoice.customer.name.trim(),
        margin,
        y,
        pageWidth - margin * 2,
        10,
      );
    }

    if (invoice.customer?.mobile?.trim()) {
      y = drawWrappedText(
        `Mobile: ${invoice.customer.mobile.trim()}`,
        margin,
        y,
        pageWidth - margin * 2,
        10,
      );
    }

    if (invoice.customer?.email?.trim()) {
      y = drawWrappedText(
        `Email: ${invoice.customer.email.trim()}`,
        margin,
        y,
        pageWidth - margin * 2,
        10,
      );
    }

    if (invoice.customer?.address?.trim()) {
      y = drawWrappedText(
        `Address: ${invoice.customer.address.trim()}`,
        margin,
        y,
        pageWidth - margin * 2,
        10,
      );
    }

    if (invoice.customer?.gstin?.trim()) {
      y = drawWrappedText(
        `GSTIN: ${invoice.customer.gstin.trim()}`,
        margin,
        y,
        pageWidth - margin * 2,
        10,
      );
    }

    y += 5;

    const tableWidth = right - margin;

    const columns = [
      margin,
      margin + tableWidth * 0.36,
      margin + tableWidth * 0.48,
      margin + tableWidth * 0.62,
      margin + tableWidth * 0.76,
      margin + tableWidth * 0.87,
      right,
    ];

    const headers = [
      'Product',
      'Qty',
      'Rate',
      'Disc.',
      'GST',
      'Total',
    ];

    ensureSpace(16);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(pageWidth < 160 ? 6.5 : 8);

    pdf.setFillColor(
      ...(monochrome
        ? [235, 235, 235] as [number, number, number]
        : accent),
    );

    pdf.rect(
      margin,
      y - 4,
      pageWidth - margin * 2,
      9,
      'F',
    );

    pdf.setTextColor(
      monochrome ? 0 : 255,
      monochrome ? 0 : 255,
      monochrome ? 0 : 255,
    );

    headers.forEach((header, index) => {
      pdf.text(
        header,
        columns[index] + 1,
        y + 1,
      );
    });

    pdf.setTextColor(0, 0, 0);
    y += 10;

    pdf.setFont('helvetica', 'normal');

    for (const item of invoice.items ?? []) {
      const discount = Number(
        item.lineDiscount ??
        (
          item.quantity *
          item.unitPrice *
          Number(item.discountPercent ?? 0) / 100
        ),
      );

      const tax = Number(item.lineTax ?? 0);

      const total = Number(
        item.lineTotal ??
        (item.quantity * item.unitPrice - discount + tax),
      );

      const productLines = getWrappedTextLines(
        String(item.name || 'Product'),
        Math.max(24, columns[1] - columns[0] - 4),
        pageWidth < 160 ? 6.5 : 8,
      );

      const rowHeight = Math.max(
        8,
        productLines.length * 4.5,
      );

      ensureSpace(rowHeight + 4);

      const tableFontSize = pageWidth < 160 ? 6.5 : 8;

      pdf.setFontSize(tableFontSize);

      drawWrappedText(
        String(item.name || 'Product'),
        columns[0] + 1,
        y,
        Math.max(24, columns[1] - columns[0] - 4),
        tableFontSize,
      );

      drawWrappedText(
        `${item.quantity} ${item.unit || ''}`.trim(),
        columns[2] - 1,
        y,
        Math.max(8, columns[2] - columns[1] - 2),
        tableFontSize,
        'right',
      );

      const compactMoney = (value: number): string =>
        Number(value || 0).toFixed(2);

      pdf.text(
        compactMoney(item.unitPrice),
        columns[3] - 1,
        y,
        { align: 'right' },
      );

      pdf.text(
        compactMoney(discount),
        columns[4] - 1,
        y,
        { align: 'right' },
      );

      pdf.text(
        compactMoney(tax),
        columns[5] - 1,
        y,
        { align: 'right' },
      );

      pdf.text(
        compactMoney(total),
        columns[6] - 1,
        y,
        { align: 'right' },
      );

      y += rowHeight;

      pdf.setDrawColor(230);
      pdf.line(margin, y - 2, right, y - 2);
    }

    y += 5;

    const calc = invoice.calculation;

    const totals: Array<[string, number]> = [
      ['Subtotal', calc.subtotal],
      ['Discount', -calc.discountTotal],
      ['Taxable amount', calc.taxableAmount],
      ['GST total', calc.gstTotal],
      ['Invoice total', calc.total],
      ['Amount received', calc.paidAmount],
      ['Balance due', calc.dueAmount],
    ];

    for (const [label, value] of totals) {
      ensureSpace(8);

      const isTotal = label === 'Invoice total';

      pdf.setFont(
        'helvetica',
        isTotal ? 'bold' : 'normal',
      );

      pdf.text(label, right - 65, y);

      pdf.text(
        rupees(value),
        right,
        y,
        { align: 'right' },
      );

      y += isTotal ? 8 : 6;
    }

    ensureSpace(18);
    y += 5;

    pdf.setFont('helvetica', 'normal');

    if (invoice.paymentMethod?.trim()) {
      y = drawWrappedText(
        `Payment method: ${invoice.paymentMethod}`,
        margin,
        y,
        pageWidth - margin * 2,
        10,
      );

      y += 2;
    }

    if (invoice.notes?.trim()) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Notes:', margin, y);

      y += 5;

      pdf.setFont('helvetica', 'normal');

      y = drawWrappedText(
        invoice.notes.trim(),
        margin,
        y,
        pageWidth - margin * 2,
        9,
      );
    }

    if (settings.footer?.trim()) {
      const footerLines = getWrappedTextLines(
        settings.footer.trim(),
        pageWidth - margin * 2,
        9,
      );

      const footerHeight =
        Math.max(1, footerLines.length) * 4.5 + 8;

      ensureSpace(footerHeight + 8);

      y += 4;

      y = drawWrappedText(
        settings.footer.trim(),
        margin,
        y,
        pageWidth - margin * 2,
        9,
        'left',
        accent,
      );

      y += 4;
    }

    if (
      pdfExtras.signatureDataUrl?.trim() ||
      pdfExtras.sealDataUrl?.trim()
    ) {
      ensureSpace(34);

      const signatureY = Math.min(y + 3, pageHeight - 42);

      if (pdfExtras.sealDataUrl?.trim()) {
        try {
          const sealInfo = pdf.getImageProperties(
            pdfExtras.sealDataUrl,
          );

          pdf.addImage(
            pdfExtras.sealDataUrl,
            sealInfo.fileType || 'PNG',
            margin,
            signatureY,
            22,
            22,
            undefined,
            'FAST',
          );

          pdf.setFontSize(7);
          pdf.setTextColor(80, 80, 80);

          pdf.text(
            'Business seal',
            margin,
            signatureY + 25,
          );
        } catch (error) {
          console.warn('Invoice seal could not be added:', error);
        }
      }

      if (pdfExtras.signatureDataUrl?.trim()) {
        try {
          const signatureInfo = pdf.getImageProperties(
            pdfExtras.signatureDataUrl,
          );

          const signatureWidth = 38;

          const signatureHeight = Math.min(
            18,
            signatureWidth * signatureInfo.height / signatureInfo.width,
          );

          pdf.addImage(
            pdfExtras.signatureDataUrl,
            signatureInfo.fileType || 'PNG',
            right - signatureWidth,
            signatureY,
            signatureWidth,
            signatureHeight,
            undefined,
            'FAST',
          );

          pdf.setFontSize(7);
          pdf.setTextColor(80, 80, 80);

          pdf.text(
            'Authorised signature',
            right,
            signatureY + 22,
            { align: 'right' },
          );
        } catch (error) {
          console.warn('Invoice signature could not be added:', error);
        }
      }

      y = signatureY + 29;
    }

    const totalPages = pdf.getNumberOfPages();

    for (let page = 1; page <= totalPages; page += 1) {
      pdf.setPage(page);

      const footerLineY = pageHeight - 22;

      if (addedTemplateStyle) {
        const footerSecondary: [number, number, number] = monochrome
          ? [110, 110, 110]
          : addedTemplateStyle.secondary;

        if (addedTemplateStyle.style === 'wave') {
          pdf.setFillColor(...accent);
          pdf.rect(
            0,
            footerLineY - 1,
            pageWidth,
            1.5,
            'F',
          );

          pdf.setFillColor(...footerSecondary);
          pdf.rect(
            0,
            footerLineY + 0.5,
            pageWidth,
            1,
            'F',
          );
        } else if (addedTemplateStyle.style === 'split') {
          pdf.setFillColor(...accent);
          pdf.rect(
            margin,
            footerLineY - 1,
            (right - margin) * 0.68,
            1.5,
            'F',
          );

          pdf.setFillColor(...footerSecondary);
          pdf.rect(
            margin + (right - margin) * 0.68,
            footerLineY - 1,
            (right - margin) * 0.32,
            1.5,
            'F',
          );
        } else if (addedTemplateStyle.style === 'luxury') {
          pdf.setDrawColor(...footerSecondary);
          pdf.setLineWidth(0.8);
          pdf.line(margin, footerLineY, right, footerLineY);

          pdf.setDrawColor(...accent);
          pdf.setLineWidth(0.25);
          pdf.line(
            margin,
            footerLineY + 2,
            right,
            footerLineY + 2,
          );
        } else {
          pdf.setDrawColor(...accent);
          pdf.setLineWidth(
            addedTemplateStyle.style === 'band' ? 0.8 : 0.35,
          );
          pdf.line(margin, footerLineY, right, footerLineY);

          pdf.setDrawColor(...footerSecondary);
          pdf.setLineWidth(0.25);
          pdf.line(
            margin,
            footerLineY + 1.5,
            right,
            footerLineY + 1.5,
          );
        }
      } else {
        pdf.setDrawColor(
          ...(monochrome
            ? [150, 150, 150] as [number, number, number]
            : accent),
        );

        pdf.setLineWidth(0.25);
        pdf.line(margin, footerLineY, right, footerLineY);
      }

      drawWrappedText(
        'This is a computer-generated invoice.',
        margin,
        pageHeight - 17,
        pageWidth - margin * 2,
        7.5,
        'left',
        [90, 90, 90],
      );

      drawWrappedText(
        'Powered by BRAIN TECHNO | www.braintechno.com',
        margin,
        pageHeight - 11,
        pageWidth - margin * 2,
        7.5,
        'left',
        [90, 90, 90],
        true,
      );
    }

    return pdf;
}
