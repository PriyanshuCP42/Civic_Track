# CivicTrack System Design Blueprint

## Goals

- Preserve 100% identical user-facing behavior, routes, text, and UI.
- Enforce strict architectural layering across frontend and backend.
- Centralize configuration and remove hardcoded operational values.
- Keep implementation boring, explicit, and easy to extend safely.

## Architectural Layers

### Frontend (`src/`)

- `src/api/`: all HTTP and transport concerns; no UI usage of `fetch`/`axios`.
- `src/components/`: presentational UI and interaction wiring only.
- `src/context/`: global state distribution only.
- `src/data/`: static values, constants, defaults, and config literals.
- `src/lib/`: domain abstractions and class-based models.
- `src/pages/`: page composition only (hooks + components).
- `src/routes/`: route definitions and lazy-loading only.
- `src/utils/`: pure transformation/validation/formatting helpers.

Dependency direction:

- `pages -> hooks/context -> api -> transport`
- `pages -> components`
- `components -> utils/data/lib` (read-only helpers only)
- `routes -> pages/components/layout`

Forbidden:

- API calls outside `src/api/`
- business logic in JSX render blocks
- side effects inside `src/utils/`

### Backend (`server/`)

- `server/config/`: env loading, constants, app configuration.
- `server/middleware/`: request pipeline concerns (auth, errors, async wrappers).
- `server/models/`: database schemas and data validation.
- `server/routes/`: route registration and endpoint wiring only.
- `server/utils/`: pure helpers and reusable non-route primitives.

Dependency direction:

- `routes -> middleware + models + utils + config`
- `middleware -> config + utils`
- `models` are leaf nodes for persistence contracts

Forbidden:

- route-level hardcoded credentials/origins/status lists
- business logic in `server/index.js`
- environment literals outside `server/config/`

## Domain Contract

Primary entities:

- `Complaint`
- `User` (Clerk-backed identity + role metadata)
- `Employee` (role-specialized user view)

Domain invariants:

- complaint lifecycle status transitions remain identical to current behavior
- route paths and API payload shapes remain unchanged
- auth gate behavior remains unchanged (role checks + admin credential checks)

## Code Construction Rules

1. **Domain Models as ES6 Classes**
   - domain models under `src/lib/` must be ES6 classes
   - each model must expose static factory methods (for example, `Complaint.fromApiResponse()`)
   - components and pages must not manipulate raw API objects directly

2. **Polymorphism Over Condition Chains**
   - behavior that varies by role, status, or type must use strategy/map-based dispatch
   - scattered `if/else` or `switch` chains for these variations are not allowed
   - applies to status badge styling, role-based visibility, and complaint action button logic

3. **Mandatory Custom Hooks for Stateful Features**
   - any stateful feature must be implemented through a custom hook
   - components may consume hooks but must not call API modules directly
   - call flow remains `component/page -> hook -> src/api/*`

4. **JSDoc on Every Export**
   - every exported function, hook, class, and component requires JSDoc
   - JSDoc must describe purpose, parameters, and return shape where applicable

5. **No Magic Strings**
   - every status value, role name, route path, and socket event name must come from named constants
   - frontend constants must live in `src/data/`
   - backend constants must live in `server/config/`

## Request and Error Flow

### API Request Flow

1. route match in `server/routes/*`
2. auth middleware (`verifyToken` / `authorize`) where required
3. handler logic execution in route module scope
4. persistence via model operations
5. optional socket event emission
6. response serialization identical to current contract

### Error Flow

1. throw/forward errors from route handlers
2. normalize in global error middleware
3. return `{ message }` response body with stable status code behavior

## Runtime Boundaries

- Socket event names and room naming remain unchanged.
- Clerk integration remains unchanged in capabilities and response semantics.
- Mongo schema fields and default values remain backward compatible.

## Refactor Plan (No Behavior Changes)

1. **Blueprint complete** (this document).
2. **Backend cleanup**
   - move hardcoded server literals into `server/config/constants.js`
   - move admin route registration from entrypoint into `server/routes/admin.js`
   - centralize global error handler in middleware
3. **Frontend cleanup**
   - move route definitions into `src/routes/AppRoutes.jsx`
   - lazy-load all page-level route components from route layer
   - keep exact same paths, redirects, and visible fallback text

## Verification Checklist

- all original routes still resolve the same way
- API endpoints and response bodies unchanged
- auth and role guards unchanged
- complaint CRUD and status flows unchanged
- no UI text changes
- no design/layout changes
- no removed feature capabilities
