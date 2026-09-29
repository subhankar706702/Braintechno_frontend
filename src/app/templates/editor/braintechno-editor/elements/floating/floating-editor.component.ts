import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext as EditorContext } from '../../models/element-editor-context.model';
import { FLOATING_ACTION_TYPES, FLOATING_SOCIAL_PLATFORMS } from './floating.presets';
import { FLOATING_SOCIAL_ICONS, getFloatingActionDefaults } from './floating.factory';

@Component({
  selector: 'bt-floating-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './floating-editor.component.html',
  styleUrls: ['./floating-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FloatingEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: EditorContext;

  readonly actionTypes = FLOATING_ACTION_TYPES;
  readonly socialPlatforms = FLOATING_SOCIAL_PLATFORMS;

  get actions(): any[] {
    const c = this.block?.content || {};
    if (!Array.isArray(c['actions'])) {
      c['actions'] = Array.isArray(c['items']) ? c['items'] : [];
    }
    c['items'] = c['actions'];
    return c['actions'];
  }

  addAction(): void {
    const item = getFloatingActionDefaults('custom');
    item.label = `Action ${this.actions.length + 1}`;
    item.icon = 'touch_app';
    item.image = '';
    this.actions.push(item);
    this.context.updateSelected();
  }

  removeAction(index: number): void {
    if (this.actions.length <= 1) return;
    this.actions.splice(index, 1);
    this.context.updateSelected();
  }

  moveAction(index: number, direction: -1 | 1): void {
    const next = index + direction;
    if (next < 0 || next >= this.actions.length) return;
    const [item] = this.actions.splice(index, 1);
    this.actions.splice(next, 0, item);
    this.context.updateSelected();
  }

  onTypeChange(item: any): void {
    const selected = this.actionTypes.find(x => x.key === item.type);
    if (selected) item.icon = selected.icon;
    if (item.type === 'social') {
      this.setSocial(item, item.socialPlatform || 'instagram');
      return;
    }
    item.image = '';
    const defaults = getFloatingActionDefaults(item.type);
    item.label = defaults.label;
    item.url = defaults.url;
    item.color = defaults.color;
    item.target = defaults.target;
    item.enabled = true;
    item.tooltip = true;
    this.context.updateSelected();
  }

  setSocial(item: any, platform: string): void {
    const key = String(platform || 'instagram').toLowerCase();
    const name = this.socialPlatforms.find(x => x.key === key)?.label || 'Social Link';
    const urls: Record<string, string> = {
      facebook: 'https://www.facebook.com/',
      instagram: 'https://www.instagram.com/',
      youtube: 'https://www.youtube.com/',
      linkedin: 'https://www.linkedin.com/',
      twitter: 'https://x.com/'
    };
    item.type = 'social';
    item.socialPlatform = key;
    item.image = FLOATING_SOCIAL_ICONS[key] || '';
    item.icon = '';
    item.label = name;
    item.url = urls[key] || '#';
    item.color = '#334155';
    item.target = '_blank';
    item.enabled = true;
    item.tooltip = true;
    this.context.updateSelected();
  }

  chooseImage(item: any): void {
    this.context.openMediaPicker(item, 'image', 'imageMediaId', 'Choose floating action image');
    this.context.updateSelected();
  }

  clearImage(item: any): void {
    this.context.clearMedia(item, 'image', 'imageMediaId');
    this.context.updateSelected();
  }
}
