import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for spacer; only ownership changed. */
export function createSpacerBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const heights: Record<string, number> = { xs: 16, sm: 32, md: 48, lg: 72, xl: 96, xxl: 128, huge: 160, custom: 64 };
        return { ...base, content: { variant }, style: { ...base.style, height: heights[variant] || 48, padding: 0 } };
}
