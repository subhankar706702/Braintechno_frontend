import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MATERIAL_ICON_CATEGORIES } from '../../../material-icon-list';
import { EditorBlock } from '../../models/editor-block.model';

export interface NavbarRepeatAction {
  key: string;
  index?: number;
  delta?: number;
  minimum?: number;
}

export interface NavbarMediaAction {
  record: Record<string, any>;
  valueField: string;
  idField: string;
  title: string;
}

@Component({
  selector: 'bt-navbar-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './navbar-editor.component.html',
  styleUrls: ['./navbar-editor.component.scss']
})
export class NavbarEditorComponent {
  @Input() block!: EditorBlock;
  @Output() readonly changed = new EventEmitter<void>();
  @Output() readonly addItem = new EventEmitter<NavbarRepeatAction>();
  @Output() readonly removeItem = new EventEmitter<NavbarRepeatAction>();
  @Output() readonly moveItem = new EventEmitter<NavbarRepeatAction>();
  @Output() readonly openMedia = new EventEmitter<NavbarMediaAction>();
  @Output() readonly clearMedia = new EventEmitter<NavbarMediaAction>();

  readonly materialIconCategories = MATERIAL_ICON_CATEGORIES;

  notify(): void {
    this.changed.emit();
  }

  requestOpenLogo(): void {
    if (!this.block) return;
    this.openMedia.emit({
      record: this.block.content,
      valueField: 'logo',
      idField: 'logoMediaId',
      title: 'Choose navbar logo'
    });
  }

  requestClearLogo(): void {
    if (!this.block) return;
    this.clearMedia.emit({
      record: this.block.content,
      valueField: 'logo',
      idField: 'logoMediaId',
      title: 'Choose navbar logo'
    });
  }
}
