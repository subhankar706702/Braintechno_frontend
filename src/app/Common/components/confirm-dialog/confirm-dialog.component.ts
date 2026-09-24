import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ConfirmDialogType = 'success' | 'warning' | 'danger' | 'info';
export type ConfirmDialogIcon = 'tick' | 'inform' | 'delete' | 'warning';

export interface ConfirmDialogConfig {
  title: string;
  subtitle?: string;
  type?: ConfirmDialogType;
  icon?: ConfirmDialogIcon;
  showCancel?: boolean;
  successButtonName?: string;
  cancelButtonName?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly type: ConfirmDialogType;
  readonly showCancel: boolean;
  readonly successButtonName: string;
  readonly cancelButtonName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmDialogConfig,
    private dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>
  ) {
    this.type = data?.type || 'info';
    this.showCancel = data?.showCancel !== false;
    this.successButtonName = String(data?.successButtonName || 'Ok').trim() || 'Ok';
    this.cancelButtonName = String(data?.cancelButtonName || 'Cancel').trim() || 'Cancel';
  }

  get resolvedIcon(): string {
    const icon = this.data?.icon;

    if (icon === 'tick') return 'check';
    if (icon === 'inform') return 'info';
    if (icon === 'delete') return 'delete';
    if (icon === 'warning') return 'priority_high';

    switch (this.type) {
      case 'success':
        return 'check';
      case 'warning':
        return 'priority_high';
      case 'danger':
        return 'delete';
      default:
        return 'info';
    }
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
