import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-video-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './video-editor.component.html',
  styleUrls: ['./video-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  update(): void {
    this.context.updateSelected();
  }

  choosePoster(): void {
    this.context.openMediaPicker(this.block.content, 'poster', 'posterMediaId', 'Choose video poster');
    this.update();
  }

  removePoster(): void {
    this.context.clearMedia(this.block.content, 'poster', 'posterMediaId');
    this.update();
  }

  chooseBackgroundImage(): void {
    this.context.openMediaPicker(this.block.style, 'backgroundImage', 'backgroundMediaId', 'Choose video background');
    this.block.style['backgroundType'] = 'image';
    this.update();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.update();
  }

  get isAutoplay(): boolean {
    return !!this.block.content['autoplay'];
  }

  onAutoplayChange(value: boolean): void {
    this.block.content['autoplay'] = value;
    if (value) this.block.content['muted'] = true;
    this.update();
  }
}
