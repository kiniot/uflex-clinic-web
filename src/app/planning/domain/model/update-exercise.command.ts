interface UpdateExerciseCommandProps {
  name: string;
  description: string;
  bodyPart: 'ELBOW' | 'WRIST';
  movementType: 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION';
  videoUrl: string | null;
}

export class UpdateExerciseCommand {
  private _name: string;
  private _description: string;
  private _bodyPart: 'ELBOW' | 'WRIST';
  private _movementType: 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION';
  private _videoUrl: string | null;

  constructor(props: UpdateExerciseCommandProps) {
    this._name = props.name;
    this._description = props.description;
    this._bodyPart = props.bodyPart;
    this._movementType = props.movementType;
    this._videoUrl = props.videoUrl;
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

  get bodyPart(): 'ELBOW' | 'WRIST' {
    return this._bodyPart;
  }
  set bodyPart(value: 'ELBOW' | 'WRIST') {
    this._bodyPart = value;
  }

  get movementType(): 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION' {
    return this._movementType;
  }
  set movementType(value: 'PRONATION' | 'SUPINATION' | 'FLEXION' | 'EXTENSION') {
    this._movementType = value;
  }

  get videoUrl(): string | null {
    return this._videoUrl;
  }
  set videoUrl(value: string | null) {
    this._videoUrl = value;
  }
}
