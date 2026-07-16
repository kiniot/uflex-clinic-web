import {
  DailyScheduleResource,
  DailyScheduleResponse,
  SerieExecutionResource,
  SerieExecutionResponse,
  SerieProgressResource,
  SerieProgressResponse,
  SessionProgressResource,
  SessionProgressResponse,
  SessionSummaryResource,
  SessionSummaryResponse,
  TherapySessionDetailResource,
  TherapySessionDetailResponse,
  TherapySessionHistoryItemResource,
  TherapySessionHistoryItemResponse,
  TherapySessionResource,
  TherapySessionResponse,
} from './therapy-session.response';

export class TherapySessionAssembler {
  toTherapySessionResourceFromResponse(response: TherapySessionResponse): TherapySessionResource {
    return {
      id: response.id,
      patientId: response.patientId,
      treatmentPlanId: response.treatmentPlanId,
      iotDeviceId: response.iotDeviceId,
      sensorsPlaced: response.sensorsPlaced ?? null,
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
      totalRepetitions: response.totalRepetitions ?? null,
      goodRepetitions: response.goodRepetitions ?? null,
      incompleteRepetitions: response.incompleteRepetitions ?? null,
      unsafeRepetitions: response.unsafeRepetitions ?? null,
      averageAchievedRom: response.averageAchievedRom ?? null,
      painLevel: response.painLevel ?? null,
      painReportsCount: response.painReportsCount ?? null,
      highPainReportsCount: response.highPainReportsCount ?? null,
      maxReportedPainLevel: response.maxReportedPainLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      compensatoryMovementsDetected: response.compensatoryMovementsDetected ?? null,
      startedAt: response.startedAt ?? null,
      finalizedAt: response.finalizedAt ?? null,
    };
  }

  toTherapySessionHistoryItemResourceFromResponse(
    response: TherapySessionHistoryItemResponse,
  ): TherapySessionHistoryItemResource {
    return {
      sessionId: response.sessionId,
      status: response.status ?? null,
      startedAt: response.startedAt ?? null,
      finalizedAt: response.finalizedAt ?? null,
      treatmentPlanId: response.treatmentPlanId ?? null,
      planningRoutineId: response.planningRoutineId ?? null,
      totalSeries: response.totalSeries ?? null,
      completedSeries: response.completedSeries ?? null,
      totalRepetitions: response.totalRepetitions ?? null,
      goodRepetitions: response.goodRepetitions ?? null,
      incompleteRepetitions: response.incompleteRepetitions ?? null,
      unsafeRepetitions: response.unsafeRepetitions ?? null,
      averageAchievedRom: response.averageAchievedRom ?? null,
      painLevel: response.painLevel ?? null,
      maxReportedPainLevel: response.maxReportedPainLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      compensatoryMovementsDetected: response.compensatoryMovementsDetected ?? null,
    };
  }

  toTherapySessionDetailResourceFromResponse(
    response: TherapySessionDetailResponse,
  ): TherapySessionDetailResource {
    return {
      sessionId: response.sessionId,
      patientId: response.patientId,
      treatmentPlanId: response.treatmentPlanId ?? null,
      planningRoutineId: response.planningRoutineId ?? null,
      iotDeviceId: response.iotDeviceId ?? null,
      status: response.status ?? null,
      sensorsPlaced: response.sensorsPlaced ?? null,
      startedAt: response.startedAt ?? null,
      finalizedAt: response.finalizedAt ?? null,
      cancellationReason: response.cancellationReason ?? null,
      totalSeries: response.totalSeries ?? null,
      completedSeries: response.completedSeries ?? null,
      totalRepetitions: response.totalRepetitions ?? null,
      goodRepetitions: response.goodRepetitions ?? null,
      incompleteRepetitions: response.incompleteRepetitions ?? null,
      unsafeRepetitions: response.unsafeRepetitions ?? null,
      averageAchievedRom: response.averageAchievedRom ?? null,
      painLevel: response.painLevel ?? null,
      painReportsCount: response.painReportsCount ?? null,
      highPainReportsCount: response.highPainReportsCount ?? null,
      maxReportedPainLevel: response.maxReportedPainLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      compensatoryMovementsDetected: response.compensatoryMovementsDetected ?? null,
      series: (response.series ?? []).map((serie) => this.toSerieExecutionResource(serie)),
      compensatoryMovements: (response.compensatoryMovements ?? []).map((movement) => ({
        movementId: movement.movementId,
        type: movement.type ?? null,
        detectedAt: movement.detectedAt ?? null,
      })),
    };
  }

  private toSerieExecutionResource(response: SerieExecutionResponse): SerieExecutionResource {
    return {
      serieId: response.serieId,
      exerciseId: response.exerciseId ?? null,
      targetRepetitions: response.targetRepetitions ?? null,
      targetRom: response.targetRom ?? null,
      movementType: response.movementType ?? null,
      bodyPart: response.bodyPart ?? null,
      durationSeconds: response.durationSeconds ?? null,
      restDurationSeconds: response.restDurationSeconds ?? null,
      status: response.status ?? null,
      repetitions: (response.repetitions ?? []).map((repetition) => ({
        repetitionId: repetition.repetitionId,
        peakAngle: repetition.peakAngle ?? null,
        achievedRom: repetition.achievedRom ?? null,
        classification: repetition.classification ?? null,
        recordedAt: repetition.recordedAt ?? null,
      })),
    };
  }

  toDailyScheduleResourceFromResponse(response: DailyScheduleResponse): DailyScheduleResource {
    return {
      patientId: response.patientId,
      date: response.date,
      resolutionStatus: response.resolutionStatus ?? null,
      routineId: response.routineId ?? null,
      totalSeries: response.totalSeries ?? 0,
      estimatedDurationMinutes: response.estimatedDurationMinutes ?? 0,
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
      completedSeries: response.completedSeries ?? null,
      totalSeries: response.totalSeries ?? null,
      painLevel: response.painLevel ?? null,
      requiresClinicalReview: response.requiresClinicalReview ?? null,
      seriesProgress: (response.seriesProgress ?? []).map((serieProgress) =>
        this.toSerieProgressResourceFromResponse(serieProgress),
      ),
    };
  }
}
