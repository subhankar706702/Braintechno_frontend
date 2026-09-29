import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-divider-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './divider-editor.component.html',
  // Keep existing editor SCSS as the single source of truth.
  encapsulation: ViewEncapsulation.None
})
export class DividerEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;
}
