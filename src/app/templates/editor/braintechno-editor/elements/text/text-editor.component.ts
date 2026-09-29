import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './text-editor.component.html',
  // Keep existing editor SCSS as the single source of truth.
  encapsulation: ViewEncapsulation.None
})
export class TextEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;
}
