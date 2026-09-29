import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for counter; only ownership changed. */
export function createCounterBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const percentage = variant === 'percentage';
        return { ...base, content: { variant, start: 0, end: percentage ? 98 : 100, prefix: variant === 'money' ? '₹' : '', suffix: percentage ? '%' : '+', label: percentage ? 'Customer satisfaction' : 'Completed projects', duration: 1600, items: [{ start: 0, end: percentage ? 98 : 100, prefix: variant === 'money' ? '₹' : '', suffix: percentage ? '%' : '+', label: percentage ? 'Customer satisfaction' : 'Completed projects', duration: 1600 }] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'soft' ? '#F8FAFC' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', accent: '#FF4D6D', align: 'center', radius: 16 } };
}
