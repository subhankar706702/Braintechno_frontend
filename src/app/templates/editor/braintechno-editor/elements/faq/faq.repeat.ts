export function repeatFaqItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { q: `Question ${index + 1}`, a: 'Add your answer here.' };
}
