import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for slider; only ownership changed. */
export function createSliderBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const images = ['', '', ''];
        return {
          ...base,
          content: { variant, images, imagesText: images.join('\n'), interval: 3500, autoplay: true },
          style: { ...base.style, padding: variant === 'full' ? 0 : 18, radius: variant === 'cards' ? 20 : 14, height: variant === 'compact' ? 260 : 420 }
        };
}
