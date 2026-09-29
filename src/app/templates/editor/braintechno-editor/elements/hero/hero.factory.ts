import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for hero; only ownership changed. */
export function createHeroBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
const heroCopy: Record<string, any> = {
          saas: { eyebrow: 'PRODUCT', title: 'Launch your product with clarity', text: 'Explain the problem, show the product value and guide visitors to one focused action.', primary: 'Start Free', secondary: 'Watch Demo' },
          event: { eyebrow: 'SAVE THE DATE', title: 'A memorable event starts here', text: 'Share the date, venue, highlights and a clear registration action.', primary: 'Register Now', secondary: 'View Schedule' },
          agency: { eyebrow: 'CREATIVE PARTNER', title: 'Strategy, design and growth in one team', text: 'Present your strongest proposition with proof, services and a confident next step.', primary: 'Start a Project', secondary: 'See Work' },
          portfolio: { eyebrow: 'SELECTED WORK', title: 'Designing useful, memorable experiences', text: 'Introduce your work with a strong personal statement and a featured visual.', primary: 'View Projects', secondary: 'About Me' },
          video: { eyebrow: 'FEATURED', title: 'Tell your story with motion', text: 'Pair a concise message with a video-led visual experience.', primary: 'Explore', secondary: 'Contact' }
        };
        const copy = heroCopy[variant] || { eyebrow: 'WELCOME', title: 'Build a stronger online presence', text: 'Use this section to explain your value clearly and guide visitors to the next action.', primary: 'Get Started', secondary: 'Learn More' };
        return { ...base, content: { variant, ...copy, primaryUrl: '#', secondaryUrl: '#', image: '', mediaId: null, videoUrl: '' }, style: { ...base.style, background: '#FFFFFF', color: '#0F172A', padding: 48, radius: 18, align: variant === 'centered' ? 'center' : 'left', gradientFrom: '#FFF1F4', gradientTo: '#EEF2FF', backgroundType: variant === 'gradient' ? 'gradient' : 'color' } };
}
