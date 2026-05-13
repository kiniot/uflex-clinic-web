# Uflex Clinic Web

<div align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular" alt="Angular 21" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/pnpm-%3E%3D10.16-F69220?style=for-the-badge&logo=pnpm" alt="pnpm" />
  <img src="https://img.shields.io/badge/Node-%3E%3D24-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <br />
  <img src="https://img.shields.io/badge/Architecture-DDD-blue?style=flat-square" alt="DDD Architecture" />
  <img src="https://img.shields.io/badge/State-Signals-green?style=flat-square" alt="Signals" />
  <img src="https://img.shields.io/badge/UI-PrimeNG_21-BC204B?style=flat-square" alt="PrimeNG" />
  <img src="https://img.shields.io/badge/Test-Vitest-6E9F18?style=flat-square" alt="Vitest" />
</div>

---

UflexClinicWeb is a modern health-tech web application built with Angular 21, designed to provide comprehensive digital rehabilitation solutions. The project adheres to strict Domain-Driven Design (DDD) principles and high-performance development standards.

## Technical Stack

- **Framework**: Angular 21 with standalone components.
- **Language**: TypeScript (strict mode enabled).
- **UI Library**: PrimeNG 21 with a custom Aura preset.
- **State Management**: Signal-based reactive state.
- **Testing**: Vitest for unit testing.
- **Package Manager**: pnpm (requires Node >=24 and pnpm >=10.16).

## Development Workflow

This project strictly uses `pnpm` for dependency management.

### Installation

To install dependencies, run:
`pnpm install`

### Development Server

To start a local development server, run:
`pnpm start`

The application is served at `http://localhost:4200/`. It uses `environment.development.ts` via file replacements for local configuration.

### Building for Production

To build the project for production, run:
`pnpm build`

The production build enforces strict bundle size limits (1MB for the initial bundle and 8KB per component style).

### Testing

To execute unit tests using the Vitest test runner, run:
`pnpm test`

## Architecture and Conventions

The repository follows a **DDD-style layered architecture organized by bounded context**. Each domain lives within `src/app/<context>/` and is split into four distinct layers:

1. **Domain**: Contains entities (implementing `BaseEntity`) and commands using private underscored fields with getters and setters.
2. **Application**: Contains signal-based state holders (Stores) instantiated via `@Injectable({providedIn: 'root'})`.
3. **Infrastructure**: Handles external concerns including HTTP endpoints, assemblers, DTOs, and guards.
4. **Presentation**: Contains standalone components, views, and context-specific routing.

### Data Pipeline

The application implements a strict assembler pattern for data flow:
`Command (domain) -> Request DTO (infra) -> Endpoint (infra) -> Response/Resource (infra) -> Store (application)`

### Key Conventions

- **Component Style**: Standalone components only. Use `inject()` for dependency injection instead of constructor parameters.
- **Naming**: Component files are named `<name>.{ts,html,scss}` without the `.component` suffix.
- **Selectors**: All component selectors are prefixed with `app-`.
- **Styling**: SCSS is the default style language. Do not hardcode colors; reference PrimeNG Aura preset tokens defined in `app.preset.ts`.
- **Formatting**: Code formatting is handled via Prettier. To format files, run:
  `npx prettier --write <path>`

## Additional Documentation

For detailed AI assistance and deeper architectural insights, refer to the following local documentation:
- **CLAUDE.md**: Comprehensive long-form architecture and command reference.
- **AGENTS.md**: Quick-reference guide for coding agents and development guardrails.
