import { NgClass } from '@angular/common';
import { Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { MediaApi } from '../../infrastructure/media-api';
import { MediaAsset, MediaOwnerType } from '../../domain/model/media.model';

interface UploadItem {
  file: File;
  status: 'uploading' | 'done' | 'error';
  asset?: MediaAsset;
  error?: string;
}

@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [NgClass],
  templateUrl: './media-uploader.html',
  styleUrl: './media-uploader.scss',
})
export class MediaUploader {
  private readonly mediaApi = inject(MediaApi);

  readonly ownerType = input.required<MediaOwnerType>();
  readonly ownerId = input<string | null>(null);
  readonly accept = input<string>('image/*,video/*');
  readonly multiple = input<boolean>(true);
  readonly titleText = input<string>('Arrastra un archivo aquí');
  readonly hintText = input<string>('o haz clic para seleccionar un archivo');
  readonly iconClass = input<string>('pi pi-cloud-upload');

  readonly uploaded = output<MediaAsset>();
  readonly uploadingChange = output<boolean>();

  protected readonly isDragging = signal(false);
  protected readonly items = signal<UploadItem[]>([]);

  private readonly fileInputEl = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  /** In single-file mode, the active (most recent) upload item. */
  protected readonly activeItem = computed(() =>
    !this.multiple() ? (this.items()[0] ?? null) : null,
  );

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files) {
      this.upload(files);
    }
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.upload(input.files);
    }
    input.value = '';
  }

  /** Programmatically open the file picker (for external "Replace" buttons). */
  triggerPicker(): void {
    this.fileInputEl()?.nativeElement.click();
  }

  /** Accept a drop forwarded from a parent element (for replace-over-preview scenarios). */
  handleDroppedFiles(files: FileList): void {
    this.upload(files);
  }

  private upload(fileList: FileList): void {
    const files = Array.from(fileList);
    const toUpload = this.multiple() ? files : files.slice(0, 1);
    if (!this.multiple()) {
      this.items.set([]);
    }
    for (const file of toUpload) {
      const item: UploadItem = { file, status: 'uploading' };
      this.items.update((current) => [...current, item]);
      this.emitUploadingState();
      this.mediaApi.upload(file, this.ownerType(), this.ownerId()).subscribe({
        next: (asset) => {
          this.patchItem(item, { status: 'done', asset });
          this.uploaded.emit(asset);
        },
        error: (err) => {
          this.patchItem(item, { status: 'error', error: err?.message ?? 'Upload failed' });
        },
      });
    }
  }

  private patchItem(target: UploadItem, patch: Partial<UploadItem>): void {
    this.items.update((current) =>
      current.map((item) => (item === target ? { ...item, ...patch } : item)),
    );
    this.emitUploadingState();
  }

  private emitUploadingState(): void {
    this.uploadingChange.emit(this.items().some((item) => item.status === 'uploading'));
  }
}
