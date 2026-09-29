import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for social; only ownership changed. */
export function createSocialBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const socialItems = [
          { name: 'Facebook', url: '#', icon: 'https://cdn.simpleicons.org/facebook/1877F2', platform: 'facebook', label: 'Facebook' },
          { name: 'Instagram', url: '#', icon: 'https://cdn.simpleicons.org/instagram/E4405F', platform: 'instagram', label: 'Instagram' },
          { name: 'YouTube', url: '#', icon: 'https://cdn.simpleicons.org/youtube/FF0000', platform: 'youtube', label: 'YouTube' },
          { name: 'LinkedIn', url: '#', icon: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png', platform: 'linkedin', label: 'LinkedIn' },
          { name: 'X', url: '#', icon: 'https://cdn.simpleicons.org/x/111111', platform: 'x', label: 'X' },
          { name: 'WhatsApp', url: '#', icon: 'https://cdn.simpleicons.org/whatsapp/25D366', platform: 'whatsapp', label: 'WhatsApp' }
        ];

        const align = ['logo-url-center', 'logo-circle-name', 'logo-square-name'].includes(variant)
          ? 'center'
          : variant === 'logo-url-right'
            ? 'right'
            : 'left';

        return {
          ...base,
          content: {
            variant,
            items: socialItems,
            // Legacy keys are kept so older editor data remains readable.
            facebook: '#',
            instagram: '#',
            youtube: '#',
            linkedin: '#',
            x: '',
            whatsapp: ''
          },
          style: {
            ...base.style,
            align,
            background: variant === 'logo-dark' ? '#0F172A' : variant === 'logo-soft' ? '#F8FAFC' : '#FFFFFF',
            color: variant === 'logo-dark' ? '#FFFFFF' : '#0F172A',
            gap: 12,
            iconSize: 36,
            socialIconShape: variant === 'logo-round' || variant === 'logo-circle-name' ? 'round' : variant === 'logo-square' || variant === 'logo-square-name' ? 'square' : 'none',
            showName: !['logo-only', 'logo-round', 'logo-square', 'logo-hover'].includes(variant),
            showUrl: ['logo-url-left', 'logo-url-center', 'logo-url-right'].includes(variant),
            hover: variant === 'logo-hover',
            borderWidth: ['logo-outline', 'logo-card'].includes(variant) ? 1 : 0,
            borderColor: '#E2E8F0',
            radius: 0
          }
        };
}
