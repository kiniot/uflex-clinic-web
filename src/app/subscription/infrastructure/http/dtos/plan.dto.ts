export interface PlanDto {
  id: string;
  name: string;
  code: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  maxPatients: number;
  maxPhysiotherapists: number;
  features: Array<string>;
  active: boolean;
}
