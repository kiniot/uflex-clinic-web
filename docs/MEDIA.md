# Media (subida de imagen/video) — web

Feature en `src/app/media/`. Sube archivos a Supabase Storage mediante el flujo de
**URL firmada** contra el backend (`/api/v1/media`).

> Guía completa: `uflex-project-report/docs/media-storage-implementation.md`.

## Componente drag & drop (recomendado)

Reemplaza los inputs donde antes se pegaba una URL:

```html
<app-media-uploader
  [ownerType]="'PHYSIOTHERAPIST_RECORD'"
  [ownerId]="recordId"
  (uploaded)="onMediaUploaded($event)" />
```

```ts
import { MediaUploader } from '../../media/presentation/media-uploader/media-uploader';
// @Component({ imports: [MediaUploader] })
onMediaUploaded(asset: MediaAsset) { this.previewUrl = asset.downloadUrl; }
```

## Solo servicio

```ts
private readonly media = inject(MediaApi);

this.media.upload(file, 'PATIENT_EVIDENCE', patientId)
  .subscribe(asset => this.previewUrl = asset.downloadUrl);

this.media.listByOwner('PHYSIOTHERAPIST_RECORD', recordId)
  .subscribe(assets => this.assets = assets);
```

## Archivos

- `domain/model/media.model.ts` — tipos.
- `infrastructure/media-api.ts` — `MediaApi` (flujo completo). La subida a Supabase
  usa `HttpClient` con `HttpBackend` (**sin interceptores**) para no filtrar el JWT.
- `presentation/media-uploader/` — componente standalone.

## Detalles

- Las `downloadUrl` caducan (~1 h). Refresca con `getById()` si la vista vive mucho.
- `ownerType`: `PHYSIOTHERAPIST_RECORD` · `PATIENT_EVIDENCE` · `PROFILE_PHOTO` · `GENERIC`.
