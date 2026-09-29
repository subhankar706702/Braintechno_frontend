export function repeatPricingItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { name: `Plan ${index + 1}`, price: '₹999', oldPrice: '', period: '/month', features: 'Feature one\nFeature two\nFeature three', badge: '', cta: 'Choose Plan', url: '#' };
}
