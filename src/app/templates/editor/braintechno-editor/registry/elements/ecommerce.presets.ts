import { ElementPreset } from '../../models/editor-block.model';

export const ECOMMERCE_PRESETS: ElementPreset[] = [
{ key: 'product-hero', label: 'Product Hero', description: 'Hero + CTA + product visual', preview: 'Hero' },
      { key: 'product-grid', label: 'Product Grid', description: 'Heading with product cards', preview: 'Grid' },
      { key: 'sale-store', label: 'Sale Store', description: 'Offer banner plus products', preview: 'Sale' },
      { key: 'single-product', label: 'Single Product', description: 'Focused product landing flow', preview: '1 Prod' },
      { key: 'catalog', label: 'Mini Catalog', description: 'Compact product catalogue', preview: 'Cat' },
      { key: 'fashion', label: 'Fashion Drop', description: 'Visual fashion store section', preview: 'Fashion' },
      { key: 'electronics', label: 'Electronics', description: 'Tech product section', preview: 'Tech' },
      { key: 'food', label: 'Food Menu', description: 'Food product/menu section', preview: 'Food' }
];
