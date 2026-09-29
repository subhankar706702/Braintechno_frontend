import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';
import { createPopupField, createPopupOption } from './popup.repeat';

@Component({
  selector: 'bt-popup-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './popup-editor.component.html',
  styleUrls: ['./popup-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PopupEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  update(): void {
    this.context.updateSelected();
  }

  get c(): Record<string, any> {
    return this.block.content || (this.block.content = {});
  }

  get fields(): any[] {
    if (!Array.isArray(this.c['fields'])) this.c['fields'] = [];
    return this.c['fields'];
  }

  get optionsForField(): string[] {
    return [];
  }

  addField(): void {
    this.fields.push(createPopupField(this.fields.length));
    this.update();
  }

  removeField(index: number): void {
    this.fields.splice(index, 1);
    this.update();
  }

  addOption(field: any): void {
    if (!Array.isArray(field.options)) field.options = [];
    field.options.push(createPopupOption());
    this.update();
  }

  removeOption(field: any, index: number): void {
    if (!Array.isArray(field.options)) field.options = [];
    field.options.splice(index, 1);
    this.update();
  }

  chooseImage(): void {
    this.context.openMediaPicker(this.c, 'image', 'imageMediaId', 'Choose popup image');
    this.update();
  }

  removeImage(): void {
    this.context.clearMedia(this.c, 'image', 'imageMediaId');
    this.update();
  }

  chooseQr(): void {
    this.context.openMediaPicker(this.c, 'qrImage', 'qrMediaId', 'Choose popup QR code');
    this.update();
  }

  removeQr(): void {
    this.context.clearMedia(this.c, 'qrImage', 'qrMediaId');
    this.update();
  }

  chooseBackgroundImage(): void {
    this.context.openMediaPicker(this.block.style, 'backgroundImage', 'backgroundMediaId', 'Choose popup background image');
    this.block.style['backgroundType'] = 'image';
    this.update();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.update();
  }
}
