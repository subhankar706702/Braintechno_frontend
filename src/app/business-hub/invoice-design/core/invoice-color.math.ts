import type { InvoiceColorPalette } from './invoice-style.utils';

export type RGB = [number, number, number];
const clamp = (n: number, min = 0, max = 255): number => Math.min(max, Math.max(min, n));

export function normalizeHex(input: string, fallback = '#2563EB'): string {
  const value = String(input || '').trim();
  const short = /^#([0-9a-f]{3})$/i.exec(value);
  if (short) return `#${short[1].split('').map(c => c + c).join('')}`.toUpperCase();
  return /^#[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : fallback;
}
export function hexToRgb(hex: string): RGB {
  const value = normalizeHex(hex).slice(1);
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}
export function rgbToHex(rgb: RGB): string {
  return `#${rgb.map(v => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}
export function mixColor(a: string, b: string, amount: number): string {
  const x = hexToRgb(a), y = hexToRgb(b), t = Math.min(1, Math.max(0, amount));
  return rgbToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}
export function adjustBrightness(hex: string, amount: number): string {
  return mixColor(hex, amount >= 0 ? '#FFFFFF' : '#000000', Math.abs(Math.min(1, Math.max(-1, amount))));
}
export function relativeLuminance(hex: string): number {
  const channels = hexToRgb(hex).map(v => v / 255).map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
export function getContrastRatio(a: string, b: string): number {
  const values = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
export function getContrastColor(background: string): string {
  return getContrastRatio(background, '#FFFFFF') >= getContrastRatio(background, '#111827') ? '#FFFFFF' : '#111827';
}
export function createColorPalette(primaryInput: string): InvoiceColorPalette {
  const primary = normalizeHex(primaryInput);
  const secondary = rgbToHex([hexToRgb(primary)[2], hexToRgb(primary)[0], hexToRgb(primary)[1]]);
  return { primary, primaryDark: mixColor(primary, '#111827', .34), primaryDeep: mixColor(primary, '#0B1220', .58), primarySoft: mixColor(primary, '#FFFFFF', .86), primaryTint: mixColor(primary, '#FFFFFF', .94), secondary, secondarySoft: mixColor(secondary, '#FFFFFF', .88), accent: mixColor(secondary, '#D6A64B', .38), ink: '#172033', muted: '#667085', paper: '#FFFFFF', border: '#E7EAF0', onPrimary: getContrastColor(primary) };
}
