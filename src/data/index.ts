/**
 * Honey Chain Data Layer
 *
 * Prepared for mock datasets and future API client integrations.
 * Business logic and data querying will be decoupled through service interfaces.
 */

export interface DataService<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(item: Partial<T>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
}

export * from "./mock-auth";
export * from "./mock-traceability";
export * from "./mock-quality";
export * from "./mock-bottles";
export * from "./mock-marketplace";
export * from "./mock-admin";
