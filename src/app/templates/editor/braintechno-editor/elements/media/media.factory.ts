import { EditorBlock, MediaItem } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for media; only ownership changed. */
export function createMediaBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return { ...base, content: { variant, title: 'Your Media', files: [] as MediaItem[] }, style: { ...base.style, background: '#FFFFFF', radius: 16, padding: 18 } };
}
