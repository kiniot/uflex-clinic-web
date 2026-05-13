/** Severity of a clinical alert, used to color the card and choose CTAs. */
export type AlertSeverity = 'urgent' | 'warning';

/** Action affordance offered by an alert (e.g. "Urgent Call", "Send Message"). */
export interface AlertAction {
  label: string;
  variant: 'primary' | 'secondary';
}
