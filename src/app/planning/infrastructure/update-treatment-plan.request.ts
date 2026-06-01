import { TreatmentPlanPeriod } from '../domain/model/treatment-plan.types';

export interface UpdateTreatmentPlanRequest {
  name: string;
  period: TreatmentPlanPeriod;
}
