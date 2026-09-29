import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for divider; only ownership changed. */
export function createDividerBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const map: Record<string, any> = {
          line: { borderColor: '#E2E8F0', borderWidth: 1, borderStyle: 'solid' },
          accent: { borderColor: '#FF4D6D', borderWidth: 2, borderStyle: 'solid' },
          thick: { borderColor: '#0F172A', borderWidth: 4, borderStyle: 'solid' },
          dashed: { borderColor: '#94A3B8', borderWidth: 1, borderStyle: 'dashed' },
          dotted: { borderColor: '#94A3B8', borderWidth: 2, borderStyle: 'dotted' },
          soft: { borderColor: '#F1F5F9', borderWidth: 1, borderStyle: 'solid' },
          short: { borderColor: '#FF4D6D', borderWidth: 3, borderStyle: 'solid', short: true },
          double: { borderColor: '#CBD5E1', borderWidth: 3, borderStyle: 'double' }
        };
        return { ...base, content: { variant }, style: { ...base.style, padding: 12, ...map[variant] } };
}
