import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-team-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TeamEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  get items(): any[] {
    if (!Array.isArray(this.block.content['items'])) this.block.content['items'] = [];
    return this.block.content['items'];
  }

  chooseImage(item: any): void {
    this.context.openMediaPicker(item, 'image', 'mediaId', 'Choose team member image');
    this.context.updateSelected();
  }

  removeImage(item: any): void {
    this.context.clearMedia(item, 'image', 'mediaId');
    this.context.updateSelected();
  }

  setColorBackground(): void {
    this.block.style['backgroundType'] = 'color';
    this.context.updateSelected();
  }

  chooseBackgroundImage(): void {
    this.context.openMediaPicker(this.block.style, 'backgroundImage', 'backgroundMediaId', 'Choose team background image');
    this.block.style['backgroundType'] = 'image';
    this.context.updateSelected();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.context.updateSelected();
  }
}
