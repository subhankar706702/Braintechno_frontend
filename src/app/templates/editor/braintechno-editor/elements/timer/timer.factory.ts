import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for timer; only ownership changed. */
export function createTimerBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const tomorrow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
        return { ...base, content: { variant, title: 'Offer ends in', target: tomorrow, expiredText: 'Offer ended' }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'sale' ? '#FFF1F2' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: 'center', radius: 16, accent: '#FF4D6D' } };
}
