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
import { CustomerType as CustomerTypeEnum } from '../shared/enums/customer-type.enum';
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
    '/assets/customer/default-avatar.svg';

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
      new: 0,
      regular: 0,
      vip: 0,
      interested: 0,
      followup: 0,
      converted: 0
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


  readonly customerTypes: CustomerType[] = Object.values(CustomerTypeEnum);

  readonly customerTypeEnum = CustomerTypeEnum;


  readonly customerSources:
    CustomerSource[] =
    [
      'Facebook',
      'WhatsApp',
      'Manual',
      'Excel',
      'AI',
      'Instagram',
      'Direct'
    ];


  private searchTimer:
    ReturnType<
      typeof setTimeout
    > | null =
    null;


  readonly countCards =
    computed<
      CustomerCountCard[]
    >(() => {

      const value =
        this.countData();

      return [
        {
          label: 'Total Customers',
          value: value.total,
          icon: 'groups',
          key: 'all',
          tone: 'blue'
        },
        {
          label: 'New',
          value: value.new,
          icon: 'person_add',
          key: CustomerTypeEnum.New,
          tone: 'green'
        },
        {
          label: 'Regular',
          value: value.regular,
          icon: 'repeat',
          key: CustomerTypeEnum.Regular,
          tone: 'teal'
        },
        {
          label: 'VIP',
          value: value.vip,
          icon: 'workspace_premium',
          key: CustomerTypeEnum.VIP,
          tone: 'violet'
        },
        {
          label: 'Interested',
          value: value.interested,
          icon: 'favorite',
          key: CustomerTypeEnum.Interested,
          tone: 'pink'
        },
        {
          label: 'Followup',
          value: value.followup,
          icon: 'schedule',
          key: CustomerTypeEnum.Followup,
          tone: 'orange'
        },
        {
          label: 'Converted',
          value: value.converted,
          icon: 'verified',
          key: CustomerTypeEnum.Converted,
          tone: 'green'
        }
      ];
    });


  constructor(
    private readonly auth:
      AuthService,

    private readonly customerApi:
      CustomerApiService,

    private readonly confirmDialog:
      ConfirmDialogService
  ) { }


  ngOnInit(): void {
    this.loadFirstPage();
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
            response.counts
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
            new: 0,
            regular: 0,
            vip: 0,
            interested: 0,
            followup: 0,
            converted: 0
          });
          this.apiError.set(
            error?.error?.message ||
            'Could not load customers.'
          );
        }
      });
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

    if (
      previousType === nextType ||
      this.updatingTypeId()
    ) {
      return;
    }

    this.updatingTypeId.set(
      customer.id
    );

    this.customerApi
      .update(
        customer.id,
        {
          customerType: nextType
        }
      )
      .pipe(
        finalize(() => {
          this.updatingTypeId.set(null);
        })
      )
      .subscribe({
        next: updated => {
          const updatedType =
            this.normalizeCustomerType(
              updated.customerType
            );

          this.customers.update(
            items =>
              items.map(item =>
                item.id === customer.id
                  ? {
                    ...item,
                    customerType: updatedType
                  }
                  : item
              )
          );

          this.rebuildCountsFromCustomers();
        },

        error: error => {
          console.error(
            'Customer type update failed:',
            error
          );

          this.apiError.set(
            error?.error?.message ||
            'Could not update customer type.'
          );
        }
      });
  }

  private rebuildCountsFromCustomers(): void {
    const items = this.customers();
    const count = (type: CustomerType) =>
      items.filter(item => item.customerType === type).length;

    this.countData.set({
      total: items.length,
      new: count(CustomerTypeEnum.New),
      regular: count(CustomerTypeEnum.Regular),
      vip: count(CustomerTypeEnum.VIP),
      interested: count(CustomerTypeEnum.Interested),
      followup: count(CustomerTypeEnum.Followup),
      converted: count(CustomerTypeEnum.Converted)
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

    return (
      String(
        customer.image || ''
      ).trim() ||
      this.defaultProfileImage
    );
  }


  onCustomerImageError(
    event: Event
  ): void {

    const image =
      event.target as HTMLImageElement;

    if (
      image.src.endsWith(
        this.defaultProfileImage
      )
    ) {
      return;
    }

    image.src =
      this.defaultProfileImage;
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


  customerTypeLabel(
    type: CustomerType
  ): string {
    const value = String(type ?? '').trim();

    const labels: Record<string, string> = {
      new: 'New',
      New: 'New',
      regular: 'Regular',
      Regular: 'Regular',
      vip: 'VIP',
      VIP: 'VIP',
      interested: 'Interested',
      Interested: 'Interested',
      followup: 'Followup',
      Followup: 'Followup',
      converted: 'Converted',
      Converted: 'Converted'
    };

    return labels[value] || value;
  }


  private normalizeCustomerType(
    value: unknown
  ): CustomerType {
    const raw = String(value ?? '').trim().toLowerCase();

    const map: Record<string, CustomerType> = {
      new: CustomerTypeEnum.New,
      regular: CustomerTypeEnum.Regular,
      vip: CustomerTypeEnum.VIP,
      interested: CustomerTypeEnum.Interested,
      followup: CustomerTypeEnum.Followup,
      converted: CustomerTypeEnum.Converted
    };

    return map[raw] ?? CustomerTypeEnum.New;
  }


  private normalizeCustomer(
    customer: CustomerItem
  ): CustomerItem {
    return {
      ...customer,
      customerType: this.normalizeCustomerType(
        customer.customerType
      )
    };
  }


  sourceIcon(
    source:
      CustomerSource
  ): string {

    const map:
      Record<
        CustomerSource,
        string
      > =
    {
      Facebook: 'public',
      WhatsApp: 'chat',
      Manual: 'edit_note',
      Excel: 'table_view',
      AI: 'auto_awesome',
      Instagram: 'photo_camera',
      Direct: 'link'
    };

    return map[source];
  }


  typeIcon(
    type:
      CustomerType
  ): string {

    const map: Record<string, string> = {
      new: 'person_add',
      regular: 'repeat',
      vip: 'workspace_premium',
      interested: 'favorite',
      followup: 'schedule',
      converted: 'verified'
    };

    return (
      map[String(type ?? '').trim().toLowerCase()] ||
      'person'
    );
  }


  addManual(): void {
    this.closeAddMenu();
    this.viewingCustomer.set(null);
    this.contactOpenId.set(null);
    this.editingCustomer.set(null);
    this.manualFormOpen.set(true);
  }
  loadMore(): void {
    if (
      this.loading() ||
      this.loadingMore() ||
      !this.hasMore()
    ) {
      return;
    }

    const accountId = this.accountId;

    if (
      accountId === null ||
      accountId === undefined ||
      accountId === ''
    ) {
      return;
    }

    const nextPage = this.page() + 1;

    this.loadingMore.set(true);

    this.customerApi
      .list({
        accountId,
        page: nextPage,
        limit: this.pageSize,
        search: this.searchTerm(),
        type: this.selectedType(),
        source: this.selectedSource(),
        sort: this.sortMode()
      })
      .pipe(
        finalize(() => {
          this.loadingMore.set(false);
        })
      )
      .subscribe({
        next: response => {
          const incoming = Array.isArray(response.items)
            ? response.items
            : [];

          this.customers.update(current => [
            ...current,
            ...incoming
          ]);

          this.page.set(nextPage);

          this.hasMore.set(
            !!response.meta?.hasMore
          );

          this.countData.set(
            response.counts
          );
        },

        error: error => {
          console.error(
            'Could not load more customers:',
            error
          );

          this.apiError.set(
            error?.error?.message ||
            'Could not load more customers.'
          );
        }
      });
  }


  onResultsScroll(event: Event): void {
    const target = event.currentTarget as HTMLElement;

    if (!target) {
      return;
    }

    const remaining =
      target.scrollHeight -
      target.scrollTop -
      target.clientHeight;

    if (remaining <= 220) {
      this.loadMore();
    }
  }


  onSearchChange(value: string): void {
    this.searchTerm.set(
      String(value || '')
    );

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.loadFirstPage();
    }, 350);
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
