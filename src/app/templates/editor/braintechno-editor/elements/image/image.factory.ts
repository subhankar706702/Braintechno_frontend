import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for image; only ownership changed. */
export function createImageBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const map: Record<string, any> = {
          banner: { radius: 12, maxWidth: '100%', aspect: '16/7' },
          rounded: { radius: 20, maxWidth: '100%', aspect: '16/9' },
          card: { radius: 16, padding: 16, background: '#F8FAFC', borderColor: '#E2E8F0', aspect: '16/9' },
          compact: { radius: 14, maxWidth: '70%', align: 'center', aspect: '16/9' },
          shadow: { radius: 18, shadow: true, aspect: '16/9' },
          square: { radius: 16, maxWidth: '520px', align: 'center', aspect: '1/1' },
          portrait: { radius: 18, maxWidth: '420px', align: 'center', aspect: '3/4' },
          circle: { radius: 999, maxWidth: '280px', align: 'center', aspect: '1/1' },
          bordered: { radius: 12, borderColor: '#CBD5E1', borderWidth: 1, aspect: '16/9' },
          'full-bleed': { radius: 0, padding: 0, aspect: '16/8' }
        };
        return { ...base, content: { variant, url: '', alt: 'Image placeholder' }, style: { ...base.style, align: 'center', imageWidth: 100, imageHeight: 56, ...map[variant] } };
}
