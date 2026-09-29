import { ElementPreset } from '../../models/editor-block.model';

export const MEDIA_PRESETS: ElementPreset[] = [
{ key: 'library', label: 'Media Library', description: 'Upload and display account media', preview: 'Media' },
      { key: 'images', label: 'Image Files', description: 'Image-focused media shelf', preview: 'Images' },
      { key: 'documents', label: 'Documents', description: 'Document download list', preview: 'Docs' },
      { key: 'cards', label: 'Media Cards', description: 'Visual media cards', preview: 'Cards' },
      { key: 'compact', label: 'Compact List', description: 'Compact file list', preview: 'List' },
      { key: 'grid', label: 'Media Grid', description: 'Thumbnail media grid', preview: 'Grid' },
      { key: 'downloads', label: 'Downloads', description: 'Download-focused files section', preview: 'Down' },
      { key: 'portfolio', label: 'Portfolio Media', description: 'Creative asset presentation', preview: 'Work' }
];
