import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogConfig, ConfirmDialogComponent } from './confirm-dialog.component';

export interface ConfirmDialogRequest  {
  title: any;
  subtitle: string;
  type?: string;
  icon: any;
  showCancel?: boolean;
  successButtonName?: string;
  cancelButtonName?: string;
  success?: () => void;
  cancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(config: ConfirmDialogRequest): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '440px',
      maxWidth: 'calc(100vw - 24px)',
      disableClose: true,
      autoFocus: false,
      restoreFocus: true,
      panelClass: 'bt-confirm-dialog-panel',
      data: {
        title: config.title||"Confirmation",
        subtitle: config.subtitle || 'Are you sure you want to proceed?',
        type: config.type || 'info',
        icon: config.icon|| 'inform',
        showCancel: config.showCancel !== false,
        successButtonName: config.successButtonName || 'Ok',
        cancelButtonName: config.cancelButtonName || 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        config.success?.();
        return;
      }

      config.cancel?.();
    });
  }
}
