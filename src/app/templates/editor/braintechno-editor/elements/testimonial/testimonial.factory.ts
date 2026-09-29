import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for testimonial; only ownership changed. */
export function createTestimonialBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = variant === 'three' ? 3 : 1;
        return { ...base, content: { variant, title: 'What customers say', items: Array.from({ length: count }, (_, i) => ({ name: `Customer ${i+1}`, role: 'Verified customer', rating: 5, quote: 'A great experience from start to finish. Add your customer review here.', image: '' })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16 } };
}
