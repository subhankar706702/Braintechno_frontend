import { EditorBlock, ElementPreset, MediaItem } from './editor-block.model';

export interface ElementEditorContext {
  materialIconCategories: any[];
  materialIconList: string[];
  updateSelected: () => void;
  addRepeatItem: (block: EditorBlock, key: string) => void;
  removeRepeatItem: (block: EditorBlock, key: string, index: number, minimum?: number) => void;
  moveRepeatItem: (block: EditorBlock, key: string, index: number, delta: number) => void;
  openMediaPicker: (record: Record<string, any>, valueField: string, idField: string, title: string) => void;
  clearMedia: (record: Record<string, any>, valueField: string, idField: string) => void;
  openMultipleMediaPicker: (record: Record<string, any>, valueField: string, idsField: string, title: string) => void;
  removeGalleryImage: (block: EditorBlock, index: number) => void;
  changeSocialPlatform: (block: EditorBlock, item: any, platform: string) => void;
  addFormField: (block: EditorBlock, type: string) => void;
  changeFormFieldType: (block: EditorBlock, field: any, type: string) => void;
  onMediaFiles: (event: Event, block: EditorBlock) => void;
  removeMediaFile: (block: EditorBlock, index: number) => void;
}
