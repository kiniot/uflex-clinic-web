import { ExerciseCatalogItemAssembler } from './exercise-catalog-item-assembler';

describe('ExerciseCatalogItemAssembler', () => {
  it('maps exercise catalog responses preserving id, body part and movement type', () => {
    const assembler = new ExerciseCatalogItemAssembler();

    const resource = assembler.toResourceFromResponse({
      id: 'exercise-1',
      name: 'Wrist supination',
      description: 'Controlled wrist supination exercise focused on forearm rotation.',
      bodyPart: 'WRIST',
      movementType: 'SUPINATION',
      videoUrl: 'https://cdn.uflex.app/exercises/wrist-supination.mp4',
    });

    expect(resource.id).toBe('exercise-1');
    expect(resource.bodyPart).toBe('WRIST');
    expect(resource.movementType).toBe('SUPINATION');
    expect(resource.videoUrl).toContain('wrist-supination');
  });

  it('maps update commands omitting videoAssetId when the media should be preserved', () => {
    const assembler = new ExerciseCatalogItemAssembler();

    const request = assembler.toRequestFromUpdateCommand({
      name: 'Wrist supination',
      description: 'Controlled wrist supination exercise focused on forearm rotation.',
      bodyPart: 'WRIST',
      movementType: 'SUPINATION',
      videoAssetId: undefined,
    } as any);

    expect('videoAssetId' in request).toBe(false);
  });
});
