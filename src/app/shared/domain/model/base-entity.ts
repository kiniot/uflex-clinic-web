/**
 * Defines a standard structure for entities with a unique identifier.
 * Supports both numeric (legacy) and string (UUID) IDs.
 */
export interface BaseEntity {
  /**
   * The unique identifier for the entity.
   */
  id: string | number;
}
