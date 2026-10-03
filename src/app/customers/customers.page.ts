import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  finalize
} from 'rxjs';

import {
  AuthService
} from '../core/auth.service';

import {
  CustomerApiService,
  CustomerCounts,
  CustomerItem,
  CustomerSort,
  CustomerSource,
  CustomerType
} from '../core/customer-api.service';
import { CustomerManualFormComponent } from './customer-manual-form/customer-manual-form.component';
import { ConfirmDialogService } from '../Common/components/confirm-dialog/confirm-dialog.service';


type CustomerViewMode =
  | 'card'
  | 'list';

interface CustomerCountCard {
  label: string;
  value: number;
  icon: string;
  key: 'all' | CustomerType;
  tone:
  | 'blue'
  | 'green'
  | 'violet'
  | 'orange'
  | 'pink'
  | 'teal';
}


@Component({
  selector: 'app-customers-page',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    CustomerManualFormComponent
  ],

  templateUrl:
    './customers.page.html',

  styleUrl:
    './customers.page.scss'
})
export class CustomersPage
  implements OnInit, OnDestroy {

  readonly defaultProfileImage =
    '/assets/image/profile.png';

  readonly pageSize =
    16;

  readonly loading =
    signal(false);

  readonly loadingMore =
    signal(false);

  readonly deletingId =
    signal<string | null>(
      null
    );

  readonly hasMore =
    signal(false);

  readonly page =
    signal(1);

  readonly viewMode =
    signal<CustomerViewMode>(
      'card'
    );

  readonly selectedType =
    signal<CustomerType | ''>(
      ''
    );

  readonly selectedSource =
    signal<CustomerSource | ''>(
      ''
    );

  readonly searchTerm =
    signal('');

  readonly sortMode =
    signal<CustomerSort>(
      'newest'
    );

  readonly addMenuOpen =
    signal(false);

  readonly customers =
    signal<CustomerItem[]>([]);

  readonly apiError =
    signal('');

  readonly countData =
    signal<CustomerCounts>({
      total: 0,
      byType: {}
    });

  readonly manualFormOpen =
    signal(false);

  readonly editingCustomer =
    signal<CustomerItem | null>(null);

  readonly viewingCustomer =
    signal<CustomerItem | null>(null);

  readonly contactOpenId =
    signal<string | null>(null);

  readonly updatingTypeId =
    signal<string | null>(null);


  customerTypes: CustomerType[] = [];

  customerSources: CustomerSource[] = [];

  /** Visual order only. Values themselves always come from the backend. */
  private readonly typeTones = [
    'green',
    'teal',
    'violet',
    'pink',
    'orange',
    'blue'
  ] as const;

  private readonly typeIcons = [
    'person_add',
    'repeat',
    'workspace_premium',
    'favorite',
    'schedule',
    'verified'
  ] as const;

  private readonly sourceIcons = [
    'public',
    'chat',
    'edit_note',
    'table_view',
    'auto_awesome',
    'photo_camera',
    'link',
    'campaign'
  ] as const;


  private searchTimer:
    ReturnType<
      typeof setTimeout
    > | null =
    null;


  countCards(): CustomerCountCard[] {
    const value = this.countData();

    return [
      {
        label: 'Total Customers',
        value: value.total,
        icon: 'groups',
        key: 'all',
        tone: 'blue'
      },
      ...this.customerTypes.map((type, index) => ({
        label: this.customerTypeLabel(type),
        value: Number(value.byType[type] ?? 0),
        icon: this.typeIcon(type),
        key: type,
        tone: this.typeTone(index)
      }))
    ];
  }


  constructor(
    private readonly auth:
      AuthService,

    private readonly customerApi:
      CustomerApiService,

    private readonly confirmDialog:
      ConfirmDialogService
  ) { }


  ngOnInit(): void {
    this.loadCustomerOptions();
  }


  ngOnDestroy(): void {

    if (this.searchTimer) {
      clearTimeout(
        this.searchTimer
      );
    }
  }


  get accountId():
    string | number | null {

    return (
      this.auth.user()
        ?.accountId ??
      null
    );
  }

  private loadCustomerOptions(): void {
    this.customerApi.options().subscribe({
      next: options => {
        this.customerTypes = Array.isArray(options?.customerTypes)
          ? options.customerTypes.filter(Boolean)
          : [];

        this.customerSources = Array.isArray(options?.customerSources)
          ? options.customerSources.filter(Boolean)
          : [];

        this.loadFirstPage();
      },
      error: error => {
        console.error('Customer options API failed:', error);
        this.customerTypes = [];
        this.customerSources = [];
        this.customers.set([]);
        this.hasMore.set(false);
        this.apiError.set(
          error?.error?.message ||
          'Could not load customer options.'
        );
      }
    });
  }


  loadFirstPage(): void {

    const accountId =
      this.accountId;

    if (
      accountId === null ||
      accountId === undefined ||
      accountId === ''
    ) {
      this.apiError.set(
        'Account ID is missing. Please login again.'
      );

      return;
    }

    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.apiError.set('');
    this.page.set(1);

    this.customerApi
      .list({
        accountId,
        page: 1,
        limit: this.pageSize,
        search:
          this.searchTerm(),
        type:
          this.selectedType(),
        source:
          this.selectedSource(),
        sort:
          this.sortMode()
      })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: response => {

          const items = Array.isArray(response.items)
            ? response.items.map(item =>
                this.normalizeCustomer(item)
              )
            : [];

          this.customers.set(items);

          this.hasMore.set(
            !!response.meta
              ?.hasMore
          );

          this.countData.set(
            response.counts || {
              total: 0,
              byType: {}
            }
          );
        },

        error: error => {

          console.error(
            'Customer API failed:',
            error
          );
          this.customers.set([]);
          this.hasMore.set(false);
          this.countData.set({
            total: 0,
            byType: {}
          });
          this.apiError.set(
            error?.error?.message ||
            'Could not load customers.'
          );
        }
      });
  }


  loadMore(): void {

    if (
      this.loading() ||
      this.loadingMore() ||
      !this.hasMore()
    ) {
      return;
    }

    const accountId =
      this.accountId;

    if (
      accountId === null ||
      accountId === undefined ||
      accountId === ''
    ) {
      return;
    }

    const nextPage =
      this.page() + 1;

    this.loadingMore.set(true);

    this.customerApi
      .list({
        accountId,
        page: nextPage,
        limit: this.pageSize,
        search:
          this.searchTerm(),
        type:
          this.selectedType(),
        source:
          this.selectedSource(),
        sort:
          this.sortMode()
      })
      .pipe(
        finalize(() => {
          this.loadingMore.set(
            false
          );
        })
      )
      .subscribe({
        next: response => {

          const incoming = Array.isArray(response.items)
            ? response.items.map(item =>
                this.normalizeCustomer(item)
              )
            : [];

          this.customers.update(
            current => [
              ...current,
              ...incoming
            ]
          );

          this.page.set(
            nextPage
          );

          this.hasMore.set(
            !!response.meta
              ?.hasMore
          );

          this.countData.set(
            response.counts || {
              total: 0,
              byType: {}
            }
          );
        },

        error: error => {

          console.error(
            'Could not load more customers:',
            error
          );
        }
      });
  }


  onSearchChange(
    value: string
  ): void {

    this.searchTerm.set(
      String(value || '')
    );

    if (this.searchTimer) {
      clearTimeout(
        this.searchTimer
      );
    }

    this.searchTimer =
      setTimeout(
        () => {
          this.loadFirstPage();
        },
        350
      );
  }


  onTypeFilterChange(
    value:
      CustomerType | ''
  ): void {

    this.selectedType.set(
      value
    );

    this.loadFirstPage();
  }


  onSourceFilterChange(
    value:
      CustomerSource | ''
  ): void {

    this.selectedSource.set(
      value
    );

    this.loadFirstPage();
  }


  onSortChange(
    value: CustomerSort
  ): void {

    this.sortMode.set(
      value
    );

    this.loadFirstPage();
  }


  clearFilters(): void {

    this.selectedType.set('');
    this.selectedSource.set('');
    this.searchTerm.set('');
    this.sortMode.set(
      'newest'
    );

    this.loadFirstPage();
  }


  selectCount(
    key: 'all' | CustomerType
  ): void {

    this.selectedType.set(
      key === 'all'
        ? ''
        : key
    );

    this.loadFirstPage();
  }


  setViewMode(
    mode: CustomerViewMode
  ): void {

    this.viewMode.set(
      mode
    );
  }


  onResultsScroll(event: Event): void {
    const target = event.target as HTMLElement | null;

    if (!target || this.loading() || this.loadingMore() || !this.hasMore()) {
      return;
    }

    const threshold = 160;
    const reachedBottom =
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - threshold;

    if (reachedBottom) {
      this.loadMore();
    }
  }


  toggleAddMenu(): void {

    this.addMenuOpen.update(
      value => !value
    );
  }


  closeAddMenu(): void {

    this.addMenuOpen.set(
      false
    );
  }


  importExcel(): void {

    this.closeAddMenu();

    console.log(
      'Open Excel Import dialog.'
    );
  }


  importWithAI(): void {

    this.closeAddMenu();

    console.log(
      'Open AI Import dialog.'
    );
  }


  viewCustomer(
    customer:
      CustomerItem
  ): void {
    this.contactOpenId.set(null);
    this.viewingCustomer.set(customer);
  }


  closeCustomerView(): void {
    this.viewingCustomer.set(null);
  }


  editCustomer(
    customer:
      CustomerItem
  ): void {
    this.contactOpenId.set(null);
    this.viewingCustomer.set(null);
    this.editingCustomer.set(customer);
    this.manualFormOpen.set(true);
  }


  toggleContact(
    customer:
      CustomerItem
  ): void {
    this.viewingCustomer.set(null);
    this.contactOpenId.update(
      current =>
        current === customer.id
          ? null
          : customer.id
    );
  }


  updateCustomerType(
    customer: CustomerItem,
    nextType: CustomerType
  ): void {
    const previousType = customer.customerType;

    if (previousType === nextType || this.updatingTypeId()) {
      return;
    }

    this.updatingTypeId.set(customer.id);

    this.customerApi
      .update(customer.id, { customerType: nextType })
      .pipe(
        finalize(() => this.updatingTypeId.set(null))
      )
      .subscribe({
        next: updated => {
          this.customers.update(items =>
            items.map(item =>
              item.id === customer.id
                ? { ...item, customerType: updated.customerType }
                : item
            )
          );
          this.rebuildCountsFromCustomers();
        },
        error: error => {
          console.error('Customer type update failed:', error);
          this.apiError.set(
            error?.error?.message ||
            'Could not update customer type.'
          );
        }
      });
  }

  private rebuildCountsFromCustomers(): void {
    const items = this.customers();
    const byType: Record<string, number> = {};

    for (const type of this.customerTypes) {
      byType[type] = items.filter(
        item => item.customerType === type
      ).length;
    }

    this.countData.set({
      total: items.length,
      byType
    });
  }

  phoneLink(
    customer:
      CustomerItem
  ): string {
    const value =
      String(customer.mobile || '').trim();

    return value
      ? `tel:${value}`
      : '';
  }


  whatsappLink(
    customer:
      CustomerItem
  ): string {
    const digits =
      String(customer.mobile || '')
        .replace(/\D/g, '');

    return digits
      ? `https://wa.me/${digits}`
      : '';
  }


  hasMobile(
    customer:
      CustomerItem
  ): boolean {
    return !!String(customer.mobile || '').trim();
  }


  deleteCustomer(
    customer:
      CustomerItem
  ): void {
    if (this.deletingId()) {
      return;
    }

    const name =
      this.displayName(customer);

    this.confirmDialog.confirm({
      title: 'Delete customer?',
      subtitle: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      type: 'danger',
      icon: 'delete',
      showCancel: true,
      successButtonName: 'Delete',
      cancelButtonName: 'Cancel',
      success: () => this.performDelete(customer)
    });
  }


  private performDelete(
    customer:
      CustomerItem
  ): void {
    this.deletingId.set(customer.id);

    this.customerApi
      .delete(customer.id)
      .pipe(
        finalize(() => {
          this.deletingId.set(null);
        })
      )
      .subscribe({
        next: () => this.loadFirstPage(),
        error: error => {
          console.error('Delete customer failed:', error);
          this.apiError.set(
            error?.error?.message ||
            'Could not delete customer.'
          );
        }
      });
  }


  displayName(
    customer:
      CustomerItem
  ): string {

    const value =
      String(
        customer.name || ''
      ).trim();

    return value ||
      'Unknown User';
  }


  customerImage(
    customer:
      CustomerItem
  ): string {

    const image =
      String(
        customer.image || ''
      ).trim();

    return image ||
      this.fallbackAvatarImage(customer);
  }


  onCustomerImageError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    if (!image) {
      return;
    }

    const fallback =
      this.fallbackAvatarImageFromName(
        image.alt
      );

    if (image.src === fallback) {
      return;
    }

    image.src = fallback;
  }


  private fallbackAvatarImage(
    customer:
      CustomerItem
  ): string {

    return this.fallbackAvatarImageFromName(
      String(customer.name || '').trim(),
      String(customer.id || '').trim()
    );
  }


  private fallbackAvatarImageFromName(
    name: string,
    seed = ''
  ): string {

    const normalizedName =
      String(name || '').trim();

    const firstName =
      normalizedName
        .split(/\s+/)
        .filter(Boolean)[0] || 'U';

    const initial =
      Array.from(firstName)[0]?.toUpperCase() || 'U';

    const background =
      this.avatarBackgroundColor(
        `${seed}|${normalizedName}`
      );

    const svg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="128"
        height="128"
        viewBox="0 0 128 128"
      >
        <rect
          width="128"
          height="128"
          rx="28"
          fill="${background}"
        />
        <text
          x="64"
          y="67"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="Arial, Helvetica, sans-serif"
          font-size="58"
          font-weight="700"
          fill="#ffffff"
        >${this.escapeSvgText(initial)}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }


  private avatarBackgroundColor(
    seed: string
  ): string {

    const colors = [
      '#2563EB',
      '#7C3AED',
      '#DB2777',
      '#EA580C',
      '#059669',
      '#0891B2',
      '#4F46E5',
      '#CA8A04',
      '#0F766E',
      '#9333EA'
    ];

    let hash = 0;

    for (const character of String(seed || '')) {
      hash =
        (hash * 31 + character.charCodeAt(0)) |
        0;
    }

    const index =
      Math.abs(hash) % colors.length;

    return colors[index];
  }


  private escapeSvgText(
    value: string
  ): string {

    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }


  lastContactLabel(
    customer:
      CustomerItem
  ): string {

    const raw =
      customer.lastContactAt;

    if (!raw) {
      return 'Not contacted';
    }

    const date =
      new Date(raw);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return 'Not contacted';
    }

    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }


  customerTypeLabel(type: CustomerType): string {
    return String(type ?? '').trim();
  }


  typeIndex(type: CustomerType): number {
    const index = this.customerTypes.indexOf(type);
    return index >= 0 ? index : 0;
  }


  typeTone(index: number): CustomerCountCard['tone'] {
    return this.typeTones[index] ?? 'blue';
  }


  typeIcon(type: CustomerType): string {
    const index = this.typeIndex(type);
    return this.typeIcons[index] ?? 'person';
  }


  sourceIcon(source: CustomerSource): string {
    const index = this.customerSources.indexOf(source);
    return this.sourceIcons[index] ?? 'hub';
  }


  private normalizeCustomer(customer: CustomerItem): CustomerItem {
    return {
      ...customer,
      customerType: String(customer.customerType ?? '').trim(),
      source: String(customer.source ?? '').trim()
    };
  }

  addManual(): void {
    this.closeAddMenu();
    this.viewingCustomer.set(null);
    this.contactOpenId.set(null);
    this.editingCustomer.set(null);
    this.manualFormOpen.set(true);
  }


  closeManualForm(): void {
    this.manualFormOpen.set(false);
    this.editingCustomer.set(null);
  }


  onManualCustomerSaved(
    customer: CustomerItem
  ): void {
    this.manualFormOpen.set(false);
    this.editingCustomer.set(null);
    this.loadFirstPage();
  }
}
