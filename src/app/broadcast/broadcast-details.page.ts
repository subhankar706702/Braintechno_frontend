import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { BroadcastApiService, BroadcastItem } from '../core/broadcast-api.service';

@Component({
  selector: 'bt-broadcast-details-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './broadcast-details.page.html',
  styleUrl: './broadcast-details.page.scss',
})
export class BroadcastDetailsPage implements OnInit, OnDestroy {
  readonly item = signal<BroadcastItem | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly cancelling = signal(false);
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: BroadcastApiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Broadcast not found.');
      this.loading.set(false);
      return;
    }
    this.api.get(id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.loading.set(false)))
      .subscribe({
        next: value => this.item.set(value),
        error: error => this.error.set(error?.error?.message || 'Could not load broadcast.'),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  back(): void { this.router.navigate(['/app/broadcast']); }

  cancel(): void {
    const item = this.item();
    if (!item || item.status !== 'Scheduled' || this.cancelling()) return;
    this.cancelling.set(true);
    this.api.cancel(item.id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.cancelling.set(false)))
      .subscribe({
        next: value => this.item.set(value),
        error: error => this.error.set(error?.error?.message || 'Could not cancel broadcast.'),
      });
  }

  formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(date);
  }

  channelIcon(channel: string): string { return channel === 'WhatsApp' ? 'chat' : channel === 'Email' ? 'mail' : 'sms'; }
}
