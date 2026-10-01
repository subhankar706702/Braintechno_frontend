import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';

import {
  BroadcastApiService,
  BroadcastChannel,
  BroadcastItem,
  BroadcastOptionsResponse,
  BroadcastWalletResponse,
} from '../core/broadcast-api.service';

@Component({
  selector: 'bt-broadcast-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './broadcast.page.html',
  styleUrl: './broadcast.page.scss',
})
export class BroadcastPage implements OnInit, OnDestroy {
  readonly loading = signal(false);
  readonly walletLoading = signal(false);
  readonly apiError = signal('');
  readonly searchTerm = signal('');
  readonly broadcasts = signal<BroadcastItem[]>([]);
  readonly summary = signal({ total: 0, scheduled: 0, sent: 0, drafts: 0 });
  readonly wallet = signal<BroadcastWalletResponse>({ WhatsApp: 0, SMS: 0, Email: 0 });
  readonly createOpen = signal(false);

  private readonly destroy$ = new Subject<void>();
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  readonly channelMenu: Array<{ channel: BroadcastChannel; icon: string; label: string }> = [
    { channel: 'WhatsApp', icon: 'chat', label: 'WhatsApp Broadcast' },
    { channel: 'SMS', icon: 'sms', label: 'SMS Broadcast' },
    { channel: 'Email', icon: 'mail', label: 'Email Broadcast' },
  ];

  constructor(
    private readonly api: BroadcastApiService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAll(): void {
    this.loadSummary();
    this.loadWallet();
    this.loadBroadcasts();
  }

  loadSummary(): void {
    this.api.summary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => this.summary.set(value),
        error: () => undefined,
      });
  }

  loadWallet(): void {
    this.walletLoading.set(true);
    this.api.wallet()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.walletLoading.set(false)),
      )
      .subscribe({
        next: value => this.wallet.set(value),
        error: error => {
          console.error('Broadcast wallet load failed:', error);
          this.apiError.set(error?.error?.message || 'Could not load available messages.');
        },
      });
  }

  loadBroadcasts(): void {
    this.loading.set(true);
    this.apiError.set('');

    this.api.list(this.searchTerm())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: response => this.broadcasts.set(response.items ?? []),
        error: error => {
          console.error('Broadcast load failed:', error);
          this.apiError.set(error?.error?.message || 'Could not load broadcasts.');
        },
      });
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadBroadcasts(), 300);
  }

  toggleCreateMenu(): void {
    this.createOpen.update(value => !value);
  }

  openChannel(channel: BroadcastChannel): void {
    this.createOpen.set(false);
    this.router.navigate(['/app/broadcast', channel.toLowerCase()]);
  }

  buyMore(): void {
    this.router.navigate(['/app/settings']);
  }

  viewDetails(item: BroadcastItem): void {
    this.router.navigate(['/app/broadcast', 'history', item.id]);
  }

  cancelBroadcast(item: BroadcastItem): void {
    if (item.status !== 'Scheduled') return;

    this.api.cancel(item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadSummary();
          this.loadBroadcasts();
        },
        error: error => {
          this.apiError.set(error?.error?.message || 'Could not cancel broadcast.');
        },
      });
  }

  channelIcon(channel: string): string {
    if (channel === 'WhatsApp') return 'chat';
    if (channel === 'Email') return 'mail';
    return 'sms';
  }

  statusIcon(status: string): string {
    const icons: Record<string, string> = {
      Draft: 'edit_note',
      Scheduled: 'schedule',
      Sending: 'sync',
      Sent: 'check_circle',
      'Partially Sent': 'warning',
      Failed: 'error',
      Cancelled: 'cancel',
    };
    return icons[status] || 'campaign';
  }

  formatDateTime(value: string | null | undefined): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
