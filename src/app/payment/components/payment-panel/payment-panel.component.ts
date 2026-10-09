import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentRecord } from '../../models/payment.model';

@Component({
  selector: 'app-payment-panel',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TitleCasePipe],
  templateUrl: './payment-panel.component.html',
  styleUrl: './payment-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPanelComponent {
  @Input() open = false;
  @Input() payment: PaymentRecord | null = null;
  @Output() closed = new EventEmitter<void>();

  close(): void { this.closed.emit(); }

  @HostListener('document:keydown.escape')
  onEscape(): void { if (this.open) this.close(); }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
}
