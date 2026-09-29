import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for gallery; only ownership changed. */
export function createGalleryBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const images = [
          '',
          '',
          ''
        ];
        const columns = variant === 'two' ? 2 : variant === 'four' ? 4 : 3;
        const gap = variant === 'spacious' ? 22 : variant === 'compact' ? 5 : 10;
        return { ...base, content: { variant, images, imagesText: images.join('\n') }, style: { ...base.style, columns, gap, radius: variant === 'rounded' ? 18 : 10 } };
}
