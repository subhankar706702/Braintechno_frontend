import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-image-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  update(): void { this.context.updateSelected(); }

  chooseImage(): void {
    this.context.openMediaPicker(this.block.content, 'url', 'mediaId', 'Choose image');
    this.update();
  }

  removeImage(): void {
    this.context.clearMedia(this.block.content, 'url', 'mediaId');
    this.update();
  }

  chooseAfterImage(): void {
    this.context.openMediaPicker(this.block.content, 'afterUrl', 'afterMediaId', 'Choose after image');
    this.update();
  }

  removeAfterImage(): void {
    this.context.clearMedia(this.block.content, 'afterUrl', 'afterMediaId');
    this.update();
  }


  chooseBackgroundImage(): void {
    this.context.openMediaPicker(this.block.style, 'backgroundImage', 'backgroundMediaId', 'Choose image background');
    this.block.style['backgroundType'] = 'image';
    this.update();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.update();
  }

  get isBeforeAfter(): boolean {
    return this.block.content['variant'] === 'before-after';
  }
}
