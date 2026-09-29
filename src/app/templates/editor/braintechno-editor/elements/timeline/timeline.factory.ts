import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for timeline; only ownership changed. */
export function createTimelineBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: 'How it works', items: [ { title: 'Discover', text: 'Tell us what you need.' }, { title: 'Plan', text: 'We prepare the right approach.' }, { title: 'Deliver', text: 'Launch and improve.' } ] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 16, accent: '#FF4D6D' } };
}
