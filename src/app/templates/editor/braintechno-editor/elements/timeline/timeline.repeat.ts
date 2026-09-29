export function repeatTimelineItemTemplate(parent: any, index: number, key: string): Record<string, any> {
  return {
    date: '',
    title: `Step ${index + 1}`,
    text: 'Describe this milestone or step.',
    icon: 'radio_button_checked',
    badge: '',
    image: '',
    buttonLabel: '',
    buttonUrl: '#',
    status: 'upcoming'
  };
}
