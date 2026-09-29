import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for text; only ownership changed. */
export function createTextBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const styleMap: Record<string, any> = {
          paragraph: { fontSize: 16, color: '#475569', align: 'left' },
          lead: { fontSize: 20, color: '#334155', align: 'left' },
          muted: { fontSize: 15, color: '#64748B', align: 'left' },
          quote: { fontSize: 20, color: '#0F172A', background: '#F8FAFC', borderLeft: '#FF4D6D', padding: 24 },
          note: { fontSize: 15, color: '#334155', background: '#F1F5F9', radius: 12 },
          center: { fontSize: 16, color: '#475569', align: 'center' },
          callout: { fontSize: 17, color: '#0F172A', background: '#FFFFFF', radius: 12, borderColor: '#CBD5E1' },
          success: { fontSize: 15, color: '#166534', background: '#F0FDF4', radius: 12 },
          warning: { fontSize: 15, color: '#92400E', background: '#FFFBEB', radius: 12 },
          'two-column': { fontSize: 16, color: '#475569', columns: 2 }
        };
        return { ...base, content: { variant, text: 'Write your business message here.' }, style: { ...base.style, ...styleMap[variant] } };
}
