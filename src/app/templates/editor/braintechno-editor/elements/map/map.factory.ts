import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for map; only ownership changed. */
export function createMapBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const height = variant === 'wide' ? 420 : variant === 'compact' ? 220 : 300;
        return { ...base, content: { variant, url: 'https://www.google.com/maps?q=Kolkata&output=embed', height, title: 'Our location' }, style: { ...base.style, padding: variant === 'flush' ? 0 : 16, radius: variant === 'rounded' || variant === 'card' ? 18 : 10, background: variant === 'dark' ? '#0F172A' : '#FFFFFF' } };
}
