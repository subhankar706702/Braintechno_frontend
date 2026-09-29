export function repeatFloatingItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { icon: 'chat', label: `Action ${index + 1}`, url: '#' };
}
