import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ExerciseBodyPart, ExerciseMovementType } from './exercise-catalog-item.types';

interface ExerciseCatalogItemProps {
  id: string;
  name: string;
  description: string;
  bodyPart: ExerciseBodyPart | string;
  movementType: ExerciseMovementType | string;
  videoUrl: string | null;
}

export class ExerciseCatalogItem implements BaseEntity {
  private _id: string;
  private _name: string;
  private _description: string;
  private _bodyPart: string;
  private _movementType: string;
  private _videoUrl: string | null;

  constructor(props: ExerciseCatalogItemProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._bodyPart = props.bodyPart;
    this._movementType = props.movementType;
    this._videoUrl = props.videoUrl;
  }

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get bodyPart(): string {
    return this._bodyPart;
  }
  set bodyPart(value: string) {
    this._bodyPart = value;
  }

  get movementType(): string {
    return this._movementType;
  }
  set movementType(value: string) {
    this._movementType = value;
  }

  get videoUrl(): string | null {
    return this._videoUrl;
  }
  set videoUrl(value: string | null) {
    this._videoUrl = value;
  }
}
