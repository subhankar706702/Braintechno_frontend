import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for stats; only ownership changed. */
export function createStatsBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = variant === 'three' ? 3 : 4;
        return { ...base, content: { variant, title: 'Our impact', items: Array.from({ length: count }, (_, i) => ({ value: ['100+','98%','10+','24/7'][i] || '100+', label: ['Projects','Satisfaction','Years','Support'][i] || `Metric ${i+1}` })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16, accent: '#FF4D6D' } };
}
