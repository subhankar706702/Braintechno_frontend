import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for whatsapp; only ownership changed. */
export function createWhatsappBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, phone: '919999999999', message: 'Hello, I want to know more.', label: 'Chat on WhatsApp' }, style: { ...base.style, align: 'center', buttonBg: variant === 'dark' ? '#0F172A' : '#22C55E', buttonText: '#FFFFFF', radius: variant === 'pill' || variant === 'floating' ? 999 : 12, fullWidth: variant === 'full' } };
}
