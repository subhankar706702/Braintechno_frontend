export function repeatTabsItemTemplate(parent: any, index: number, key: string): Record<string, any> {
  return {
    title: `Tab ${index + 1}`,
    icon: 'tab',
    badge: '',
    text: 'Add tab content here.',
    image: '',
    mediaId: null,
    buttonLabel: '',
    buttonUrl: '#'
  };
}
