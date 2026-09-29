import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for services; only ownership changed. */
export function createServicesBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const count = variant === 'four' ? 4 : variant === 'showcase' ? 4 : variant === 'horizontal' ? 6 : 3;
        const mediaMode = ['image-cards', 'split', 'showcase'].includes(variant) ? 'image' : ['icons', 'commands'].includes(variant) ? 'icon' : 'auto';
        const actionMode = variant === 'commands' ? 'command' : variant === 'links' ? 'link' : 'button';
        const mobileLayout = variant === 'dropdown' ? 'dropdown' : variant === 'horizontal' ? 'scroll' : 'stack';
        const items = Array.from({ length: count }, (_, i) => ({
          icon: ['design_services','campaign','support_agent','bolt','auto_awesome','business_center'][i % 6],
          title: `Service ${i + 1}`,
          text: 'Add a short description of this service.',
          image: '',
          mediaId: null,
          badge: i === 0 ? 'Popular' : '',
          mediaMode,
          actionType: actionMode,
          cta: variant === 'commands' ? ['Call Now','WhatsApp','Email Us','Book Now'][i % 4] : variant === 'links' ? 'View service' : 'Learn more',
          url: '#',
          command: i % 3 === 0 ? 'tel:+919999999999' : i % 3 === 1 ? 'https://wa.me/919999999999' : 'mailto:hello@example.com',
          secondaryCta: '',
          secondaryUrl: ''
        }));
        const styleMap: Record<string, any> = {
          three: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 18, radius: 0 },
          four: { background: '#F8FAFC', color: '#0F172A', columns: 4, gap: 12, radius: 0 },
          icons: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 18, radius: 0, iconBg: '#FFF1F4' },
          'image-cards': { background: '#F8FAFC', color: '#0F172A', columns: 3, gap: 20, radius: 0 },
          minimal: { background: '#FFFFFF', color: '#0F172A', columns: 1, gap: 0, radius: 0 },
          dark: { background: '#0F172A', color: '#FFFFFF', columns: 3, gap: 16, radius: 0 },
          numbers: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 16, radius: 0 },
          split: { background: '#F8FAFC', color: '#0F172A', columns: 2, gap: 24, radius: 0 },
          soft: { background: '#FFF7F8', color: '#0F172A', columns: 3, gap: 16, radius: 0 },
          horizontal: { background: '#FFFFFF', color: '#0F172A', columns: 1, gap: 16, radius: 0 },
          showcase: { background: '#FFFFFF', color: '#0F172A', columns: 2, gap: 20, radius: 0 },
          booking: { background: '#F8FAFC', color: '#0F172A', columns: 3, gap: 16, radius: 0 },
          commands: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 14, radius: 0 },
          links: { background: '#FFFFFF', color: '#0F172A', columns: 1, gap: 0, radius: 0 },
          dropdown: { background: '#FFFFFF', color: '#0F172A', columns: 3, gap: 14, radius: 0 }
        };
        return {
          ...base,
          content: { variant, title: 'Our Services', subtitle: 'Choose the service that fits your needs.', items, carousel: variant === 'horizontal', showArrows: variant === 'horizontal', mediaMode, actionMode, mobileLayout, showSubtitle: true, showBadge: true, showIcon: true, showImage: true, showSecondaryAction: false },
          style: { ...base.style, ...styleMap[variant] }
        };
}
