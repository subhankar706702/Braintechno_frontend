import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for link; only ownership changed. */
export function createLinkBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return {
          ...base,
          content: { variant, label: variant === 'download' ? 'Download brochure' : 'Learn more', url: '#', target: '_self' },
          style: { ...base.style, padding: 18, color: '#2563EB', align: 'left', radius: variant === 'pill' ? 999 : 8 }
        };
}
