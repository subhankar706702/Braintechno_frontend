import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for popup; only ownership changed. */
export function createPopupBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: variant === 'offer' ? 'Special offer' : 'Stay in the loop', text: 'Add your popup message here.', cta: variant === 'newsletter' ? 'Subscribe' : 'Continue', url: '#' }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: 18, padding: 24 } };
}
