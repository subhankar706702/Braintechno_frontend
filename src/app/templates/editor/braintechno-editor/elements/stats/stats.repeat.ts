export function repeatStatsItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { icon: 'monitoring', value: '100+', prefix: '', suffix: '', label: `Metric ${index + 1}`, text: '' };
}
