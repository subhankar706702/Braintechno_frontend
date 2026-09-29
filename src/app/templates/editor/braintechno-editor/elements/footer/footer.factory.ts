import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for footer; only ownership changed. */
export function createFooterBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, brand: 'BRAIN TECHNO', text: 'Technology made simple.', links: 'About, Services, Contact, Privacy', phone: '+91 99999 99999', email: 'hello@example.com', copyright: '© 2026 BRAIN TECHNO. All rights reserved.' }, style: { ...base.style, background: variant === 'dark' || variant === 'business' ? '#0F172A' : '#F8FAFC', color: variant === 'dark' || variant === 'business' ? '#FFFFFF' : '#0F172A', padding: 32, radius: 0 } };
}
