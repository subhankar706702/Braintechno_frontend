import { ElementPreset } from '../../models/editor-block.model';

export const OFFER_PRESETS: ElementPreset[] = [
{ key: 'soft', label: 'Soft Offer', description: 'Light promotional card', preview: '20%' },
      { key: 'coupon', label: 'Coupon', description: 'Coupon-inspired offer', preview: 'SAVE' },
      { key: 'sale', label: 'Sale', description: 'Bold sale campaign', preview: 'SALE' },
      { key: 'dark', label: 'Dark Offer', description: 'Dark premium promotion', preview: 'OFF' },
      { key: 'compact', label: 'Compact', description: 'Compact promotional block', preview: 'Deal' },
      { key: 'center', label: 'Centered', description: 'Centered offer message', preview: 'Offer' },
      { key: 'flash', label: 'Flash Deal', description: 'High urgency flash deal', preview: 'Flash' },
      { key: 'voucher', label: 'Voucher', description: 'Voucher-like visual style', preview: 'Code' },
      { key: 'bundle', label: 'Bundle Offer', description: 'Bundle promotion card', preview: 'Bundle' },
      { key: 'seasonal', label: 'Seasonal', description: 'Festive seasonal campaign', preview: 'Fest' }
];
