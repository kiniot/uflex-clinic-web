import { CreateExerciseCommand } from '../domain/model/create-exercise.command';
import { ExerciseCatalogItem } from '../domain/model/exercise-catalog-item.entity';
import { UpdateExerciseCommand } from '../domain/model/update-exercise.command';
import { SaveExerciseRequest } from './save-exercise.request';
import {
  ExerciseCatalogItemResource,
  ExerciseCatalogItemResponse,
} from './exercise-catalog-item.response';

export class ExerciseCatalogItemAssembler {
  toResourceFromResponse(response: ExerciseCatalogItemResponse): ExerciseCatalogItemResource {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      bodyPart: response.bodyPart,
      movementType: response.movementType,
      videoUrl: response.videoUrl ?? null,
    } as ExerciseCatalogItemResource;
  }

  toEntityFromResource(resource: ExerciseCatalogItemResource): ExerciseCatalogItem {
    return new ExerciseCatalogItem({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      bodyPart: resource.bodyPart,
      movementType: resource.movementType,
      videoUrl: resource.videoUrl,
    });
  }

  toRequestFromCreateCommand(command: CreateExerciseCommand): SaveExerciseRequest {
    return {
      name: command.name,
      description: command.description,
      bodyPart: command.bodyPart,
      movementType: command.movementType,
      ...(command.videoAssetId !== undefined ? { videoAssetId: command.videoAssetId } : {}),
    } as SaveExerciseRequest;
  }

  toRequestFromUpdateCommand(command: UpdateExerciseCommand): SaveExerciseRequest {
    return {
      name: command.name,
      description: command.description,
      bodyPart: command.bodyPart,
      movementType: command.movementType,
      ...(command.videoAssetId !== undefined ? { videoAssetId: command.videoAssetId } : {}),
    } as SaveExerciseRequest;
  }
}
