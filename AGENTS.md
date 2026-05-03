# AGENTS.md

Angular 21 + PrimeNG 21 SPA. See `CLAUDE.md` for the long-form architecture write-up; this file is the quick-reference for coding agents.

## Workflow

- **pnpm only** — `preinstall` runs `npx only-allow pnpm`. Node >=24, pnpm >=10.16.
- `pnpm start` (dev server, uses `src/environments/environment.development.ts` via fileReplacements) · `pnpm build` · `pnpm test` (Vitest, no separate config — driven by `@angular/build:unit-test`) · `pnpm watch`.
- No lint script. Format with `npx prettier --write <path>` (printWidth 100, single quotes, HTML uses `angular` parser).
- TS is **strict** with `strictTemplates`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`. Check templates compile, not just `.ts`.

## Architecture: DDD by bounded context

Each top-level folder under `src/app/` is a bounded context with four layers. Today: `shared` (cross-cutting building blocks) and `iam`. New domains follow the same shape:

```
src/app/<context>/
  domain/model/      entities (implement BaseEntity) and commands — private _fields with getters/setters (see User, SignInCommand)
  application/       @Injectable({providedIn:'root'}) signal stores (see IamStore — signal<T>(), .asReadonly(), computed())
  infrastructure/    one *-endpoint.ts per operation, *-assembler.ts, *.request.ts, *-response.ts, plus <Context>Api extends BaseApi
  presentation/      standalone components and <context>.routes.ts (lazy loadComponent)
```

## The data pipeline (see `iam/` for the canonical example)

`Command (domain) → Assembler.toRequestFromCommand → Endpoint.http.post<Response> → Assembler.toResourceFromResponse → Store.subscribe → signal.set + Router.navigate`

- Entity CRUD endpoints extend `shared/infrastructure/base-api-endpoint.ts` (`BaseApiEndpoint<TEntity, TResource, TResponse, TAssembler>` with generic `getAll/getById/create/update/delete`).
- Action endpoints (sign-in, sign-up) extend `ErrorHandlingEnabledBaseType` directly — they take Commands, not Entities. `IamApi` composes them; the store calls `iamApi.signIn(...).subscribe({next, error})`.
- URLs are built from `environment.platformProviderApiBaseUrl + environment.platformProvider<Op>EndpointPath`. Add new endpoint paths to **both** `environment.ts` and `environment.development.ts`.

## Cross-cutting wiring (all in `src/app/app.config.ts`)

- HTTP: `provideHttpClient(withFetch(), withInterceptors([iamInterceptor]))` — the interceptor reads `IamStore.currentToken()` (computed over `localStorage`) and adds `Authorization: Bearer ...`.
- Routing: two-tier — `app.routes.ts` lazy-loads via `loadChildren: () => import('...iam.routes').then(m => m.iamRoutes)`. Protect routes with `canActivate: [iamGuard]`.
- i18n: `@ngx-translate` loads `public/i18n/{en,es}.json`. Use `TranslatePipe` in templates and add new keys to both files.
- Theming: `providePrimeNG({ theme: { preset: appPreset, options: { darkModeSelector: '.app-dark' }}})`. Custom Aura preset in `app.preset.ts` (palettes: petroleum/turquoise/sand/dark with explicit light+dark `colorScheme`). **Don't hardcode colors** — reference preset tokens. `ThemeSwitcher` toggles `.app-dark` on `<html>`.

## Conventions to match

- **Standalone** components only, no NgModules. `imports: []` on the decorator. Use `inject()` inside class bodies, not constructor params (except in legacy IAM endpoints).
- File naming: `<name>.{ts,html,scss}` — **no `.component` suffix**. Selectors prefixed `app-`. Default style is **SCSS**.
- State: prefer `signal()` + `asReadonly()` + `computed()` over RxJS Subjects in the application layer.
- Forms: Reactive Forms; extend `shared/presentation/components/base-form/base-form.ts` for `isInvalidControl` / `errorMessagesForControl` helpers.
- The `skills/angular-developer/` SKILL.md is auto-loaded — defer to it for framework idiom questions (signal forms, DI, routing).
