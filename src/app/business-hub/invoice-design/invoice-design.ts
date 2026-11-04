
/**
 * Invoice Design Configuration
 * Presentation only. Does not modify invoice business logic.
 */

export type InvoiceTemplateId =
  | 'wave-modern'
  | 'teal-header'
  | 'split-wave'
  | 'green-due';

export interface InvoiceThemePalette {
  primary: string;
  primaryDark: string;
  primaryDeep: string;
  primarySoft: string;
  primaryTint: string;
  secondary: string;
  secondarySoft: string;
  accent: string;
  ink: string;
  muted: string;
  paper: string;
  border: string;
}

export interface InvoiceDesignTokens extends InvoiceThemePalette {
  template: InvoiceTemplateId;
  headerStyle: string;
  footerStyle: string;
  tableStyle: string;
  summaryStyle: string;
}

const TEMPLATE_LAYOUTS: Record<
  InvoiceTemplateId,
  Pick<
    InvoiceDesignTokens,
    'headerStyle' | 'footerStyle' | 'tableStyle' | 'summaryStyle'
  >
> = {
  'wave-modern': {
    headerStyle: 'gradient-wave',
    footerStyle: 'wave',
    tableStyle: 'soft-stripes',
    summaryStyle: 'floating-card'
  },

  'teal-header': {
    headerStyle: 'solid-band',
    footerStyle: 'slim-band',
    tableStyle: 'minimal-grid',
    summaryStyle: 'right-panel'
  },

  'split-wave': {
    headerStyle: 'split-wave',
    footerStyle: 'corner-wave',
    tableStyle: 'tinted',
    summaryStyle: 'bottom-panel'
  },

  'green-due': {
    headerStyle: 'green-banner',
    footerStyle: 'solid-band',
    tableStyle: 'dense',
    summaryStyle: 'amount-due'
  }
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(input: string): string {
  const value = String(input || '').trim();

  const short = /^#([0-9a-f]{3})$/i.exec(value);

  if (short) {
    return (
      '#' +
      short[1]
        .split('')
        .map(char => char + char)
        .join('')
    ).toUpperCase();
  }

  return /^#[0-9a-f]{6}$/i.test(value)
    ? value.toUpperCase()
    : '#D93645';
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = normalizeHex(hex).slice(1);

  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16)
  ];
}

function rgbToHex(rgb: [number, number, number]): string {
  return (
    '#' +
    rgb
      .map(value =>
        clamp(Math.round(value), 0, 255)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  ).toUpperCase();
}

function mix(
  colorA: string,
  colorB: string,
  amount: number
): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const t = clamp(amount, 0, 1);

  return rgbToHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ]);
}

function luminance(hex: string): number {
  const channels = hexToRgb(hex).map(value => {
    const channel = value / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * channels[0] +
    0.7152 * channels[1] +
    0.0722 * channels[2]
  );
}

export function getInvoiceTextColor(background: string): string {
  return luminance(background) > 0.42
    ? '#172033'
    : '#FFFFFF';
}

/**
 * Automatically generates matching colours from the user's theme colour.
 * Primary colour always remains dominant.
 */
export function createInvoicePalette(
  primaryColor: string
): InvoiceThemePalette {
  const primary = normalizeHex(primaryColor);
  const [r, g, b] = hexToRgb(primary);

  const secondary = rgbToHex([b, r, g]);
  const accent = mix(secondary, '#D6A64B', 0.38);

  return {
    primary,
    primaryDark: mix(primary, '#111827', 0.28),
    primaryDeep: mix(primary, '#101827', 0.48),
    primarySoft: mix(primary, '#FFFFFF', 0.84),
    primaryTint: mix(primary, '#FFFFFF', 0.93),

    secondary,
    secondarySoft: mix(secondary, '#FFFFFF', 0.86),

    accent,

    ink: '#172033',
    muted: '#667085',
    paper: '#FFFFFF',
    border: '#E7EAF0'
  };
}

export function getInvoiceDesign(
  template: InvoiceTemplateId,
  primaryColor: string,
  printColor: 'color' | 'bw' = 'color'
): InvoiceDesignTokens {
  const selectedTemplate = TEMPLATE_LAYOUTS[template]
    ? template
    : 'wave-modern';

  const palette = createInvoicePalette(primaryColor);
  const layout = TEMPLATE_LAYOUTS[selectedTemplate];

  if (printColor === 'bw') {
    return {
      ...palette,

      primary: '#252525',
      primaryDark: '#111111',
      primaryDeep: '#050505',
      primarySoft: '#EDEDED',
      primaryTint: '#F7F7F7',

      secondary: '#666666',
      secondarySoft: '#F0F0F0',
      accent: '#777777',

      template: selectedTemplate,
      ...layout
    };
  }

  return {
    ...palette,
    template: selectedTemplate,
    ...layout
  };
}

export function invoiceDesignCssVariables(
  design: InvoiceDesignTokens
): Record<string, string> {
  return {
    '--invoice-primary': design.primary,
    '--invoice-primary-dark': design.primaryDark,
    '--invoice-primary-deep': design.primaryDeep,
    '--invoice-primary-soft': design.primarySoft,
    '--invoice-primary-tint': design.primaryTint,

    '--invoice-secondary': design.secondary,
    '--invoice-secondary-soft': design.secondarySoft,
    '--invoice-accent': design.accent,

    '--invoice-ink': design.ink,
    '--invoice-muted': design.muted,
    '--invoice-paper': design.paper,
    '--invoice-border': design.border,

    '--invoice-primary-contrast':
      getInvoiceTextColor(design.primary)
  };
}

export const INVOICE_TEMPLATE_OPTIONS: ReadonlyArray<{
  id: InvoiceTemplateId;
  name: string;
  description: string;
}> = [
  {
    id: 'wave-modern',
    name: 'Modern Wave',
    description: 'Gradient header with layered wave design.'
  },
  {
    id: 'teal-header',
    name: 'Bold Header',
    description: 'Full-width colour header with clean invoice body.'
  },
  {
    id: 'split-wave',
    name: 'Split Colour Wave',
    description: 'Asymmetric multi-colour wave layout.'
  },
  {
    id: 'green-due',
    name: 'Amount Due',
    description: 'Bold banner with a prominent amount due panel.'
  }
];
