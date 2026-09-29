import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for video; only ownership changed. */
export function createVideoBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return {
          ...base,
          content: {
            variant,
            url: variant === 'direct' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Featured video',
            controls: true,
            autoplay: variant === 'autoplay',
            muted: variant === 'autoplay'
          },
          style: { ...base.style, padding: variant === 'full' ? 0 : 18, radius: variant === 'rounded' || variant === 'card' ? 18 : 10, aspect: variant === 'portrait' ? '9/16' : '16/9', background: variant === 'card' ? '#F8FAFC' : '#FFFFFF' }
        };
}
