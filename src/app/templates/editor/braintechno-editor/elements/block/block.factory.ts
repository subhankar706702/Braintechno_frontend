import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for block; only ownership changed. */
export function createBlockBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = parent.sectionCellCount(variant || 'two');
        const slots = Array.from({ length: count }, () => [] as EditorBlock[]);
        const block: EditorBlock = {
          ...base,
          content: { variant: variant || 'two', slots },
          style: { ...base.style, background: '#FFFFFF', padding: 18, radius: 16, gap: 14, columns: parent.sectionColumns(variant || 'two') }
        };
        if (variant === 'media-form') {
          block.content['slots'][0] = [parent.createBlock('image', 'rounded')];
          block.content['slots'][1] = [parent.createBlock('form', 'compact')];
        }
        if (variant === 'text-media') {
          block.content['slots'][0] = [parent.createBlock('text', 'lead')];
          block.content['slots'][1] = [parent.createBlock('image', 'rounded')];
        }
        return block;
}
