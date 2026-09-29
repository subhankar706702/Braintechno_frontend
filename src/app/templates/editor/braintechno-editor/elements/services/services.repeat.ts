export function repeatServicesItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { icon: 'design_services', title: `Service ${index + 1}`, text: 'Add a short description of this service.', image: '', mediaId: null, badge: '', mediaMode: 'auto', actionType: 'button', cta: 'Learn more', url: '#', command: 'tel:+919999999999', secondaryCta: '', secondaryUrl: '' };
}
