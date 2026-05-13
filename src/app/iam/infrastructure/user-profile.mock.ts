import {UserProfile} from '../domain/model/user-profile.entity';

/**
 * Mock user directory backing the Profile management view. Will be
 * replaced once the IAM backend exposes a paginated /users endpoint.
 */
export const MOCK_USER_PROFILES: UserProfile[] = [
  new UserProfile({
    id: 1,
    fullName: 'Dr. Sarah Jenkins',
    email: 's.jenkins@uflex.clinic',
    avatarInitials: 'SJ',
    role: 'physio',
    status: 'active',
    verification: 'verified',
    lastLoginLabel: 'Today, 09:41 AM'
  }),
  new UserProfile({
    id: 2,
    fullName: 'Robert Thorne',
    email: 'r.thorne88@email.com',
    avatarInitials: 'RT',
    role: 'patient',
    status: 'pending',
    verification: 'awaiting-docs',
    lastLoginLabel: 'Never'
  }),
  new UserProfile({
    id: 3,
    fullName: 'Marcus Aurelius',
    email: 'm.aurelius@uflex.admin',
    avatarInitials: 'MA',
    role: 'admin',
    status: 'suspended',
    verification: 'verified',
    lastLoginLabel: 'Oct 12, 2023'
  })
];

export const MOCK_TOTAL_ACTIVE_USERS = 1248;
