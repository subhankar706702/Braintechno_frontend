import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  AuthService
} from '../../core/auth.service';

import {
  TemplateDraft,
  TemplateGalleryCategory
} from '../../core/models';

import {
  TemplateStorageService
} from '../../core/template-storage.service';
import { SnackbarService } from '../../shared/material/notification/snackbar.service';



interface TypeFilter {
  value: number;
  label: string;
}


@Component({
  selector:
    'bt-template-gallery',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],

  templateUrl:
    './template-gallery.component.html',

  styleUrl:
    './template-gallery.component.scss'
})
export class TemplateGalleryComponent {

  readonly masterAccountId =
    '0';


  readonly typeFilters:
    TypeFilter[] = [
      {
        value: 0,
        label: 'All'
      },
      {
        value: 1,
        label: 'Jewellery'
      },
      {
        value: 2,
        label: 'Cake Shop'
      },
      {
        value: 3,
        label: 'Photography'
      },
      {
        value: 4,
        label: 'Fashion'
      },
      {
        value: 5,
        label: 'Restaurant'
      },
      {
        value: 6,
        label: 'Salon & Beauty'
      },
      {
        value: 7,
        label: 'Services'
      }
    ];


  items:
    TemplateDraft[] = [];

  loading = true;

  usingId = '';

  error = '';

  searchText = '';

  selectedType = 0;


  constructor(
    public auth:
      AuthService,

    private storage:
      TemplateStorageService,

    private router:
      Router,

    private snackbar:
      SnackbarService,

    private cdr:
      ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    void this.load();
  }


  get accountId(): string {

    return String(
      this.auth.user()
        ?.accountId ??
      ''
    );
  }


  get filteredItems():
    TemplateDraft[] {

    const query =
      this.searchText
        .trim()
        .toLowerCase();


    return this.items.filter(
      (item) => {

        const typeMatch =
          this.selectedType === 0 ||
          Number(
            item.templateType ||
            0
          ) ===
            this.selectedType;


        if (!typeMatch) {
          return false;
        }


        if (!query) {
          return true;
        }


        const searchable =
          [
            item.name,
            item.description,
            this.typeLabel(
              item.templateType
            ),
            item.galleryCategory
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();


        return searchable.includes(
          query
        );
      }
    );
  }


  previewUrl(
    item: TemplateDraft
  ): string {

    return this.storage
      .previewUrl(item);
  }


  category(
    item: TemplateDraft
  ): TemplateGalleryCategory {

    const value =
      item.galleryCategory;


    if (
      value === 'new' ||
      value === 'locked' ||
      value === 'free' ||
      value === 'coming_soon'
    ) {
      return value;
    }


    return 'free';
  }


  categoryLabel(
    item: TemplateDraft
  ): string {

    switch (
      this.category(item)
    ) {

      case 'new':
        return 'NEW';

      case 'locked':
        return 'LOCKED';

      case 'coming_soon':
        return 'COMING SOON';

      default:
        return 'FREE';
    }
  }


  isUsable(
    item: TemplateDraft
  ): boolean {

    const value =
      this.category(item);


    return (
      value !== 'locked' &&
      value !== 'coming_soon'
    );
  }


  typeLabel(
    value:
      number |
      null |
      undefined
  ): string {

    const item =
      this.typeFilters.find(
        (type) =>
          type.value ===
          Number(
            value || 0
          )
      );


    return (
      item?.label ||
      'General'
    );
  }


  selectType(
    value: number
  ): void {

    this.selectedType =
      value;
  }


  clearSearch(): void {
    this.searchText = '';
  }


  back(): void {

    void this.router
      .navigateByUrl(
        '/app/templates'
      );
  }


  async view(
    item: TemplateDraft
  ): Promise<void> {

    await this.router.navigate(
      [
        '/template',
        item.id,
        'view'
      ],
      {
        queryParams: {
          returnUrl:
            '/app/template-gallery',

          mode:
            'view'
        }
      }
    );
  }


  async useTemplate(
    item: TemplateDraft
  ): Promise<void> {

    if (
      !this.isUsable(item) ||
      !!this.usingId
    ) {
      return;
    }


    if (!this.accountId) {

      this.snackbar.warning(
        'Account ID is missing.'
      );

      return;
    }


    try {

      this.usingId =
        item.id;

      this.cdr
        .detectChanges();


      /*
       * storage.create() creates the copy
       * under the currently logged-in account.
       * The master accountId 0 record remains unchanged.
       */
      const copy =
        await this.storage.create(
          item.name
        );


      await this.storage.save({
        ...copy,

        name:
          item.name,

        description:
          item.description,

        design:
          structuredClone(
            item.design
          ),

        html:
          item.html,

        previewImage:
          item.previewImage,

        previewImageName:
          item.previewImageName,

        status:
          'draft'
      });


      this.snackbar.success(
        'Template added to your account.'
      );


      await this.router
        .navigateByUrl(
          '/app/templates'
        );

    } catch (error) {

      console.error(
        'Use template error:',
        error
      );


      this.snackbar
        .fromApiError(
          error,
          'Could not add this template.'
        );

    } finally {

      this.usingId = '';

      this.cdr
        .detectChanges();
    }
  }


  async reload():
    Promise<void> {

    await this.load();
  }


  private async load():
    Promise<void> {

    try {

      this.loading = true;
      this.error = '';

      this.cdr
        .detectChanges();


      /*
       * Gallery always reads the master
       * gallery account only.
       */
      const result =
        await this.storage.list(
          this.masterAccountId
        );


      this.items =
        (
          Array.isArray(result)
            ? result
            : []
        )
          .filter(
            (item) =>
              String(
                item.accountId ??
                this.masterAccountId
              ) ===
              this.masterAccountId
          );


    } catch (error) {

      console.error(
        'Template gallery load error:',
        error
      );


      this.items = [];

      this.error =
        'Could not load template gallery.';


      this.snackbar
        .fromApiError(
          error,
          'Could not load template gallery.'
        );

    } finally {

      this.loading = false;

      this.cdr
        .detectChanges();
    }
  }
}
