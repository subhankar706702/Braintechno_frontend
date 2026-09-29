import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-stats-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './stats-editor.component.html',
  styleUrls: ['./stats-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatsEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  updateDarkSafe(): void {
    this.context.updateSelected();
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
      'Choose stats background image'
    );
    this.block.style['backgroundType'] = 'image';
    this.context.updateSelected();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.context.updateSelected();
  }
}
