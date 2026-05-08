/**
 * Filter tag a library protocol can be tagged with — drives the
 * left-column chips in the Therapy Roadmap library.
 */
export type ProtocolTag = 'knee' | 'strength' | 'mobility';

/**
 * Compact, prescription-ready exercise card used by the Therapy
 * Roadmap's Exercise Library. Intentionally narrower than the catalog
 * Exercise entity — it is a read projection focused on what a
 * physiotherapist sees while building a daily routine.
 */
export interface LibraryProtocol {
  id: number;
  name: string;
  focus: string;
  tags: ProtocolTag[];
}
