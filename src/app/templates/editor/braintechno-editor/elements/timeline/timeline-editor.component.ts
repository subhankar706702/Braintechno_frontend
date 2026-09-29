import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-timeline-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './timeline-editor.component.html',
  styleUrls: ['./timeline-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TimelineEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  get items(): any[] {
    if (!Array.isArray(this.block.content['items'])) this.block.content['items'] = [];
    return this.block.content['items'];
  }

  setColorBackground(): void {
    this.block.style['backgroundType'] = 'color';
    this.context.updateSelected();
  }

  chooseBackgroundImage(): void {
    this.context.openMediaPicker(
      this.block.style,
      'backgroundImage',
      'backgroundMediaId',
      'Choose timeline background image'
    );
    this.block.style['backgroundType'] = 'image';
    this.context.updateSelected();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.context.updateSelected();
  }

  chooseItemImage(item: any): void {
    this.context.openMediaPicker(item, 'image', 'mediaId', 'Choose timeline item image');
    this.context.updateSelected();
  }

  removeItemImage(item: any): void {
    this.context.clearMedia(item, 'image', 'mediaId');
    this.context.updateSelected();
  }
}
