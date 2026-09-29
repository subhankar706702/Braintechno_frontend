import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for floating; only ownership changed. */
export function createFloatingBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const icon = variant === 'call' ? 'call' : variant === 'email' ? 'mail' : variant === 'top' ? 'arrow_upward' : variant === 'book' ? 'calendar_month' : 'chat';
        return { ...base, content: { variant, label: variant === 'top' ? 'Back to top' : variant === 'call' ? 'Call now' : variant === 'email' ? 'Email us' : variant === 'book' ? 'Book now' : 'WhatsApp', url: variant === 'call' ? 'tel:+919999999999' : variant === 'email' ? 'mailto:hello@example.com' : '#', icon, items: [{ icon, label: variant === 'top' ? 'Back to top' : variant === 'call' ? 'Call now' : variant === 'email' ? 'Email us' : variant === 'book' ? 'Book now' : 'WhatsApp', url: variant === 'call' ? 'tel:+919999999999' : variant === 'email' ? 'mailto:hello@example.com' : '#' }] }, style: { ...base.style, background: '#FF4D6D', color: '#FFFFFF', radius: 999, padding: 12, align: 'right' } };
}
