import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for product; only ownership changed. */
export function createProductBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return {
          ...base,
          content: {
            variant,
            name: 'Product Name',
            price: '₹499',
            oldPrice: variant === 'sale' ? '₹699' : '',
            badge: variant === 'sale' ? 'SAVE 29%' : '',
            description: 'Short product description that explains the main benefit.',
            image: '',
            cta: 'Buy Now',
            url: '#',
            layout: variant === 'horizontal' ? 'list' : 'grid',
            slider: false,
            items: [{ name: 'Product Name', price: '₹499', oldPrice: variant === 'sale' ? '₹699' : '', badge: variant === 'sale' ? 'SAVE 29%' : '', description: 'Short product description that explains the main benefit.', image: '', cta: 'Buy Now', url: '#', rating: 5 }]
          },
          style: { ...base.style, background: variant === 'dark' ? '#0F172A' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', radius: variant === 'luxury' ? 4 : 16, padding: 18 }
        };
}
