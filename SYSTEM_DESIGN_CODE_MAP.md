# CivicTrack System Design Code Map

This document maps the current codebase folder structure to the system design, OOP principles, SOLID principles, and design patterns used in the implementation.

## Folder Structure With Design Mapping

```text
Civic_Track/
├── frontend/
│   ├── index.html           SPA HTML entry
│   ├── public/              Static browser assets
│   ├── vite.config.js       Frontend build/dev-server config
│   └── src/
│       ├── api/             API gateway layer, transport abstraction
│       ├── components/      Reusable presentation layer
│       ├── context/         Shared auth state provider
│       ├── data/            Constants and static app configuration
│       ├── domain/          Frontend domain classes and policy objects
│       ├── hooks/           Application state orchestration for React pages
│       ├── lib/             Shared UI/helper utilities
│       ├── pages/           Role-specific page workflows
│       ├── routes/          Route tree and route guards
│       └── utils/           Compatibility helpers and socket client
│
├── backend/
│   ├── config/              Environment and backend constants
│   ├── errors/              Error class hierarchy
│   ├── middleware/          Express middleware chain
│   ├── policies/            Decision rules and polymorphic behavior points
│   ├── repositories/        Database access abstraction
│   ├── routes/              REST controller layer
│   ├── services/            Business use cases and orchestration
│   └── utils/               Backend utilities such as socket and ID helpers
│
├── database/
│   ├── connect.js           MongoDB connection bootstrap
│   └── models/              Mongoose persistence schemas
│
├── uml_diagrams/
│   ├── *.png                Legacy exported UML diagrams
│   └── current/             Current Mermaid UML source files
│
├── SYSTEM_DESIGN.md         Full system design explanation
└── SYSTEM_DESIGN_CODE_MAP.md This file
```

## Backend Design Mapping

| Path | Design Used | Where In Code | Why It Exists |
| --- | --- | --- | --- |
| `backend/routes/complaints.js` | Controller / REST endpoint layer | Express route handlers | Keeps HTTP request/response handling separate from business rules |
| `backend/routes/admin.js` | Controller / REST endpoint layer | Admin employee endpoints | Delegates employee creation/listing to service classes |
| `backend/services/ComplaintService.js` | Service Layer, Encapsulation, SRP | `ComplaintService` class | Encapsulates complaint creation, assignment, status updates, history updates, ID generation, and notifications |
| `backend/services/EmployeeService.js` | Service Layer, Abstraction, SRP | `EmployeeService` class | Encapsulates Clerk employee creation and employee listing |
| `backend/services/NotificationService.js` | Publisher abstraction, Observer/Pub-Sub | `NotificationService` class | Hides Socket.IO event publishing details from complaint business logic |
| `backend/repositories/ComplaintRepository.js` | Repository Pattern, DIP | `ComplaintRepository` class | Hides Mongoose queries behind a persistence abstraction |
| `backend/policies/ComplaintStatusPolicy.js` | Policy Object, Polymorphism-style dispatch, OCP | `ComplaintStatusPolicy` class | Centralizes which statuses employees can set |
| `backend/policies/AdminCredentialPolicy.js` | Policy Object, SRP | `AdminCredentialPolicy` class | Centralizes the existing admin credential header rule |
| `backend/errors/AppError.js` | Inheritance, Error hierarchy | `AppError`, `InvalidComplaintStatusError` | Provides typed application errors with HTTP status codes |
| `backend/middleware/auth.js` | Middleware Chain, Authorization policy | `verifyToken`, `authorize` | Separates auth checks from route business logic |
| `backend/middleware/errorHandler.js` | Centralized Error Handling | `errorHandler` | Normalizes thrown errors into `{ message }` API responses |
| `backend/config/constants.js` | Configuration centralization | `SERVER_CONSTANTS` | Avoids scattering backend route names, roles, statuses, socket events, and auth constants |
| `backend/utils/socket.js` | Infrastructure utility | `initSocket`, `getIO` | Owns Socket.IO initialization and room subscription mechanics |
| `backend/utils/complaintId.js` | Utility / ID generation | `generateComplaintId` | Preserves the existing `CMP-####` public ID format |

## Database Design Mapping

| Path | Design Used | Where In Code | Why It Exists |
| --- | --- | --- | --- |
| `database/connect.js` | Persistence bootstrap | `connectDatabase` | Keeps MongoDB connection setup outside the API server entry file |
| `database/models/Complaint.js` | Data Model / Persistence Contract | Mongoose schema | Defines complaint document structure and database indexes |

## Frontend Design Mapping

| Path | Design Used | Where In Code | Why It Exists |
| --- | --- | --- | --- |
| `frontend/src/routes/AppRoutes.jsx` | Router layer, Role-based route composition | React Router route tree | Centralizes route structure and lazy-loaded pages |
| `frontend/src/routes/ProtectedRoute.jsx` | Guard pattern | Authenticated route wrapper | Prevents unauthenticated access |
| `frontend/src/routes/RoleRoute.jsx` | Authorization guard | Role-specific route wrapper | Redirects users away from routes outside their role |
| `frontend/src/context/AuthContext.jsx` | Provider Pattern, State abstraction | `AuthProvider` | Hides Clerk session details and exposes app auth state |
| `frontend/src/hooks/useAllComplaints.js` | Custom Hook, SRP | `useAllComplaints` | Manages all-complaint loading/error state |
| `frontend/src/hooks/useCitizenComplaints.js` | Custom Hook, SRP | `useCitizenComplaints` | Manages citizen-specific complaint state |
| `frontend/src/hooks/useEmployeeComplaints.js` | Custom Hook, API abstraction | `useEmployeeComplaints` | Uses backend filtering for assigned employee complaints |
| `frontend/src/hooks/useComplaintDetails.js` | Custom Hook, Observer/Pub-Sub | `useComplaintDetails` | Combines complaint detail loading with Socket.IO status updates |
| `frontend/src/hooks/useComplaintActions.js` | Command abstraction | `useComplaintActions` | Gives UI components stable mutation functions |
| `frontend/src/hooks/useEmployees.js` | Custom Hook, State orchestration | `useEmployees` | Manages employee list loading and employee creation |
| `frontend/src/api/complaintApi.js` | API Gateway, Abstraction | `complaintApi` object | Hides HTTP endpoints and maps API complaint data into domain objects |
| `frontend/src/api/adminApi.js` | API Gateway | `adminApi` object | Handles current admin employee creation endpoint |
| `frontend/src/api/axiosInstance.js` | Transport abstraction | Axios instance | Centralizes base URL and auth header injection |
| `frontend/src/api/sessionToken.js` | Session token abstraction | `refreshSessionToken` | Refreshes Clerk JWT before backend API calls |
| `frontend/src/api/mockApi.js` | Compatibility adapter | `mockApi` alias | Keeps old imports safe while new code uses `complaintApi` |
| `frontend/src/domain/Complaint.js` | Domain Model / Class | `Complaint` class | Encapsulates complaint API data and future computed behavior |
| `frontend/src/domain/ComplaintStatusPolicy.js` | Policy Object, Polymorphism-style mapping | `ComplaintStatusPolicy` class | Centralizes status badge styling and labels |
| `frontend/src/data/roleConstants.js` | Constant centralization | `ROLES`, `ROLE_VALUES` | Avoids repeated role magic strings |
| `frontend/src/data/statusConstants.js` | Constant centralization | `STATUS`, `categories`, `departments` | Avoids repeated status/category/department literals |
| `frontend/src/components/ui/StatusBadge.jsx` | Presentation component, Policy usage | `StatusBadge` | Uses policy class instead of hardcoded status mapping in JSX |
| `frontend/src/components/ui/ComplaintCard.jsx` | Presentation component | Complaint card UI | Displays complaint data without API knowledge |
| `frontend/src/components/layout/*` | Layout composition | App shell components | Keeps shared navigation/page shell separate from pages |
| `frontend/src/pages/*` | Page composition | Role-specific page components | Pages compose hooks and components instead of owning API details |
| `frontend/src/utils/socket.js` | Infrastructure adapter | Socket.IO client | Centralizes frontend socket client creation |
| `frontend/src/utils/constants.js` | Compatibility re-export | Re-exports status constants | Keeps older imports working after constants moved into `frontend/src/data/` |

## OOP Principles In The Code

### Encapsulation

Encapsulation means keeping related state changes and rules inside one unit.

Used in:

- `ComplaintService.createComplaint`
- `ComplaintService.assignComplaint`
- `ComplaintService.updateComplaintStatus`
- `EmployeeService.createEmployee`
- `NotificationService.publishComplaintStatusUpdated`
- `Complaint` frontend domain class

Example:

```text
Complaint assignment updates assignedTo, status, history, database save, and socket notification through ComplaintService.
```

The route handler no longer manually changes all of those fields.

### Abstraction

Abstraction means callers depend on a simpler interface instead of implementation details.

Used in:

- `ComplaintRepository` abstracts Mongoose queries.
- `complaintApi` abstracts HTTP endpoint paths.
- `AuthProvider` abstracts Clerk session data.
- `NotificationService` abstracts Socket.IO event publishing.
- `useComplaintActions` abstracts mutation commands for UI pages.

### Inheritance

Inheritance is used where it fits naturally without forcing a fake user hierarchy.

Used in:

```text
Error
└── AppError
    └── InvalidComplaintStatusError
```

Files:

- `backend/errors/AppError.js`

This gives all app errors a shared shape while specialized errors can still represent specific cases.

### Polymorphism

JavaScript/React apps often use policy maps and strategy-like objects instead of deep inheritance trees. CivicTrack uses that practical form of polymorphism.

Used in:

- `ComplaintStatusPolicy.canEmployeeSetStatus`
- `ComplaintStatusPolicy.getBadgeClass`
- `ComplaintStatusPolicy.getLabel`
- `AdminCredentialPolicy.isValidCredentialRequest`
- Role route selection through `RoleRoute`
- Navigation configuration keyed by role in `AppPillNavbar`

Example:

```text
StatusBadge does not use if/else chains.
It asks ComplaintStatusPolicy for the correct style and label.
```

## SOLID Principles In The Code

| Principle | Where It Appears | Explanation |
| --- | --- | --- |
| Single Responsibility | Services, repositories, policies, hooks | Each module owns one focused concern |
| Open/Closed | Policy classes and role/status maps | Add new statuses/roles by extending maps/policies instead of editing scattered conditionals |
| Liskov Substitution | Error hierarchy | `InvalidComplaintStatusError` can be handled anywhere an `AppError` or `Error` is expected |
| Interface Segregation | Role-specific hooks and APIs | Citizen, admin, and employee pages consume only the hooks/actions they need |
| Dependency Inversion | Services depend on repository/notifier abstractions | `ComplaintService` receives repository and notifier dependencies, making business logic less tied to Mongoose/Socket.IO |

## Design Patterns In The Code

| Pattern | Implementation | Files |
| --- | --- | --- |
| Service Layer | Business use cases | `backend/services/*.js` |
| Repository | Persistence gateway | `backend/repositories/ComplaintRepository.js` |
| Policy Object | Decision rules | `backend/policies/*.js`, `frontend/src/domain/ComplaintStatusPolicy.js` |
| Adapter / API Gateway | Frontend API wrapper | `frontend/src/api/complaintApi.js`, `frontend/src/api/adminApi.js` |
| Provider | Auth state distribution | `frontend/src/context/AuthContext.jsx` |
| Guard | Protected and role-specific routes | `frontend/src/routes/ProtectedRoute.jsx`, `frontend/src/routes/RoleRoute.jsx` |
| Observer / Pub-Sub | Realtime status updates | `backend/services/NotificationService.js`, `frontend/src/hooks/useComplaintDetails.js` |
| Factory Method | API-to-domain conversion | `Complaint.fromApiResponse`, `Complaint.listFromApiResponse` |
| Middleware Chain | Express request pipeline | `backend/middleware/*.js` |

## Current Request Flow Mapped To Code

### Citizen Creates Complaint

```text
NewComplaintPage
-> useComplaintActions.createComplaint
-> complaintApi.createComplaint
-> POST /api/v1/complaints
-> verifyToken + authorize(citizen)
-> ComplaintService.createComplaint
-> ComplaintRepository.create
-> MongoDB Complaint collection
```

Design used:

- Custom Hook
- API Gateway
- Controller
- Middleware Chain
- Service Layer
- Repository
- Data Model

### Admin Assigns Complaint

```text
AssignComplaintModal / Admin complaint page
-> useComplaintActions.assignComplaint
-> complaintApi.assignComplaint
-> PATCH /api/v1/complaints/:id/assign
-> verifyToken + authorize(admin)
-> ComplaintService.assignComplaint
-> ComplaintRepository.findByPublicId
-> ComplaintRepository.save
-> NotificationService.publishComplaintStatusUpdated
-> Socket.IO room complaint_<id>
```

Design used:

- Command hook
- API Gateway
- Controller
- Service Layer
- Repository
- Observer/Pub-Sub

### Employee Updates Complaint Status

```text
UpdateStatusModal
-> useComplaintActions.updateComplaintStatus
-> complaintApi.updateComplaintStatus
-> PATCH /api/v1/complaints/:id/status
-> verifyToken + authorize(employee)
-> ComplaintStatusPolicy.canEmployeeSetStatus
-> ComplaintService.updateComplaintStatus
-> ComplaintRepository.save
-> NotificationService.publishComplaintStatusUpdated
```

Design used:

- Policy Object
- Encapsulation
- Service Layer
- Repository
- Pub/Sub notification

### Complaint Detail Realtime Updates

```text
ComplaintDetailPage
-> useComplaintDetails
-> complaintApi.complaintById
-> socket.emit(join_complaint)
-> socket.on(status_updated)
-> local complaint state update
```

Design used:

- Custom Hook
- API Gateway
- Observer/Pub-Sub
- State encapsulation

## UML Alignment Summary

### Review of Existing PNG UMLs

The existing PNG diagrams in `uml_diagrams/` are good as early design sketches, but they are not fully accurate as final diagrams for the current codebase.

| Existing Diagram | Verdict | What Is Correct | What Needs Correction |
| --- | --- | --- | --- |
| `class_diagram.png` | Partially correct conceptually, not accurate enough for current implementation | It shows the right domain ideas: user roles, complaint, assignment, notification, and OOP/design-pattern thinking | It includes many classes that do not exist in code, such as factory/strategy/observer variants, and it misses current real classes such as `ComplaintService`, `ComplaintRepository`, `NotificationService`, policy classes, and error classes |
| `use_case.png` | Mostly correct | Citizen, employee, and admin actors are right, and the main flows match the project | Clean up UML notation: use `<<include>>` / `<<extend>>`, rename "Attach Complaints", remove "close" unless the code has an actual close action, and reduce crossing lines |
| `erDiagram.png` | Conceptually useful, but mismatched with the current backend | It correctly identifies users, complaints, location, assignments, and role-based relations | The current app uses Clerk for users, not a local `USER` table with `passwordHash` and `refresh_token`; location and history are embedded inside the complaint document rather than separate Mongo collections |
| `sequence_diagram.png` | Good workflow explanation, but not current-code accurate | It captures the complaint lifecycle: submit, assign, employee update, resolve, citizen track | It references old/local auth and email-style notifier behavior; current code uses Clerk auth, Express routes, services, repository, MongoDB, and Socket.IO status events |

## Final Note

The codebase now uses a layered architecture:

```text
React Pages
-> Hooks
-> API Clients
-> Express Routes
-> Middleware
-> Services
-> Policies / Repositories / Notification Service
-> MongoDB / Clerk / Socket.IO
```

The strongest OOP usage is in the backend service/repository/policy/error layers. The frontend remains idiomatic React, using hooks and composition, with domain classes and policy objects only where they improve clarity without changing behavior.
