import { ElementPreset } from '../../models/editor-block.model';

export const SCANNER_PRESETS: ElementPreset[] = [
{ key: 'qr', label: 'QR Scanner', description: 'Camera QR scanner button', preview: 'QR' },
      { key: 'barcode', label: 'Barcode Scanner', description: 'Barcode scan interaction', preview: 'Bar' },
      { key: 'card', label: 'Scanner Card', description: 'Scanner inside helpful card', preview: 'Card' },
      { key: 'compact', label: 'Compact Scanner', description: 'Compact scan CTA', preview: 'Small' },
      { key: 'dark', label: 'Dark Scanner', description: 'Dark scanner section', preview: 'Dark' },
      { key: 'retail', label: 'Retail Scan', description: 'Product lookup scanner style', preview: 'Shop' },
      { key: 'ticket', label: 'Ticket Scan', description: 'Event/ticket scanning style', preview: 'Ticket' },
      { key: 'verify', label: 'Verify Code', description: 'Verification scanner style', preview: 'Verify' }
];
