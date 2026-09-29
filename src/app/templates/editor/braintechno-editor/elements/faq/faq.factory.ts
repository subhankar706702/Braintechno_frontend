import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for faq; only ownership changed. */
export function createFaqBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: 'Frequently asked questions', items: [ { q: 'What do you offer?', a: 'Add your answer here.' } ] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 16 } };
}
