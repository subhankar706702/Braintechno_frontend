import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for pricing; only ownership changed. */
export function createPricingBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = variant === 'single' ? 1 : variant === 'two' ? 2 : 3;
        return { ...base, content: { variant, title: 'Simple pricing', plans: Array.from({ length: count }, (_, i) => ({ name: ['Starter','Business','Premium'][i] || `Plan ${i+1}`, price: ['₹999','₹1,999','₹3,999'][i] || '₹999', period: '/month', features: 'Feature one\nFeature two\nFeature three', cta: 'Choose Plan' })) }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', columns: count, gap: 12, radius: 16 } };
}
