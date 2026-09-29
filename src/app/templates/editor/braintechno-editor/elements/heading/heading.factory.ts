import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for heading; only ownership changed. */
export function createHeadingBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const styleMap: Record<string, any> = {
          hero: { fontSize: 46, fontWeight: 800, align: 'center', padding: 30 },
          'section-title': { fontSize: 30, fontWeight: 700, align: 'left', padding: 22 },
          center: { fontSize: 34, fontWeight: 700, align: 'center' },
          accent: { fontSize: 34, fontWeight: 800, color: '#FF4D6D', align: 'left' },
          compact: { fontSize: 24, fontWeight: 700, align: 'left', padding: 16 },
          display: { fontSize: 58, fontWeight: 900, align: 'center', padding: 36 },
          eyebrow: { fontSize: 32, fontWeight: 800, align: 'left', padding: 24 },
          underline: { fontSize: 34, fontWeight: 800, align: 'left', accentLine: true },
          serif: { fontSize: 42, fontWeight: 700, align: 'left' },
          gradient: { fontSize: 44, fontWeight: 900, align: 'center', color: '#7C3AED' }
        };
        return { ...base, content: { variant, text: 'Your Heading', level: variant === 'compact' ? 'h3' : 'h2', eyebrow: 'INTRODUCING' }, style: { ...base.style, ...styleMap[variant] } };
}
