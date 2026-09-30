export type SliderActionType =
  | 'none'
  | 'website'
  | 'section'
  | 'whatsapp'
  | 'phone'
  | 'email'
  | 'sms'
  | 'download';

export interface SliderButtonAction {
  type: SliderActionType;
  url: string;
  target: '_self' | '_blank';
  sectionId: string;
  phone: string;
  whatsapp: string;
  message: string;
  email: string;
  subject: string;
  fileUrl: string;
}

export interface SliderItem {
  image: string;
  mediaId: string | number | null;
  alt: string;
  eyebrow: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  showButton: boolean;
  buttonText: string;
  buttonStyle: string;
  buttonIcon: string;
  buttonAction: SliderButtonAction;

  // Legacy fields kept for backward compatibility with earlier slider data.
  buttonUrl: string;
  target: '_self' | '_blank';
}

export function createSliderAction(): SliderButtonAction {
  return {
    type: 'none',
    url: '',
    target: '_self',
    sectionId: '',
    phone: '',
    whatsapp: '',
    message: '',
    email: '',
    subject: '',
    fileUrl: ''
  };
}

export function createSliderItem(index: number): SliderItem {
  return {
    image: '',
    mediaId: null,
    alt: `Slide ${index + 1}`,
    eyebrow: '',
    badge: '',
    title: '',
    subtitle: '',
    description: '',
    showButton: true,
    buttonText: '',
    buttonStyle: 'primary',
    buttonIcon: '',
    buttonAction: createSliderAction(),
    buttonUrl: '#',
    target: '_self'
  };
}

export function repeatSliderItemTemplate(index: number): SliderItem {
  return createSliderItem(index);
}
