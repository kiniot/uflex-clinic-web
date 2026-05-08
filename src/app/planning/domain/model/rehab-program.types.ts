/** Identifier of one of the four standard rehab phases. */
export type RehabPhaseId = 'protection' | 'strength' | 'impact' | 'rtp';

/** Status of a phase relative to where the patient currently is. */
export type PhaseStatus = 'completed' | 'active' | 'upcoming';

/** One step in the recovery-phase indicator (Protection → RTP). */
export interface RecoveryPhaseStep {
  id: RehabPhaseId;
  label: string;
  status: PhaseStatus;
}

/**
 * One parameter on a routine-builder row. Counter parameters render as
 * "- value +" controls; static parameters are read-only badges.
 */
export type RoutineParameter =
  | { type: 'counter'; key: string; label: string; value: number; unit?: string }
  | { type: 'static'; key: string; label: string; value: string };
