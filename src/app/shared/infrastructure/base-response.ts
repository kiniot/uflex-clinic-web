/**
 * Abstract interface for API response structures.
 */
export interface BaseResponse {}

/**
 * Defines a standard structure for API resources/DTOs with a unique identifier.
 * Supports both numeric (legacy) and string (UUID) IDs for compatibility with
 * the backend, which uses UUID v7.
 */
export interface BaseResource {
  /**
   * The unique identifier for the resource.
   */
  id: string | number;
}
