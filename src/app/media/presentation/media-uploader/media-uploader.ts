import { NgClass } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { MediaApi } from '../../infrastructure/media-api';
import { MediaAsset, MediaOwnerType } from '../../domain/model/media.model';

interface UploadItem {
  file: File;
  status: 'uploading' | 'done' | 'error';
  asset?: MediaAsset;
  error?: string;
}

/**
 * Reusable drag & drop uploader for images and videos. Replaces the old
 * "paste an URL" inputs: drop a file (or click to browse) and it is uploaded to
 * Supabase Storage through the backend signed-URL flow.
 *
 * Usage:
 *   <app-media-uploader
 *     [ownerType]="'PHYSIOTHERAPIST_RECORD'"
 *     [ownerId]="recordId"
 *     (uploaded)="onUploaded($event)" />
 */
@Component({
  selector: 'app-media-uploader',
  standalone: true,
  imports: [NgClass],
  templateUrl: './media-uploader.html',
  styleUrl: './media-uploader.css',
})
export class MediaUploader {
  private readonly mediaApi = inject(MediaApi);

  /** What the uploaded media is attached to. */
  readonly ownerType = input.required<MediaOwnerType>();
  /** Id of the owner entity (optional for GENERIC owners). */
  readonly ownerId = input<string | null>(null);
  /** Accepted file types for the file picker. */
  readonly accept = input<string>('image/*,video/*');
  /** Allow selecting/dropping more than one file. */
  readonly multiple = input<boolean>(true);

  /** Emitted once per file successfully uploaded and confirmed. */
  readonly uploaded = output<MediaAsset>();

  protected readonly isDragging = signal(false);
  protected readonly items = signal<UploadItem[]>([]);

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
      this.handleFiles(files);
    }
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
    input.value = '';
  }

  private handleFiles(fileList: FileList): void {
    const files = Array.from(fileList);
    const toUpload = this.multiple() ? files : files.slice(0, 1);
    for (const file of toUpload) {
      const item: UploadItem = { file, status: 'uploading' };
      this.items.update((current) => [...current, item]);
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
  }
}
