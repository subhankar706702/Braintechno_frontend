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

  readonly usingDemoData =
    signal(false);

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



  readonly customerTypes:
    CustomerType[] =
    [
      'New',
      'Regular',
      'VIP',
      'Interested',
      'Followup',
      'Converted'
    ];


  readonly customerSources:
    CustomerSource[] =
    [
      'Facebook',
      'WhatsApp',
      'Manual',
      'Excel',
      'AI',
      'Instagram',
      'Direct',
      'Campaign'
    ];


  private searchTimer:
    ReturnType<
      typeof setTimeout
    > | null =
    null;


  private readonly demoCustomers:
    CustomerItem[] =
    [
      {
        id: 'demo-1',
        accountId: 'BT00001',
        name: 'Rahul Sharma',
        mobile: '+91 98765 43210',
        email: 'rahul.sharma@example.com',
        customerType: 'VIP',
        source: 'Facebook',
        image: 'https://i.pravatar.cc/160?img=12',
        createdAt: '2026-09-23T10:20:00',
        lastContactAt: '2026-09-23T11:45:00'
      },
      {
        id: 'demo-2',
        accountId: 'BT00001',
        name: 'Priya Das',
        mobile: '+91 98312 77891',
        email: 'priya.das@example.com',
        customerType: 'New',
        source: 'Instagram',
        image: 'https://i.pravatar.cc/160?img=47',
        createdAt: '2026-09-23T09:10:00',
        lastContactAt: '2026-09-23T10:20:00'
      },
      {
        id: 'demo-3',
        accountId: 'BT00001',
        name: 'Arindam Sen',
        mobile: '+91 90022 14398',
        email: 'arindam.sen@example.com',
        customerType: 'Regular',
        source: 'WhatsApp',
        image: 'https://i.pravatar.cc/160?img=33',
        createdAt: '2026-09-22T15:25:00',
        lastContactAt: '2026-09-22T18:00:00'
      },
      {
        id: 'demo-4',
        accountId: 'BT00001',
        name: '',
        mobile: '+91 98360 55128',
        email: 'unknown@example.com',
        customerType: 'Interested',
        source: 'Direct',
        image: '',
        createdAt: '2026-09-22T13:45:00',
        lastContactAt: '2026-09-22T16:20:00'
      },
      {
        id: 'demo-5',
        accountId: 'BT00001',
        name: 'Sourav Ghosh',
        mobile: '+91 70039 33219',
        email: 'sourav.ghosh@example.com',
        customerType: 'Followup',
        source: 'Manual',
        image: '',
        createdAt: '2026-09-21T16:10:00',
        lastContactAt: '2026-09-21T18:15:00'
      },
      {
        id: 'demo-6',
        accountId: 'BT00001',
        name: 'Madhumita Paul',
        mobile: '+91 98741 39087',
        email: 'madhumita.paul@example.com',
        customerType: 'Converted',
        source: 'Excel',
        image: 'https://i.pravatar.cc/160?img=44',
        createdAt: '2026-09-20T12:20:00',
        lastContactAt: '2026-09-20T16:30:00'
      },
      {
        id: 'demo-7',
        accountId: 'BT00001',
        name: 'Amitava Dey',
        mobile: '+91 80139 82910',
        email: 'amitava.dey@example.com',
        customerType: 'Regular',
        source: 'AI',
        image: '',
        createdAt: '2026-09-19T18:05:00',
        lastContactAt: '2026-09-19T18:30:00'
      },
      {
        id: 'demo-8',
        accountId: 'BT00001',
        name: 'Nandini Chatterjee',
        mobile: '+91 98302 78116',
        email: 'nandini.c@example.com',
        customerType: 'VIP',
        source: 'Instagram',
        image: 'https://i.pravatar.cc/160?img=49',
        createdAt: '2026-09-18T10:30:00',
        lastContactAt: '2026-09-18T12:10:00'
      },
      {
        id: 'demo-9',
        accountId: 'BT00001',
        name: 'Ritwik Banerjee',
        mobile: '+91 98364 90127',
        email: 'ritwik.b@example.com',
        customerType: 'Interested',
        source: 'Facebook',
        image: '',
        createdAt: '2026-09-17T09:15:00',
        lastContactAt: '2026-09-17T11:00:00'
      },
      {
        id: 'demo-10',
        accountId: 'BT00001',
        name: 'Ananya Mukherjee',
        mobile: '+91 62910 47883',
        email: 'ananya.m@example.com',
        customerType: 'New',
        source: 'Direct',
        image: 'https://i.pravatar.cc/160?img=32',
        createdAt: '2026-09-16T14:35:00',
        lastContactAt: '2026-09-16T15:20:00'
      },
      {
        id: 'demo-11',
        accountId: 'BT00001',
        name: 'Debjit Saha',
        mobile: '+91 98314 57241',
        email: 'debjit.saha@example.com',
        customerType: 'Followup',
        source: 'WhatsApp',
        image: '',
        createdAt: '2026-09-15T08:40:00',
        lastContactAt: '2026-09-15T09:40:00'
      },
      {
        id: 'demo-12',
        accountId: 'BT00001',
        name: 'Ishita Bose',
        mobile: '+91 70444 22819',
        email: 'ishita.bose@example.com',
        customerType: 'Converted',
        source: 'Manual',
        image: 'https://i.pravatar.cc/160?img=48',
        createdAt: '2026-09-14T11:50:00',
        lastContactAt: '2026-09-14T14:00:00'
      },
      {
        id: 'demo-13',
        accountId: 'BT00001',
        name: 'Abhishek Pal',
        mobile: '+91 98365 90288',
        email: 'abhishek.pal@example.com',
        customerType: 'Regular',
        source: 'Excel',
        image: '',
        createdAt: '2026-09-13T17:05:00',
        lastContactAt: '2026-09-13T18:05:00'
      },
      {
        id: 'demo-14',
        accountId: 'BT00001',
        name: 'Riya Mondal',
        mobile: '+91 62915 33118',
        email: 'riya.mondal@example.com',
        customerType: 'VIP',
        source: 'AI',
        image: 'https://i.pravatar.cc/160?img=46',
        createdAt: '2026-09-12T10:15:00',
        lastContactAt: '2026-09-12T12:00:00'
      },
      {
        id: 'demo-15',
        accountId: 'BT00001',
        name: 'Kaustav Ray',
        mobile: '+91 90075 41822',
        email: 'kaustav.ray@example.com',
        customerType: 'Interested',
        source: 'Facebook',
        image: '',
        createdAt: '2026-09-11T09:50:00',
        lastContactAt: '2026-09-11T10:50:00'
      },
      {
        id: 'demo-16',
        accountId: 'BT00001',
        name: 'Tania Dutta',
        mobile: '+91 98310 44072',
        email: 'tania.dutta@example.com',
        customerType: 'New',
        source: 'Instagram',
        image: '',
        createdAt: '2026-09-10T13:30:00',
        lastContactAt: '2026-09-10T15:30:00'
      },
      {
        id: 'demo-17',
        accountId: 'BT00001',
        name: 'Sagnik Bhattacharya',
        mobile: '+91 87775 66310',
        email: 'sagnik.b@example.com',
        customerType: 'Followup',
        source: 'Direct',
        image: '',
        createdAt: '2026-09-09T12:20:00',
        lastContactAt: '2026-09-09T13:00:00'
      },
      {
        id: 'demo-18',
        accountId: 'BT00001',
        name: 'Moumita Kar',
        mobile: '+91 98304 82176',
        email: 'moumita.kar@example.com',
        customerType: 'Converted',
        source: 'WhatsApp',
        image: 'https://i.pravatar.cc/160?img=41',
        createdAt: '2026-09-08T09:05:00',
        lastContactAt: '2026-09-08T10:20:00'
      }
    ];


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
          key: 'New',
          tone: 'green'
        },
        {
          label: 'Regular',
          value: value.regular,
          icon: 'repeat',
          key: 'Regular',
          tone: 'teal'
        },
        {
          label: 'VIP',
          value: value.vip,
          icon: 'workspace_premium',
          key: 'VIP',
          tone: 'violet'
        },
        {
          label: 'Interested',
          value: value.interested,
          icon: 'favorite',
          key: 'Interested',
          tone: 'pink'
        },
        {
          label: 'Followup',
          value: value.followup,
          icon: 'schedule',
          key: 'Followup',
          tone: 'orange'
        },
        {
          label: 'Converted',
          value: value.converted,
          icon: 'verified',
          key: 'Converted',
          tone: 'green'
        }
      ];
    });


  constructor(
    private readonly auth:
      AuthService,

    private readonly customerApi:
      CustomerApiService
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

          this.usingDemoData.set(
            false
          );

          this.customers.set(
            Array.isArray(
              response.items
            )
              ? response.items
              : []
          );

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

          /*
           * Demo fallback is kept only so the UI
           * can still be reviewed while backend is
           * not running. Remove this fallback later
           * if production should show API errors only.
           */
          this.loadDemoData();

          this.apiError.set(
            'Backend is not connected. Showing demo customers.'
          );
        }
      });
  }


  loadMore(): void {

    if (
      this.loading() ||
      this.loadingMore() ||
      !this.hasMore() ||
      this.usingDemoData()
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

          const incoming =
            Array.isArray(
              response.items
            )
              ? response.items
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
            response.counts
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


  onResultsScroll(
    event: Event
  ): void {

    // const target =
    //   event.currentTarget
    //   as HTMLElement;

    // const remaining =
    //   target.scrollHeight -
    //   target.scrollTop -
    //   target.clientHeight;

    // if (
    //   remaining <= 220
    // ) {
    //   this.loadMore();
    // }
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

    console.log(
      'View customer:',
      customer
    );
  }


  messageCustomer(
    customer:
      CustomerItem
  ): void {

    console.log(
      'Message customer:',
      customer
    );
  }


  deleteCustomer(
    customer:
      CustomerItem
  ): void {

    if (
      this.deletingId()
    ) {
      return;
    }

    const name =
      this.displayName(
        customer
      );

    const confirmed =
      window.confirm(
        `Delete ${name}?`
      );

    if (!confirmed) {
      return;
    }

    if (
      this.usingDemoData() ||
      customer.id
        .startsWith(
          'demo-'
        )
    ) {
      this.customers.update(
        current =>
          current.filter(
            item =>
              item.id !==
              customer.id
          )
      );

      this.rebuildDemoCounts();

      return;
    }

    this.deletingId.set(
      customer.id
    );

    this.customerApi
      .delete(
        customer.id
      )
      .pipe(
        finalize(() => {
          this.deletingId.set(
            null
          );
        })
      )
      .subscribe({
        next: () => {
          this.loadFirstPage();
        },

        error: error => {
          console.error(
            'Delete customer failed:',
            error
          );

          window.alert(
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
      Direct: 'link',
      Campaign: 'campaign'
    };

    return map[source];
  }


  typeIcon(
    type:
      CustomerType
  ): string {

    const map:
      Record<
        CustomerType,
        string
      > =
    {
      New: 'person_add',
      Regular: 'repeat',
      VIP: 'workspace_premium',
      Interested: 'favorite',
      Followup: 'schedule',
      Converted: 'verified'
    };

    return map[type];
  }


  private loadDemoData():
    void {

    this.usingDemoData.set(
      true
    );

    const type =
      this.selectedType();

    const source =
      this.selectedSource();

    const search =
      this.searchTerm()
        .trim()
        .toLowerCase();

    let items =
      [...this.demoCustomers];

    if (type) {
      items =
        items.filter(
          item =>
            item.customerType ===
            type
        );
    }

    if (source) {
      items =
        items.filter(
          item =>
            item.source ===
            source
        );
    }

    if (search) {
      items =
        items.filter(
          item =>
            [
              this.displayName(
                item
              ),
              item.mobile,
              item.email,
              item.source,
              item.customerType
            ]
              .join(' ')
              .toLowerCase()
              .includes(
                search
              )
        );
    }

    items.sort(
      (
        left,
        right
      ) => {

        if (
          this.sortMode() ===
          'name_asc'
        ) {
          return this
            .displayName(left)
            .localeCompare(
              this.displayName(
                right
              )
            );
        }

        if (
          this.sortMode() ===
          'name_desc'
        ) {
          return this
            .displayName(right)
            .localeCompare(
              this.displayName(
                left
              )
            );
        }

        const leftTime =
          new Date(
            left.createdAt
          ).getTime();

        const rightTime =
          new Date(
            right.createdAt
          ).getTime();

        return (
          this.sortMode() ===
          'oldest'
        )
          ? leftTime -
          rightTime
          : rightTime -
          leftTime;
      }
    );

    this.customers.set(
      items
    );

    this.hasMore.set(
      false
    );

    this.rebuildDemoCounts();
  }


  private rebuildDemoCounts():
    void {

    const items =
      this.demoCustomers;

    const count =
      (
        type:
          CustomerType
      ) =>
        items.filter(
          item =>
            item.customerType ===
            type
        ).length;

    this.countData.set({
      total:
        items.length,

      new:
        count('New'),

      regular:
        count('Regular'),

      vip:
        count('VIP'),

      interested:
        count('Interested'),

      followup:
        count('Followup'),

      converted:
        count('Converted')
    });
  }




  addManual(): void {
    this.closeAddMenu();

    this.manualFormOpen.set(true);
  }


  closeManualForm(): void {
    this.manualFormOpen.set(false);
  }


  onManualCustomerCreated(): void {
    this.manualFormOpen.set(false);

    this.loadFirstPage();
  }

  onManualCustomerSaved(event: CustomerItem): void {}
  editingCustomer(a?: CustomerItem){ }
  closeCustomerView(a: CustomerItem){}
}
