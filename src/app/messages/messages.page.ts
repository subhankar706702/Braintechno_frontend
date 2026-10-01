import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import {
  MessageApiService,
  MessageCustomer,
  MessageItem,
  MessageQueryStatus,
  MessageTab,
  MessageThread,
} from '../core/message-api.service';

@Component({
  selector: 'bt-messages-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './messages.page.html',
  styleUrl: './messages.page.scss',
})
export class MessagesPage implements OnInit, OnDestroy {
  readonly tabs: Array<{ key: MessageTab; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' },
  ];

  readonly queryStatuses: MessageQueryStatus[] = [
    'New',
    'In Progress',
    'Resolved',
  ];

  readonly loading = signal(false);
  readonly loadingConversation = signal(false);
  readonly updatingStatus = signal(false);
  readonly apiError = signal('');
  readonly searchTerm = signal('');
  readonly activeTab = signal<MessageTab>('all');
  readonly threads = signal<MessageThread[]>([]);
  readonly selectedThread = signal<MessageThread | null>(null);
  readonly customer = signal<MessageCustomer | null>(null);
  readonly conversation = signal<MessageItem[]>([]);
  readonly total = signal(0);
  readonly unread = signal(0);
  readonly read = signal(0);

  private readonly destroy$ = new Subject<void>();
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly api: MessageApiService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadThreads();
  }

  ngOnDestroy(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSummary(): void {
    this.api.summary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: summary => {
          this.total.set(summary.total);
          this.unread.set(summary.unread);
          this.read.set(summary.read);
        },
        error: () => undefined,
      });
  }

  loadThreads(): void {
    this.loading.set(true);
    this.apiError.set('');

    this.api.list(
      this.activeTab(),
      this.searchTerm(),
      1,
      30
    )
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: response => {
          this.threads.set(response.items ?? []);
          this.total.set(response.meta?.total ?? 0);

          const current = this.selectedThread();
          if (current) {
            const refreshed = response.items.find(
              item => item.customer.id === current.customer.id
            );

            if (refreshed) {
              this.selectedThread.set(refreshed);
            }
          }

          if (!this.selectedThread() && response.items.length) {
            this.selectThread(response.items[0]);
          }
        },
        error: error => {
          console.error('Messages load failed:', error);
          this.apiError.set(
            error?.error?.message ||
            'Could not load messages.'
          );
        },
      });
  }

  selectTab(tab: MessageTab): void {
    if (this.activeTab() === tab) {
      return;
    }

    this.activeTab.set(tab);
    this.selectedThread.set(null);
    this.customer.set(null);
    this.conversation.set([]);
    this.loadThreads();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.loadThreads();
    }, 300);
  }

  selectThread(thread: MessageThread): void {
    this.selectedThread.set(thread);
    this.customer.set(thread.customer);
    this.conversation.set([]);
    this.loadingConversation.set(true);

    this.api.conversation(thread.customer.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingConversation.set(false))
      )
      .subscribe({
        next: response => {
          this.customer.set(response.customer ?? thread.customer);
          this.conversation.set(response.messages ?? []);

          if (thread.unreadCount > 0) {
            this.api.markConversationRead(thread.customer.id)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: () => {
                  this.updateLocalReadState(thread.customer.id);
                  this.loadSummary();
                },
                error: () => undefined,
              });
          }
        },
        error: error => {
          console.error('Message conversation load failed:', error);
          this.apiError.set(
            error?.error?.message ||
            'Could not load this conversation.'
          );
        },
      });
  }

  updateQueryStatus(status: MessageQueryStatus): void {
    const latest = this.latestMessage();
    if (!latest || latest.queryStatus === status || this.updatingStatus()) {
      return;
    }

    this.updatingStatus.set(true);

    this.api.updateStatus(latest.id, status)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.updatingStatus.set(false))
      )
      .subscribe({
        next: updated => {
          this.conversation.update(items =>
            items.map(item =>
              item.id === updated.id
                ? { ...item, queryStatus: updated.queryStatus }
                : item
            )
          );

          const selected = this.selectedThread();
          if (selected) {
            this.selectedThread.set({
              ...selected,
              latestMessage: {
                ...selected.latestMessage,
                queryStatus: updated.queryStatus,
              },
            });
          }
        },
        error: error => {
          console.error('Message status update failed:', error);
          this.apiError.set(
            error?.error?.message ||
            'Could not update query status.'
          );
        },
      });
  }

  latestMessage(): MessageItem | null {
    const messages = this.conversation();
    if (messages.length) {
      return messages[messages.length - 1];
    }

    return this.selectedThread()?.latestMessage ?? null;
  }

  openCampaign(): void {
    void this.router.navigateByUrl('/app/campaigns');
  }

  openCustomer(): void {
    const id = this.customer()?.id;
    if (!id) {
      return;
    }

    void this.router.navigate(['/app/customers'], {
      queryParams: { customerId: id },
    });
  }

  callCustomer(): void {
    const mobile = this.customer()?.mobile;
    if (mobile) {
      window.location.href = `tel:${mobile}`;
    }
  }

  whatsappCustomer(): void {
    const mobile = this.customer()?.mobile.replace(/[^0-9]/g, '');
    if (!mobile) {
      return;
    }

    window.open(
      `https://wa.me/${mobile}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  smsCustomer(): void {
    const mobile = this.customer()?.mobile;
    if (mobile) {
      window.location.href = `sms:${mobile}`;
    }
  }

  emailCustomer(): void {
    const email = this.customer()?.email;
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  }

  whatsappHref(mobile: string): string {
    const normalized = String(mobile || '').replace(/[^0-9]/g, '');
    return normalized ? `https://wa.me/${normalized}` : '#';
  }

  displayName(customer: MessageCustomer | null): string {
    const name = customer?.name?.trim();
    return name || 'Customer';
  }

  initials(customer: MessageCustomer | null): string {
    const name = this.displayName(customer);
    const parts = name.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
  }

  customerTypeLabel(type: string): string {
    return type || 'New';
  }

  threadStatus(thread: MessageThread): MessageQueryStatus {
    return thread.latestMessage.queryStatus || 'New';
  }

  messageTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  }

  messageDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  private updateLocalReadState(customerId: string): void {
    this.threads.update(items =>
      items.map(item =>
        item.customer.id === customerId
          ? {
              ...item,
              unreadCount: 0,
              latestMessage: {
                ...item.latestMessage,
                readStatus: 'read',
              },
            }
          : item
      )
    );

    this.selectedThread.update(item =>
      item?.customer.id === customerId
        ? {
            ...item,
            unreadCount: 0,
            latestMessage: {
              ...item.latestMessage,
              readStatus: 'read',
            },
          }
        : item
    );
  }
}
