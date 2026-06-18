import { HttpBackend, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { toAppError } from '../../shared/infrastructure/app-error.mapper';
import {
  CreateMediaUploadRequest,
  MediaAsset,
  MediaKind,
  MediaOwnerType,
  MediaUploadTicket,
} from '../domain/model/media.model';

/**
 * API service for the media bounded context. Implements the signed-URL flow:
 *
 *   1. createUpload()      -> POST /media/uploads (through our backend, Bearer added by interceptor)
 *   2. uploadToStorage()   -> PUT directly to Supabase (interceptor BYPASSED so our JWT never leaks)
 *   3. confirmUpload()     -> POST /media/uploads/{id}/confirm
 *
 * Use the convenience upload() method to run all three steps in order.
 */
@Injectable({ providedIn: 'root' })
export class MediaApi {
  /** Goes through the iam interceptor (adds the Bearer token to OUR backend). */
  private readonly http = inject(HttpClient);
  /** Interceptor-free client used ONLY for the direct PUT to Supabase Storage. */
  private readonly rawHttp = new HttpClient(inject(HttpBackend));
  private readonly baseUrl = `${environment.apiBaseUrl}/media`;

  /** Step 1: get a signed upload ticket from the backend. */
  createUpload(request: CreateMediaUploadRequest): Observable<MediaUploadTicket> {
    return this.http
      .post<MediaUploadTicket>(`${this.baseUrl}/uploads`, request)
      .pipe(catchError(this.handleError('Failed to create media upload')));
  }

  /** Step 2: upload the raw file bytes straight to Supabase Storage. */
  uploadToStorage(ticket: MediaUploadTicket, file: File): Observable<unknown> {
    return this.rawHttp
      .put(ticket.uploadUrl, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
      })
      .pipe(catchError(this.handleError('Failed to upload file to storage')));
  }

  /** Step 3: confirm the upload so the asset becomes UPLOADED. */
  confirmUpload(mediaAssetId: string, sizeBytes?: number): Observable<MediaAsset> {
    return this.http
      .post<MediaAsset>(`${this.baseUrl}/uploads/${mediaAssetId}/confirm`, { sizeBytes })
      .pipe(catchError(this.handleError('Failed to confirm media upload')));
  }

  /** Runs the full 3-step flow and returns the confirmed asset. */
  upload(file: File, ownerType: MediaOwnerType, ownerId?: string | null): Observable<MediaAsset> {
    const mediaType: MediaKind = file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE';
    const request: CreateMediaUploadRequest = {
      ownerType,
      ownerId: ownerId ?? null,
      mediaType,
      contentType: file.type || 'application/octet-stream',
      fileName: file.name,
      sizeBytes: file.size,
    };
    return this.createUpload(request).pipe(
      switchMap((ticket) =>
        this.uploadToStorage(ticket, file).pipe(
          switchMap(() => this.confirmUpload(ticket.mediaAssetId, file.size)),
        ),
      ),
    );
  }

  /** Lists uploaded assets for an owner (each with a fresh signed download URL). */
  listByOwner(ownerType: MediaOwnerType, ownerId?: string | null): Observable<MediaAsset[]> {
    let url = `${this.baseUrl}?ownerType=${encodeURIComponent(ownerType)}`;
    if (ownerId) {
      url += `&ownerId=${encodeURIComponent(ownerId)}`;
    }
    return this.http
      .get<MediaAsset[]>(url)
      .pipe(catchError(this.handleError('Failed to list media assets')));
  }

  getById(mediaAssetId: string): Observable<MediaAsset> {
    return this.http
      .get<MediaAsset>(`${this.baseUrl}/${mediaAssetId}`)
      .pipe(catchError(this.handleError('Failed to fetch media asset')));
  }

  delete(mediaAssetId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${mediaAssetId}`)
      .pipe(catchError(this.handleError('Failed to delete media asset')));
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> =>
      throwError(() => toAppError(error, operation));
  }
}
