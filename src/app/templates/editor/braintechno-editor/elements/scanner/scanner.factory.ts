import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for scanner; only ownership changed. */
export function createScannerBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: variant === 'barcode' ? 'Scan barcode' : 'Scan QR code', successLabel: 'Scanned value', formats: variant === 'barcode' ? 'code_128,ean_13,ean_8,upc_a,upc_e' : 'qr_code' }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: 'center', radius: 16 } };
}
