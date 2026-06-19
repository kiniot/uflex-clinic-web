/**
 * Domain model for the media (image/video) upload feature.
 * Mirrors the backend `media` bounded context resources.
 */

export type MediaOwnerType =
  | 'PHYSIOTHERAPIST_RECORD'
  | 'PATIENT_EVIDENCE'
  | 'EXERCISE_VIDEO'
  | 'PROFILE_PHOTO'
  | 'GENERIC';

export type MediaKind = 'IMAGE' | 'VIDEO';

export type MediaStatus = 'PENDING' | 'UPLOADED' | 'FAILED';

export type MediaUploadStrategy = 'SIMPLE_PUT' | 'TUS_RESUMABLE';

/** Step 1 request: ask the backend for a signed upload URL. */
export interface CreateMediaUploadRequest {
  ownerType: MediaOwnerType;
  ownerId?: string | null;
  mediaType: MediaKind;
  contentType: string;
  fileName?: string;
  sizeBytes?: number;
}

/** Step 1 response: everything needed to upload directly to Supabase Storage. */
export interface MediaUploadTicket {
  mediaAssetId: string;
  bucket: string;
  objectPath: string;
  uploadUrl: string;
  token: string;
  expiresInSeconds: number;
  preferredStrategy?: MediaUploadStrategy;
  resumableEndpoint?: string | null;
  resumableHeaders?: Record<string, string> | null;
  resumableMetadata?: Record<string, string> | null;
  resumableChunkSizeBytes?: number | null;
  status: MediaStatus;
}

/** A stored media asset, with a short-lived signed download URL. */
export interface MediaAsset {
  id: string;
  ownerType: MediaOwnerType;
  ownerId: string | null;
  mediaType: MediaKind;
  status: MediaStatus;
  contentType: string;
  originalFileName: string | null;
  sizeBytes: number | null;
  downloadUrl: string | null;
  createdAt: string;
}
