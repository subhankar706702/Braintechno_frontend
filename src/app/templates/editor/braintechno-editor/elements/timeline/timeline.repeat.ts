export function repeatTimelineItemTemplate(parent: any, index: number, key: string): Record<string, any> {
return { title: `Step ${index + 1}`, text: 'Describe this step.', icon: 'radio_button_checked' };
}
