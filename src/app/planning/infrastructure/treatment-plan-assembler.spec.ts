import { TreatmentPlanAssembler } from './treatment-plan-assembler';

describe('TreatmentPlanAssembler', () => {
  it('maps treatment plan responses including routines and exercise series', () => {
    const assembler = new TreatmentPlanAssembler();

    const resource = assembler.toResourceFromResponse({
      id: 'plan-id',
      patientId: 'patient-id',
      name: 'Forearm mobility plan',
      status: 'ACTIVE',
      period: {
        startsAt: '2026-06-01',
        endsAt: '2026-06-21',
      },
      routines: [
        {
          id: 'routine-id',
          name: 'Morning mobility',
          order: 1,
          schedule: {
            dayOfWeek: 'MONDAY',
            scheduledTime: '08:00:00',
          },
          exerciseSeries: [
            {
              order: 1,
              exerciseId: 'exercise-id',
              rangeOfMotionDegrees: 60,
              repetitions: 12,
              durationSeconds: 45,
              restDurationSeconds: 20,
            },
          ],
        },
      ],
    });

    expect(resource.id).toBe('plan-id');
    expect(resource.routines).toHaveLength(1);
    expect(resource.routines[0].exerciseSeries[0].exerciseId).toBe('exercise-id');
  });
});
