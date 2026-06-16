import { CancelTherapySessionCommand } from '../domain/model/cancel-therapy-session.command';
import { ConfirmHardwareReadinessCommand } from '../domain/model/confirm-hardware-readiness.command';
import { InitiateTherapyPreparationCommand } from '../domain/model/initiate-therapy-preparation.command';
import {
  CancelTherapySessionRequest,
  ConfirmHardwareReadinessRequest,
  InitiateTherapyPreparationRequest,
} from './therapy-session.request';
import {
  DailyScheduleResource,
  DailyScheduleResponse,
  SerieDetailsResource,
  SerieDetailsResponse,
  SerieProgressResource,
  SerieProgressResponse,
  SessionProgressResource,
  SessionProgressResponse,
  SessionSummaryResource,
  SessionSummaryResponse,
  TherapySessionResource,
  TherapySessionResponse,
} from './therapy-session.response';

export class TherapySessionAssembler {
  toInitiatePreparationRequestFromCommand(
    command: InitiateTherapyPreparationCommand,
  ): InitiateTherapyPreparationRequest {
    return {
      patientId: command.patientId,
      treatmentPlanId: command.treatmentPlanId,
      iotDeviceId: command.iotDeviceId,
      routineId: command.routineId,
    };
  }

  toConfirmHardwareReadinessRequestFromCommand(
    command: ConfirmHardwareReadinessCommand,
  ): ConfirmHardwareReadinessRequest {
    return {
      deviceId: command.deviceId,
      sensorsPlaced: command.sensorsPlaced,
    };
  }

  toCancelTherapySessionRequestFromCommand(
    command: CancelTherapySessionCommand,
  ): CancelTherapySessionRequest {
    return {
      reason: command.reason,
    };
  }

  toTherapySessionResourceFromResponse(response: TherapySessionResponse): TherapySessionResource {
    return {
      id: response.id,
      patientId: response.patientId,
      treatmentPlanId: response.treatmentPlanId,
      iotDeviceId: response.iotDeviceId,
      status: response.status ?? null,
      painLevel: response.painLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      startedAt: response.startedAt ?? null,
      finalizedAt: response.finalizedAt ?? null,
    };
  }

  toSessionSummaryResourceFromResponse(response: SessionSummaryResponse): SessionSummaryResource {
    return {
      sessionId: response.sessionId,
      patientId: response.patientId,
      totalSeries: response.totalSeries ?? null,
      completedSeries: response.completedSeries ?? null,
      painLevel: response.painLevel ?? null,
      painReportsCount: response.painReportsCount ?? null,
      highPainReportsCount: response.highPainReportsCount ?? null,
      maxReportedPainLevel: response.maxReportedPainLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      anomaliesDetected: response.anomaliesDetected ?? null,
      startedAt: response.startedAt ?? null,
      finalizedAt: response.finalizedAt ?? null,
    };
  }

  toDailyScheduleResourceFromResponse(response: DailyScheduleResponse): DailyScheduleResource {
    return {
      patientId: response.patientId,
      date: response.date,
      routineId: response.routineId ?? null,
      totalSeries: response.totalSeries ?? 0,
      estimatedDurationMinutes: response.estimatedDurationMinutes ?? 0,
    };
  }

  toSerieDetailsResourceFromResponse(response: SerieDetailsResponse): SerieDetailsResource {
    return {
      serieId: response.serieId,
      exerciseId: response.exerciseId ?? null,
      targetRepetitions: response.targetRepetitions ?? null,
      minAngle: response.minAngle ?? null,
      maxAngle: response.maxAngle ?? null,
      durationSeconds: response.durationSeconds ?? null,
      restDurationSeconds: response.restDurationSeconds ?? null,
      status: response.status ?? null,
    };
  }

  toSerieProgressResourceFromResponse(response: SerieProgressResponse): SerieProgressResource {
    return {
      serieId: response.serieId,
      exerciseId: response.exerciseId ?? null,
      currentRepetitions: response.currentRepetitions ?? null,
      targetRepetitions: response.targetRepetitions ?? null,
      status: response.status ?? null,
    };
  }

  toSessionProgressResourceFromResponse(
    response: SessionProgressResponse,
  ): SessionProgressResource {
    return {
      sessionId: response.sessionId,
      status: response.status ?? null,
      currentSerieId: response.currentSerieId ?? null,
      painLevel: response.painLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      seriesProgress: (response.seriesProgress ?? []).map((serieProgress) =>
        this.toSerieProgressResourceFromResponse(serieProgress),
      ),
    };
  }
}
