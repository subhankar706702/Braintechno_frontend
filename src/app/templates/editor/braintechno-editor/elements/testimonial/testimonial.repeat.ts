export function repeatTestimonialItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { name: `Customer ${index + 1}`, role: 'Verified customer', rating: 5, quote: 'Add your customer review here.', image: '', mediaId: null };
}
