export function repeatButtonItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { label: `Button ${index + 1}`, url: '#', target: '_self', icon: '' };
}
