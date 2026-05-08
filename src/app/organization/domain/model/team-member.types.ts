/**
 * Domain types for clinic staff members in the Organization bounded
 * context.
 */

export type TeamMemberStatus = 'active' | 'on-leave' | 'inactive';

export type SpecializedRole =
  | 'neuro-rehab'
  | 'post-op-recovery'
  | 'geriatric-mobility'
  | 'iot-mobility'
  | 'sports-rehab';
