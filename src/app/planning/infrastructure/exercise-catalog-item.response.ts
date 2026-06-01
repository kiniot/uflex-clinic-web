import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ExerciseCatalogItemResource extends BaseResource {
  id: string;
  name: string;
  description: string;
  bodyPart: string;
  movementType: string;
  videoUrl: string | null;
}

export interface ExerciseCatalogItemResponse extends BaseResponse {
  id: string;
  name: string;
  description: string;
  bodyPart: string;
  movementType: string;
  videoUrl: string | null;
}
