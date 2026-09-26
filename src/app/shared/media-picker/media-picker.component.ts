import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  CommonModule,
} from '@angular/common';

import {
  FormsModule,
} from '@angular/forms';

import {
  finalize,
} from 'rxjs';

import {
  MaterialModule,
} from '../material/material.module';

import {
  MediaLibraryItem,
  MediaLibraryService,
} from '../../core/media-library.service';

import {
  SnackbarService,
} from '../material/notification/snackbar.service';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  templateUrl: './media-picker.component.html',
  styleUrl: './media-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPickerComponent implements OnChanges {

  @Input() open = false;
  @Input() multiple = false;
  @Input() title = 'Choose image';
  @Input() selectedIds: Array<string | number> = [];
  @Input() maxSelection = 0;

  @Output() closed =
    new EventEmitter<void>();

  @Output() selected =
    new EventEmitter<MediaLibraryItem[]>();

  readonly items =
    signal<MediaLibraryItem[]>([]);

  readonly loading =
    signal(false);

  readonly uploading =
    signal(false);

  readonly dragActive =
    signal(false);

  readonly search =
    signal('');

  readonly selection =
    signal<Map<string, MediaLibraryItem>>(
      new Map(),
    );

  private readonly media =
    inject(MediaLibraryService);

  private readonly snackbar =
    inject(SnackbarService);

  readonly accountId =
    this.media.accountId;

  readonly selectedCount = computed(
    () => this.selection().size,
  );

  readonly filteredItems = computed(
    () => {
      const query = this.search()
        .trim()
        .toLowerCase();

      if (!query) {
        return this.items();
      }

      return this.items().filter(
        (item) => {
          const text = [
            item.originalName,
            item.fileName,
            item.altText,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return text.includes(query);
        },
      );
    },
  );


  ngOnChanges(
    changes: SimpleChanges,
  ): void {

    if (
      changes['open'] &&
      this.open
    ) {
      this.prepareSelection();
      this.load();
    }
  }

  load(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.media
      .list({
        kind: 'customer',
        mediaType: 'image',
        page: 1,
        perPage: 100,
      })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          const items = Array.isArray(
            response?.items,
          )
            ? response.items
            : [];

          this.items.set(items);
          this.restoreExistingSelection(items);
        },
        error: (error) => {
          this.items.set([]);
          this.snackbar.fromApiError(
            error,
            'Could not load your image gallery.',
          );
        },
      });
  }

  onSearch(
    value: string,
  ): void {
    this.search.set(value ?? '');
  }

  onBackdropClick(
    event: MouseEvent,
  ): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    if (this.uploading()) {
      return;
    }

    this.closed.emit();
  }

  isSelected(
    item: MediaLibraryItem,
  ): boolean {
    return this.selection().has(
      String(item.id),
    );
  }

  toggle(
    item: MediaLibraryItem,
  ): void {

    if (!this.multiple) {
      this.selected.emit([item]);
      return;
    }

    const next = new Map(
      this.selection(),
    );

    const key = String(item.id);

    if (next.has(key)) {
      next.delete(key);
    } else {
      if (
        this.maxSelection > 0 &&
        next.size >= this.maxSelection
      ) {
        this.snackbar.warning(
          `You can select up to ${this.maxSelection} images.`,
        );
        return;
      }

      next.set(key, item);
    }

    this.selection.set(next);
  }

  confirmSelection(): void {
    if (!this.multiple) {
      return;
    }

    const values = Array.from(
      this.selection().values(),
    );

    if (!values.length) {
      this.snackbar.warning(
        'Select at least one image.',
      );
      return;
    }

    this.selected.emit(values);
  }

  openFileDialog(
    input: HTMLInputElement,
  ): void {
    if (!this.uploading()) {
      input.click();
    }
  }

  onFileInput(
    event: Event,
  ): void {
    const input =
      event.target as HTMLInputElement;

    const files = Array.from(
      input.files ?? [],
    );

    input.value = '';

    if (files.length) {
      this.uploadFiles(files);
    }
  }

  onDragOver(
    event: DragEvent,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.uploading()) {
      this.dragActive.set(true);
    }
  }

  onDragLeave(
    event: DragEvent,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(false);
  }

  onDrop(
    event: DragEvent,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragActive.set(false);

    const files = Array.from(
      event.dataTransfer?.files ?? [],
    );

    if (files.length) {
      this.uploadFiles(files);
    }
  }

  private uploadFiles(
    files: File[],
  ): void {

    if (this.uploading()) {
      return;
    }

    const images = files.filter(
      (file) =>
        file.type.startsWith('image/'),
    );

    if (!images.length) {
      this.snackbar.warning(
        'Please choose an image file.',
      );
      return;
    }

    const file = images[0];

    if (file.size > 10 * 1024 * 1024) {
      this.snackbar.warning(
        'Image size must be 10 MB or less.',
      );
      return;
    }

    this.uploading.set(true);

    this.media
      .uploadCustomerImage(file)
      .pipe(
        finalize(() => {
          this.uploading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          const item = response?.item;

          if (!item) {
            this.snackbar.error(
              'Upload completed but media data was not returned.',
            );
            return;
          }

          this.items.update(
            (items) => [
              item,
              ...items.filter(
                (entry) =>
                  String(entry.id) !==
                  String(item.id),
              ),
            ],
          );

          this.snackbar.success(
            'Image added to your gallery.',
          );

          if (!this.multiple) {
            this.selected.emit([item]);
            return;
          }

          const next = new Map(
            this.selection(),
          );

          next.set(
            String(item.id),
            item,
          );

          this.selection.set(next);
        },
        error: (error) => {
          this.snackbar.fromApiError(
            error,
            'Could not upload the image.',
          );
        },
      });
  }

  private prepareSelection(): void {
    const next = new Map<
      string,
      MediaLibraryItem
    >();

    for (const id of this.selectedIds) {
      next.set(
        String(id),
        {
          id,
        } as MediaLibraryItem,
      );
    }

    this.selection.set(next);
    this.search.set('');
  }

  private restoreExistingSelection(
    items: MediaLibraryItem[],
  ): void {
    if (!this.multiple) {
      return;
    }

    const ids = new Set(
      this.selectedIds.map(String),
    );

    if (!ids.size) {
      return;
    }

    const next = new Map<
      string,
      MediaLibraryItem
    >();

    for (const item of items) {
      if (ids.has(String(item.id))) {
        next.set(
          String(item.id),
          item,
        );
      }
    }

    this.selection.set(next);
  }
}
