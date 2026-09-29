import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for button; only ownership changed. */
export function createButtonBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const styleMap: Record<string, any> = {
          primary: { buttonBg: '#FF4D6D', buttonText: '#FFFFFF', borderColor: '#FF4D6D', borderWidth: 0, radius: 10 },
          outline: { buttonBg: '#FFFFFF', buttonText: '#FF4D6D', borderColor: '#FF4D6D', borderWidth: 1, radius: 10 },
          pill: { buttonBg: '#FF4D6D', buttonText: '#FFFFFF', borderColor: '#FF4D6D', radius: 999 },
          full: { buttonBg: '#FF4D6D', buttonText: '#FFFFFF', fullWidth: true, radius: 10 },
          soft: { buttonBg: '#FFF1F4', buttonText: '#E11D48', borderColor: '#FFD1D9', borderWidth: 1, radius: 10 },
          dark: { buttonBg: '#0F172A', buttonText: '#FFFFFF', radius: 10 },
          gradient: { buttonBg: 'linear-gradient(135deg,#FF4D6D,#7C3AED)', buttonText: '#FFFFFF', radius: 12, shadow: true },
          glass: { buttonBg: '#F8FAFC', buttonText: '#0F172A', borderColor: '#E2E8F0', borderWidth: 1, radius: 14 },
          'icon-left': { buttonBg: '#111827', buttonText: '#FFFFFF', radius: 12, icon: 'arrow_forward' },
          danger: { buttonBg: '#DC2626', buttonText: '#FFFFFF', radius: 10 }
        };
        return { ...base, content: { variant, label: 'Contact Us', url: '#', target: '_self', items: [{ label: 'Contact Us', url: '#', target: '_self', icon: '' }] }, style: { ...base.style, align: 'center', fontSize: 15, ...styleMap[variant] } };
}
