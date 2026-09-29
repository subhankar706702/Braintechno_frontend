import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for offer; only ownership changed. */
export function createOfferBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const dark = variant === 'dark';
        return {
          ...base,
          content: { variant, badge: variant === 'flash' ? 'FLASH DEAL' : 'LIMITED OFFER', title: 'Special Offer', discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#', items: [{ badge: variant === 'flash' ? 'FLASH DEAL' : 'LIMITED OFFER', title: 'Special Offer', discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#', image: '' }] },
          style: { ...base.style, background: dark ? '#0F172A' : '#FFF7F8', color: dark ? '#FFFFFF' : '#0F172A', accent: '#FF4D6D', align: variant === 'center' ? 'center' : 'left', radius: 18 }
        };
}
