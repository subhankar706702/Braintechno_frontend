import { ElementPreset } from '../../models/editor-block.model';

export const FORM_PRESETS: ElementPreset[] = [
{ key: 'card', label: 'Form Card', description: 'Standard enquiry form', preview: 'Form' },
      { key: 'minimal', label: 'Minimal', description: 'Clean minimal form', preview: 'Min' },
      { key: 'soft', label: 'Soft', description: 'Soft background form', preview: 'Soft' },
      { key: 'compact', label: 'Compact', description: 'Compact lead form', preview: 'Small' },
      { key: 'center', label: 'Centered', description: 'Centered form heading', preview: 'Center' },
      { key: 'dark', label: 'Dark', description: 'Dark premium form', preview: 'Dark' },
      { key: 'newsletter', label: 'Newsletter', description: 'Email subscription form', preview: 'Mail' },
      { key: 'appointment', label: 'Appointment', description: 'Appointment enquiry starter', preview: 'Date' },
      { key: 'quote', label: 'Get Quote', description: 'Service quote lead form', preview: 'Quote' },
      { key: 'callback', label: 'Callback', description: 'Phone-first callback form', preview: 'Call' }
];
