# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Angular 21 + TypeScript (strict, `strictTemplates`), PrimeNG 21 with a custom Aura preset, `@ngx-translate` for i18n, SCSS, Vitest for unit tests. Package manager is **pnpm only** — `preinstall` runs `npx only-allow pnpm`. Requires Node >=24 and pnpm >=10.16.

## Common commands

- `pnpm start` (or `ng serve`) — dev server at `http://localhost:4200`, uses `environment.development.ts` via fileReplacements.
- `pnpm build` — production build, fails over 1MB initial bundle / 8KB per component-style.
- `pnpm test` — Vitest (configured via `@angular/build:unit-test`, no separate `vitest.config`).
- `pnpm watch` — dev-config build in watch mode.
- `npx prettier --write <path>` — formatting (`printWidth: 100`, single quotes; HTML uses the `angular` parser).
- No lint script is configured.

## Architecture

The app follows a **DDD-style layered architecture organized by bounded context**. Each top-level folder under `src/app/` (other than `app.*` root files) is a bounded context. Today there are two: `shared` (cross-cutting building blocks) and `iam` (Identity and Access Management). New domains should be added as sibling folders following the same layout.

Within every bounded context, code is split into four layers:

```
src/app/<context>/
  domain/model/        — entities (implement BaseEntity) and commands (plain classes, private fields + getters/setters)
  application/         — stores: @Injectable({providedIn: 'root'}) signal-based state holders (e.g. IamStore)
  infrastructure/      — HTTP clients, endpoints, assemblers, request/response DTOs, guards, interceptors
  presentation/        — components, views, and the per-context *.routes.ts
```

### The Resource → Response → Entity → Command pipeline

The infrastructure layer uses a strict assembler pattern that the IAM context demonstrates end-to-end:

1. **Command** (domain) — what the UI asks for, e.g. `SignInCommand({username, password})`.
2. **Request** (infra) — DTO sent over the wire; assembler converts Command → Request.
3. **Endpoint** (infra) — one class per operation (e.g. `SignInApiEndpoint`), extends `ErrorHandlingEnabledBaseType`, owns its URL (built from `environment.platformProviderApiBaseUrl + path`), calls `http.post<Response>(...)` and pipes through the assembler's `toResourceFromResponse`.
4. **Response / Resource** (infra) — `Response extends BaseResponse, Resource`; `Resource extends BaseResource` (has `id: number`).
5. **Api** (infra) — composes endpoints. Each context has a single `<Context>Api extends BaseApi` (e.g. `IamApi`) instantiated via `providedIn: 'root'` that wires endpoints and exposes a thin per-operation method.
6. **Store** (application) — subscribes to the API's Observable, holds state in `signal<T>()` with `asReadonly()` exposure plus `computed()` derivations, and triggers `Router` navigation in the `next`/`error` callbacks.

Generic CRUD lives in `shared/infrastructure/base-api-endpoint.ts` (`getAll/getById/create/update/delete`) and uses the `BaseAssembler<TEntity, TResource, TResponse>` interface — but IAM endpoints don't extend it because their inputs are Commands, not Entities. Use `BaseApiEndpoint` for entity CRUD; subclass `ErrorHandlingEnabledBaseType` directly for action-style endpoints (sign-in, sign-up, etc.).

### Cross-cutting wiring

- **`app.config.ts`** is the only place providers live. It registers HTTP with `withInterceptors([iamInterceptor])`, the translate service (loader at `./i18n/<lang>.json`, fallback `en`), router with `routes`, and PrimeNG with `appPreset` — `darkModeSelector` is the CSS class `.app-dark` toggled by `ThemeSwitcher` on `<html>`.
- **`iamInterceptor`** reads `IamStore.currentToken()` (a `computed` over `localStorage.getItem('token')` gated by `isSignedIn`) and attaches `Authorization: Bearer …` to every outgoing request.
- **`iamGuard`** is a `CanActivateFn` that redirects unauthenticated users to `/iam/sign-in`. Apply it via `canActivate: [iamGuard]` on protected routes.
- **Routing** is two-tier: `app.routes.ts` lazy-loads context route modules via `loadChildren`, and each context exposes `<context>.routes.ts` (e.g. `iamRoutes`) with `loadComponent` for views.
- **Theming**: `app.preset.ts` defines a custom Aura preset with `petroleum`/`turquoise`/`sand`/`dark` palettes and explicit light + dark `colorScheme` overrides. Don't hardcode colors in components — reference preset tokens through PrimeNG.
- **i18n**: translation keys live in `public/i18n/{en,es}.json`; `App` initializes available languages and `LanguageSwitcher` calls `translate.use(lang)` at runtime.

### Conventions

- Components use **standalone** style (no NgModules); `imports: []` on the decorator. Use `inject()` for DI inside class bodies.
- Selectors are prefixed `app-` (configured in `angular.json`).
- Default style is **SCSS** (`inlineStyleLanguage: 'scss'`, schematics generate `.scss`). Component files are colocated and named `<name>.{ts,html,scss}` without the `.component` suffix.
- Reactive state in the application layer should be **signals**, not `BehaviorSubject`. Expose readonly via `signal.asReadonly()` or `computed()`.
- Forms currently use **Reactive Forms** (`ReactiveFormsModule`) and extend `BaseForm` from `shared/presentation/components/base-form/` for `isInvalidControl`/`errorMessagesForControl` helpers.
- Domain entities and commands use **private underscore-prefixed fields with getters/setters** rather than public properties (see `User`, `SignInCommand`).
- The `angular-developer` skill in `skills/` is auto-loaded for Angular guidance — defer to it for framework-specific best-practice questions (signals, signal forms, DI, routing).
