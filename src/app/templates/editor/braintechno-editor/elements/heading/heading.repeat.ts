export function repeatHeadingItemTemplate(_parent: any, index: number, _key: string): Record<string, any> {
  return {
    number: String(index + 1).padStart(2, '0'),
    icon: 'auto_awesome',
    label: '',
    text: `Heading ${index + 1}`,
    url: '#'
  };
}
