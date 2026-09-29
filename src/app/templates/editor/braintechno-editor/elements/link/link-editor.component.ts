import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';

@Component({
  selector: 'bt-link-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LinkEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  update(): void {
    this.context.updateSelected();
  }

  onVariantChange(): void {
    const variant = String(this.block.content['variant'] || 'text');
    if (variant === 'download') {
      this.block.content['download'] = true;
      this.block.content['icon'] = 'download';
      this.block.content['label'] = this.block.content['label'] || 'Download';
    }
    if (variant === 'external') {
      this.block.content['target'] = '_blank';
      this.block.content['openExternal'] = true;
      this.block.content['icon'] = 'open_in_new';
    }
    if (variant === 'anchor') {
      this.block.content['action'] = 'anchor';
      this.block.content['url'] = this.block.content['url'] || '#section';
    }
    this.update();
  }

  onActionChange(): void {
    const action = String(this.block.content['action'] || 'web');
    if (action === 'email' && !String(this.block.content['url'] || '').startsWith('mailto:')) {
      this.block.content['url'] = `mailto:${String(this.block.content['url'] || '')}`.replace('mailto:mailto:', 'mailto:');
    }
    if (action === 'phone' && !String(this.block.content['url'] || '').startsWith('tel:')) {
      this.block.content['url'] = `tel:${String(this.block.content['url'] || '').replace(/[^+\d]/g, '')}`;
    }
    if (action === 'whatsapp') {
      const raw = String(this.block.content['url'] || '').replace(/\D/g, '');
      if (raw) this.block.content['url'] = `https://wa.me/${raw}`;
    }
    if (action === 'anchor' && !String(this.block.content['url'] || '').startsWith('#')) {
      this.block.content['url'] = `#${String(this.block.content['url'] || 'section').replace(/^#+/, '')}`;
    }
    this.update();
  }
}
