export function repeatProductItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { name: `Product ${index + 1}`, price: '₹499', oldPrice: '', badge: '', description: 'Short product description.', image: '', mediaId: null, cta: 'Buy Now', url: '#', rating: 5 };
}
