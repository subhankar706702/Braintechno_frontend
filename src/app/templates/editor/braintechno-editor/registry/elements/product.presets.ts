import { ElementPreset } from '../../models/editor-block.model';

export const PRODUCT_PRESETS: ElementPreset[] = [
{ key: 'classic', label: 'Classic Card', description: 'Image top with product details', preview: 'Classic' },
      { key: 'horizontal', label: 'Horizontal', description: 'Image left, details right', preview: 'Side' },
      { key: 'minimal', label: 'Minimal', description: 'Clean compact product block', preview: 'Min' },
      { key: 'sale', label: 'Sale Card', description: 'Offer badge and old price', preview: 'Sale' },
      { key: 'centered', label: 'Centered', description: 'Centered product showcase', preview: 'Center' },
      { key: 'dark', label: 'Dark Card', description: 'Dark premium product card', preview: 'Dark' },
      { key: 'catalog', label: 'Catalog Item', description: 'Compact catalogue listing', preview: 'List' },
      { key: 'featured', label: 'Featured Product', description: 'Large featured product visual', preview: 'Feature' },
      { key: 'luxury', label: 'Luxury', description: 'Elegant high-end card', preview: 'Luxury' },
      { key: 'quick-buy', label: 'Quick Buy', description: 'Compact quick purchase card', preview: 'Buy' }
];
