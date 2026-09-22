import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'bt-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  @Input()
  open = false;

  @Input()
  busy = false;

  @Input()
  title = 'Are you sure?';

  @Input()
  message = '';

  @Input()
  confirmText = 'Confirm';

  @Input()
  cancelText = 'Cancel';

  @Input()
  tone: 'danger' | 'warning' | 'primary' =
    'primary';

  @Output()
  readonly confirmed =
    new EventEmitter<void>();

  @Output()
  readonly cancelled =
    new EventEmitter<void>();

  confirm(): void {

    if (this.busy) {
      return;
    }

    this.confirmed.emit();
  }

  cancel(): void {

    if (this.busy) {
      return;
    }

    this.cancelled.emit();
  }
}
