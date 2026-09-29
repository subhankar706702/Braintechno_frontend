import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-heading-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './heading-editor.component.html',
  styleUrls: ['./heading-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeadingEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  update(): void { this.context.updateSelected(); }

  chooseBackgroundImage(): void {
    this.context.openMediaPicker(this.block.style, 'backgroundImage', 'backgroundMediaId', 'Choose heading background image');
    this.block.style['backgroundType'] = 'image';
    this.update();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.update();
  }
}
