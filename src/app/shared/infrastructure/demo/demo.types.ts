export type { PatientResponse as DemoPatient } from '../../../organization/infrastructure/patient.response';
export type { PhysiotherapistProfileResponse as DemoPhysiotherapist } from '../../../organization/infrastructure/physiotherapist-profile-response';
export type { ClinicProfileResponse as DemoClinic } from '../../../organization/infrastructure/clinic-profile-response';
export type { ExerciseCatalogItemResponse as DemoExercise } from '../../../planning/infrastructure/exercise-catalog-item.response';
export type { TreatmentPlanResponse as DemoTreatmentPlan } from '../../../planning/infrastructure/treatment-plan.response';
export type {
  DeviceResponse as DemoDevice,
  ClinicFleetMetricsResponse as DemoFleetMetrics,
} from '../../../device/infrastructure/device.response';
export type {
  PatientTherapyOverviewResponse as DemoTherapyOverview,
  TherapySessionHistoryItemResponse as DemoSessionHistoryItem,
  TherapySessionResponse as DemoTherapySession,
  SessionSummaryResponse as DemoSessionSummary,
  DailyScheduleResponse as DemoDailySchedule,
  // Resource (not Response) variants: their array fields are non-nullable, which is far more
  // convenient for the mutable in-memory state in demo-database.ts; both shapes are otherwise
  // identical and equally valid as the JSON body of a mocked HTTP response.
  SessionProgressResource as DemoSessionProgress,
  SerieProgressResource as DemoSerieProgress,
  TherapySessionDetailResource as DemoTherapySessionDetail,
} from '../../../therapy/infrastructure/therapy-session.response';
