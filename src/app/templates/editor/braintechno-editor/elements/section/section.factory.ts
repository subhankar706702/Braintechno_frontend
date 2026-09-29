import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for section; only ownership changed. */
export function createSectionBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = parent.sectionCellCount(variant || 'one');
        const columns = parent.sectionColumns(variant || 'one');
        return {
          ...base,
          content: {
            variant: variant || 'one',
            cells: Array.from({ length: count }, (_, index) => ({ title: `Column ${index + 1}`, text: 'Add your content here.' }))
          },
          style: { ...base.style, background: '#FFFFFF', padding: 28, radius: 16, gap: 14, columns }
        };
}
