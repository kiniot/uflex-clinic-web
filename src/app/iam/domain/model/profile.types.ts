/** Role assigned to a user inside the IAM bounded context. */
export type UserRole = 'physio' | 'patient' | 'admin';

/** Account-level status used to gate access to the platform. */
export type AccountStatus = 'active' | 'pending' | 'suspended';

/** Identity-verification state derived from uploaded documents. */
export type VerificationStatus = 'verified' | 'awaiting-docs';
