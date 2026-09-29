export function repeatOfferItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { badge: 'LIMITED OFFER', title: `Offer ${index + 1}`, discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#', image: '', mediaId: null };
}
