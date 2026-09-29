import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';
import { repeatTextItemTemplate } from './text.repeat';

@Component({
  selector: 'bt-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  update(): void {
    this.context.updateSelected();
  }

  addChecklistItem(): void {
    const items = Array.isArray(this.block.content['items']) ? this.block.content['items'] : [];
    items.push(repeatTextItemTemplate(this, items.length, 'items'));
    this.block.content['items'] = items;
    this.update();
  }

  removeChecklistItem(index: number): void {
    const items = Array.isArray(this.block.content['items']) ? this.block.content['items'] : [];
    if (items.length <= 1 || index < 0 || index >= items.length) return;
    items.splice(index, 1);
    this.block.content['items'] = items;
    this.update();
  }

  moveChecklistItem(index: number, delta: number): void {
    const items = Array.isArray(this.block.content['items']) ? this.block.content['items'] : [];
    const next = index + delta;
    if (index < 0 || next < 0 || next >= items.length) return;
    [items[index], items[next]] = [items[next], items[index]];
    this.block.content['items'] = items;
    this.update();
  }

  chooseAvatar(): void {
    this.context.openMediaPicker(this.block.content, 'avatar', 'avatarMediaId', 'Choose quote avatar');
    this.update();
  }

  removeAvatar(): void {
    this.context.clearMedia(this.block.content, 'avatar', 'avatarMediaId');
    this.update();
  }
}
