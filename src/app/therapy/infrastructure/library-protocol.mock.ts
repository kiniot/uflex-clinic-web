import {LibraryProtocol} from '../domain/model/library-protocol';

/**
 * Mock library protocols rendered in the Therapy Roadmap left column.
 * Will be replaced by GET /library/protocols when the backend lands.
 */
export const MOCK_LIBRARY_PROTOCOLS: LibraryProtocol[] = [
  {
    id: 301,
    name: 'Weighted Leg Extensions',
    focus: 'Quadriceps Focus • Hypertrophy',
    tags: ['knee', 'strength']
  },
  {
    id: 302,
    name: 'Isometric Quadriceps',
    focus: 'Early Phase • Activation',
    tags: ['knee', 'strength']
  },
  {
    id: 303,
    name: 'Glute Bridges',
    focus: 'Posterior Chain • Core',
    tags: ['strength']
  },
  {
    id: 304,
    name: 'Terminal Knee Extension',
    focus: 'Range of Motion • End Range',
    tags: ['knee', 'mobility']
  }
];
