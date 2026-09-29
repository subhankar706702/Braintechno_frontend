export interface EditorBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
}

export interface ElementPreset {
  key: string;
  label: string;
  description: string;
  preview: string;
  image?: string;
}

export interface MediaItem {
  name: string;
  type: string;
  dataUrl: string;
}
