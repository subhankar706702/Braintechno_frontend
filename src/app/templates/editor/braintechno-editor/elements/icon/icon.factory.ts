import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for icon; only ownership changed. */
export function createIconBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return {
          ...base,
          content: { variant, materialIcon: 'star', label: variant === 'icon-label' ? 'Popular service' : '', url: '#', items: [{ materialIcon: 'star', label: variant === 'icon-label' ? 'Popular service' : '', url: '#' }] },
          style: { ...base.style, align: 'center', iconSize: variant === 'large' ? 64 : 36, iconColor: '#FF4D6D', iconBg: variant === 'plain' ? 'transparent' : '#FFF1F4', radius: variant === 'square' ? 14 : 999 }
        };
}
