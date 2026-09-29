import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for contact; only ownership changed. */
export function createContactBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, phone: '+91 99999 99999', email: 'hello@example.com', address: 'Your business address', hours: 'Mon - Sat: 10 AM - 8 PM', actions: [{ platform: 'whatsapp', label: 'WhatsApp', url: '#' }, { platform: 'instagram', label: 'Instagram', url: '#' }, { platform: 'facebook', label: 'Facebook', url: '#' }] }, style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'soft' ? '#F8FAFC' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: variant === 'center' ? 'center' : 'left', radius: 16 } };
}
