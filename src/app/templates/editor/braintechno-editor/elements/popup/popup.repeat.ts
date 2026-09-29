export interface PopupFormField {
  label: string;
  name: string;
  type: 'text' | 'tel' | 'email' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export function createPopupField(index = 0): PopupFormField {
  return {
    label: index === 0 ? 'Name' : index === 1 ? 'Phone' : 'Message',
    name: index === 0 ? 'name' : index === 1 ? 'phone' : `field_${index + 1}`,
    type: index === 1 ? 'tel' : index === 2 ? 'textarea' : 'text',
    placeholder: index === 0 ? 'Your name' : index === 1 ? 'Your phone number' : 'Your message',
    required: index < 2,
    options: []
  };
}

export function createDefaultPopupFields(): PopupFormField[] {
  return [createPopupField(0), createPopupField(1)];
}

export function createPopupOption(): string {
  return 'Option';
}
