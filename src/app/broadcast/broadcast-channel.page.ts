import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import {
  BroadcastApiService,
  BroadcastAudience,
  BroadcastChannel,
  BroadcastCustomerType,
  BroadcastOptionsResponse,
  BroadcastWalletResponse,
} from '../core/broadcast-api.service';

@Component({
  selector: 'bt-broadcast-channel-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './broadcast-channel.page.html',
  styleUrl: './broadcast-channel.page.scss',
})
export class BroadcastChannelPage implements OnInit, OnDestroy {
  readonly loadingCount = signal(false);
  readonly loadingOptions = signal(false);
  readonly apiError = signal('');
  readonly recipientCount = signal(0);
  readonly matchedCount = signal(0);
  readonly excludedCount = signal(0);
  readonly saving = signal(false);
  readonly wallet = signal<BroadcastWalletResponse>({ WhatsApp: 0, SMS: 0, Email: 0 });
  readonly options = signal<BroadcastOptionsResponse>({ campaigns: [], sources: [] });
  readonly sendToOpen = signal(false);

  channel: BroadcastChannel = 'WhatsApp';
  showLinkInput = false;
  customUrl = '';
  selectedPageId = '';
  selectedPageUrl = '';
  emailEditorHtml = '';

  readonly customerTypes: Array<{ value: BroadcastCustomerType; label: string }> = [
    { value: 'All', label: 'All Customers' },
    { value: 'New', label: 'New Customers' },
    { value: 'Regular', label: 'Regular Customers' },
    { value: 'VIP', label: 'VIP Customers' },
    { value: 'Interested', label: 'Interested' },
    { value: 'Followup', label: 'Follow-up' },
    { value: 'Converted', label: 'Converted' },
  ];

  readonly form = {
    name: '',
    message: '',
    customerType: 'All' as BroadcastCustomerType,
    sources: [] as string[],
    city: '',
    lastContact: 'any',
    sendMode: 'now' as 'now' | 'schedule',
    date: '',
    time: '18:00',
  };

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: BroadcastApiService,
  ) {}

  ngOnInit(): void {
    const routeChannel = (this.route.snapshot.paramMap.get('channel') || 'whatsapp').toLowerCase();
    this.channel = routeChannel === 'sms' ? 'SMS' : routeChannel === 'email' ? 'Email' : 'WhatsApp';
    this.loadOptions();
    this.loadWallet();
    this.refreshAudienceCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get channelTitle(): string {
    return `${this.channel} Broadcast`;
  }

  get channelIcon(): string {
    return this.channel === 'WhatsApp' ? 'chat' : this.channel === 'Email' ? 'mail' : 'sms';
  }

  get availableMessages(): number {
    return this.wallet()[this.channel];
  }

  get selectedPage() {
    return this.options().campaigns.find(item => item.id === this.selectedPageId) ?? null;
  }

  get selectedSourceLabel(): string {
    if (!this.form.sources.length) return 'All Sources';
    if (this.form.sources.length === 1) return this.form.sources[0];
    return `${this.form.sources.length} Sources`;
  }

  get selectedAudienceLabel(): string {
    const customerType = this.customerTypes.find(item => item.value === this.form.customerType)?.label || 'All Customers';
    const city = this.form.city.trim() ? this.form.city.trim() : 'All Cities';
    return `${customerType} • ${city}`;
  }

  loadOptions(): void {
    this.loadingOptions.set(true);
    this.api.options()
      .pipe(takeUntil(this.destroy$), finalize(() => this.loadingOptions.set(false)))
      .subscribe({
        next: value => this.options.set(value),
        error: error => this.apiError.set(error?.error?.message || 'Could not load pages and filters.'),
      });
  }

  loadWallet(): void {
    this.api.wallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => this.wallet.set(value),
        error: error => this.apiError.set(error?.error?.message || 'Could not load available messages.'),
      });
  }

  buildAudience(): BroadcastAudience {
    return {
      customerType: this.form.customerType,
      sources: [...this.form.sources],
      city: this.form.city.trim() || 'All Cities',
      lastContact: this.form.lastContact,
    };
  }

  refreshAudienceCount(): void {
    this.loadingCount.set(true);
    this.api.audienceCount(this.buildAudience(), [this.channel])
      .pipe(takeUntil(this.destroy$), finalize(() => this.loadingCount.set(false)))
      .subscribe({
        next: value => {
          this.matchedCount.set(Number(value.matchedCount || 0));
          this.recipientCount.set(Number(value.byChannel?.[this.channel] || value.recipientCount || 0));
          this.excludedCount.set(Number(value.excludedCount || 0));
        },
        error: () => {
          this.matchedCount.set(0);
          this.recipientCount.set(0);
          this.excludedCount.set(0);
        },
      });
  }

  toggleSendTo(): void {
    this.sendToOpen.update(value => !value);
  }

  toggleSource(source: string): void {
    if (this.form.sources.includes(source)) {
      this.form.sources = this.form.sources.filter(item => item !== source);
    } else {
      this.form.sources = [...this.form.sources, source];
    }
  }

  isSourceSelected(source: string): boolean {
    return this.form.sources.includes(source);
  }

  clearFilters(): void {
    this.form.customerType = 'All';
    this.form.sources = [];
    this.form.city = '';
    this.form.lastContact = 'any';
    this.refreshAudienceCount();
  }

  applyFilters(): void {
    this.sendToOpen.set(false);
    this.refreshAudienceCount();
  }

  selectPage(id: string): void {
    this.selectedPageId = id;
    const page = this.options().campaigns.find(item => item.id === id);
    this.selectedPageUrl = page?.url || '';
    this.removeCurrentLink();
    if (this.selectedPageUrl) this.appendLink(this.selectedPageUrl);
  }

  useCustomUrl(): void {
    const url = this.customUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      this.apiError.set('Please enter a valid link starting with http:// or https://.');
      return;
    }
    this.apiError.set('');
    this.removeCurrentLink();
    this.appendLink(url);
  }

  removeLink(): void {
    this.removeCurrentLink();
    this.selectedPageId = '';
    this.selectedPageUrl = '';
    this.customUrl = '';
    this.showLinkInput = false;
  }

  private appendLink(url: string): void {
    if (this.form.message.includes(url)) return;
    if (this.channel === 'Email') {
      this.insertEmailHtml(`<p><a href=\"${this.escapeHtmlAttribute(url)}\" target=\"_blank\">${this.escapeHtml(url)}</a></p>`);
      return;
    }
    this.form.message = `${this.form.message.trimEnd()}${this.form.message.trim() ? '\n\n' : ''}${url}`;
  }

  private escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
  }

  private escapeHtmlAttribute(value: string): string {
    return this.escapeHtml(value);
  }

  private removeCurrentLink(): void {
    const links = [this.selectedPageUrl, this.customUrl].filter(Boolean);
    if (this.channel === 'Email') {
      let html = this.emailEditorHtml || this.form.message;
      for (const link of links) {
        const safe = this.escapeRegExp(link);
        html = html.replace(new RegExp(`<p>\\s*<a[^>]*href=[\"']${safe}[\"'][^>]*>.*?<\/a>\\s*<\/p>`, 'gi'), '');
        html = html.replace(new RegExp(`<a[^>]*href=[\"']${safe}[\"'][^>]*>.*?<\/a>`, 'gi'), '');
      }
      this.emailEditorHtml = html;
      this.form.message = html;
      return;
    }
    for (const link of links) {
      this.form.message = this.form.message.replace(new RegExp(`\\n?\\n?${this.escapeRegExp(link)}\\s*$`), '').trimEnd();
    }
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  insertToken(token: string): void {
    if (this.channel === 'Email') {
      this.insertEmailHtml(`<span>${token}</span>&nbsp;`);
      return;
    }
    this.form.message = `${this.form.message}${this.form.message ? ' ' : ''}${token}`;
  }

  onEmailEditorInput(event: Event): void {
    const element = event.target as HTMLElement | null;
    this.emailEditorHtml = element?.innerHTML || '';
    this.form.message = this.emailEditorHtml;
  }

  emailCommand(command: string, value = ''): void {
    if (typeof document === 'undefined') return;
    document.execCommand(command, false, value);
    this.syncEmailEditor();
  }

  emailLink(): void {
    if (typeof window === 'undefined') return;
    const url = window.prompt('Enter link URL');
    if (!url) return;
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    this.emailCommand('createLink', normalized);
  }

  emailClearFormat(): void {
    this.emailCommand('removeFormat');
  }

  syncEmailEditor(): void {
    const editor = document.querySelector<HTMLElement>('.email-editor[contenteditable=\"true\"]');
    if (!editor) return;
    this.emailEditorHtml = editor.innerHTML;
    this.form.message = this.emailEditorHtml;
  }

  private insertEmailHtml(html: string): void {
    if (typeof document === 'undefined') return;
    const editor = document.querySelector<HTMLElement>('.email-editor[contenteditable=\"true\"]');
    if (!editor) return;
    editor.focus();
    document.execCommand('insertHTML', false, html);
    this.syncEmailEditor();
  }

  get emailTextLength(): number {
    if (typeof document === 'undefined') return 0;
    const div = document.createElement('div');
    div.innerHTML = this.emailEditorHtml || '';
    return (div.textContent || '').trim().length;
  }

  scheduleValid(): boolean {
    if (this.form.sendMode !== 'schedule') return true;
    if (!this.form.date || !this.form.time) return false;
    const date = new Date(`${this.form.date}T${this.form.time}`);
    return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
  }

  scheduledDateTime(): string | null {
    if (this.form.sendMode !== 'schedule' || !this.form.date || !this.form.time) return null;
    return new Date(`${this.form.date}T${this.form.time}`).toISOString();
  }

  send(): void {
    this.create('now');
  }

  schedule(): void {
    if (!this.scheduleValid()) {
      this.apiError.set('Please select a future date and time.');
      return;
    }
    this.create('schedule');
  }

  private create(mode: 'now' | 'schedule'): void {
    this.apiError.set('');
    if (!this.form.name.trim()) {
      this.apiError.set('Broadcast name is required.');
      return;
    }
    const messageToSend = this.channel === 'Email' ? this.emailEditorHtml.trim() : this.form.message.trim();
    if (this.channel === 'Email' ? this.emailTextLength === 0 : !this.form.message.trim()) {
      this.apiError.set('Please write your email content.');
      return;
    }
    if (this.recipientCount() <= 0) {
      this.apiError.set(`No eligible ${this.channel} customers are available.`);
      return;
    }
    if (this.availableMessages < this.recipientCount()) {
      this.apiError.set(`You have ${this.availableMessages} available messages, but ${this.recipientCount()} are required.`);
      return;
    }
    if (mode === 'schedule' && !this.scheduleValid()) {
      this.apiError.set('Please select a future date and time.');
      return;
    }

    this.saving.set(true);
    this.form.sendMode = mode;

    this.api.create({
      name: this.form.name.trim(),
      message: messageToSend,
      campaignId: this.selectedPageId || undefined,
      audience: this.buildAudience(),
      channels: [this.channel],
      sendMode: mode,
      scheduledAt: this.scheduledDateTime(),
    })
      .pipe(takeUntil(this.destroy$), finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/app/broadcast']),
        error: error => this.apiError.set(error?.error?.message || 'Could not create broadcast.'),
      });
  }

  goBack(): void {
    this.router.navigate(['/app/broadcast']);
  }
}
