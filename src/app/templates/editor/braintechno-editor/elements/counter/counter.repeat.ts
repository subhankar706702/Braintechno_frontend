export function repeatCounterItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { start: 0, end: 100, prefix: '', suffix: '+', label: `Counter ${index + 1}`, duration: 1600 };
}
