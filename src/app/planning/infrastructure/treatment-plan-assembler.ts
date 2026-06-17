import { AddRoutineCommand } from '../domain/model/add-routine.command';
import { CreateTreatmentPlanCommand } from '../domain/model/create-treatment-plan.command';
import { TreatmentPlanRoutine } from '../domain/model/treatment-plan-routine.entity';
import { TreatmentPlan } from '../domain/model/treatment-plan.entity';
import { UpdateRoutineCommand } from '../domain/model/update-routine.command';
import { UpdateTreatmentPlanCommand } from '../domain/model/update-treatment-plan.command';
import { AddRoutineRequest } from './add-routine.request';
import { CreateTreatmentPlanRequest } from './create-treatment-plan.request';
import { TreatmentPlanResource, TreatmentPlanResponse } from './treatment-plan.response';
import { UpdateRoutineRequest } from './update-routine.request';
import { UpdateTreatmentPlanRequest } from './update-treatment-plan.request';

export class TreatmentPlanAssembler {
  toResourceFromResponse(response: TreatmentPlanResponse): TreatmentPlanResource {
    return {
      id: response.id,
      patientId: response.patientId,
      name: response.name,
      status: response.status,
      period: {
        startsAt: response.period.startsAt,
        endsAt: response.period.endsAt,
      },
      routines: response.routines.map((routine) => ({
        id: routine.id ?? null,
        name: routine.name,
        order: routine.order,
        schedule: {
          dayOfWeek: routine.schedule.dayOfWeek,
          scheduledTime: routine.schedule.scheduledTime,
        },
        exerciseSeries: routine.exerciseSeries.map((series) => ({ ...series })),
      })),
    } as TreatmentPlanResource;
  }

  toEntityFromResource(resource: TreatmentPlanResource): TreatmentPlan {
    return new TreatmentPlan({
      id: resource.id,
      patientId: resource.patientId,
      name: resource.name,
      status: resource.status,
      period: resource.period,
      routines: resource.routines.map(
        (routine) =>
          new TreatmentPlanRoutine({
            id: routine.id ?? '',
            name: routine.name,
            order: routine.order,
            schedule: routine.schedule,
            exerciseSeries: routine.exerciseSeries,
          }),
      ),
    });
  }

  toRequestFromCreateCommand(command: CreateTreatmentPlanCommand): CreateTreatmentPlanRequest {
    return {
      name: command.name,
      period: command.period,
      routines: command.routines.map((routine) => ({
        name: routine.name,
        order: routine.order,
        schedule: routine.schedule,
        exerciseSeries: routine.exerciseSeries,
      })),
    } as CreateTreatmentPlanRequest;
  }

  toRequestFromUpdateCommand(command: UpdateTreatmentPlanCommand): UpdateTreatmentPlanRequest {
    return {
      name: command.name,
      period: command.period,
    } as UpdateTreatmentPlanRequest;
  }

  toRequestFromAddRoutineCommand(command: AddRoutineCommand): AddRoutineRequest {
    return {
      name: command.name,
      order: command.order,
      schedule: command.schedule,
      exerciseSeries: command.exerciseSeries,
    } as AddRoutineRequest;
  }

  toRequestFromUpdateRoutineCommand(command: UpdateRoutineCommand): UpdateRoutineRequest {
    return {
      name: command.name,
      newOrder: command.newOrder,
      schedule: command.schedule,
      exerciseSeries: command.exerciseSeries,
    } as UpdateRoutineRequest;
  }
}
