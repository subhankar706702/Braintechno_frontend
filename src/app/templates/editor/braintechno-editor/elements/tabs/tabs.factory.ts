import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for tabs; only ownership changed. */
export function createTabsBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, active: 0, items: [ { title: 'Overview', text: 'Add overview content here.', image: '' }, { title: 'Features', text: 'Add feature details here.', image: '' }, { title: 'Details', text: 'Add detailed content here.', image: '' } ] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 16, accent: '#FF4D6D' } };
}
