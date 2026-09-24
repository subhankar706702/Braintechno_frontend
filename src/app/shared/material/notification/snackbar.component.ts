import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type SnackbarType =
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
}

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: SnackbarData,

    private snackBarRef:
      MatSnackBarRef<SnackbarComponent>
  ) {}

  get icon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';

      case 'warning':
        return 'warning';

      case 'error':
        return 'error';

      case 'info':
        return 'info';

      default:
        return 'info';
    }
  }

  close(): void {
    this.snackBarRef.dismiss();
  }
}