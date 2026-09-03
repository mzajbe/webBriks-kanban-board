# webBriks Kanban Board

webBriks is an in-progress task-management Kanban web app. The repository currently contains a polished, responsive frontend prototype for a **Product Roadmap** board. It supports client-side task and column management, filtering, and drag-and-drop workflows; it does **not** yet have a backend, database, real authentication, or persistent data.

> **Project status:** frontend prototype / roughly 50% complete. This README describes the code as it exists today so contributors can safely extend it without assuming unfinished UI is connected to product functionality.

## Contents

- [Quick start](#quick-start)
- [Technology](#technology)
- [Current functionality](#current-functionality)
- [How the application works](#how-the-application-works)
- [Routes](#routes)
- [Project structure](#project-structure)
- [Data model and seed data](#data-model-and-seed-data)
- [Component responsibilities](#component-responsibilities)
- [Frontend audit](#frontend-audit)
- [Development notes](#development-notes)
- [Recommended next steps](#recommended-next-steps)

## Quick start

The app lives in the `client` directory.

### Prerequisites

- Node.js 20.9 or newer (recommended for the installed Next.js version)
- npm

### Install and run

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the local Next.js development server. |
| `npm run lint` | Runs ESLint. See [Known quality issues](#known-quality-issues) for the current result. |
| `npm run build` | Creates a production build. |
| `npm run start` | Serves a production build after `npm run build`. |

## Technology

- **Framework:** Next.js 16 with the App Router
- **Language:** TypeScript and React 19
- **Styling:** Tailwind CSS 4, global CSS utilities, Geist fonts
- **Drag and drop:** `@dnd-kit/core` and `@dnd-kit/sortable`
- **Accessible primitives:** Radix UI wrappers in `components/ui`
- **Icons:** Lucide React
- **Notifications:** Sonner toast notifications

All task, user, board, and authentication data is local mock data. There are no API routes or external services in this repository at present.

## Current functionality

### Board and task workflows

| Feature | Current behavior | Persistence |
| --- | --- | --- |
| View board | Displays the seeded Product Roadmap board with Todo, In Progress, Review, and Done columns. | Seeded on each refresh. |
| Search | Filters visible tasks by case-insensitive title or description text. | In memory. |
| Filter by priority | Shows one of `URGENT`, `HIGH`, `MEDIUM`, or `LOW`; filters can be cleared. | In memory. |
| Filter by assignee | Shows only tasks assigned to a selected seeded team member; filters can be cleared. | In memory. |
| Task count | Shows the count after search and filters are applied. Column badges also reflect the filtered view. | Derived in browser. |
| Create task | Opens from the header New button, a column plus button, its menu, or an empty-column prompt. Requires a title. | In memory. |
| Edit task | Clicking a card or choosing **Edit Task** opens a prefilled form. | In memory. |
| Delete task | Shows a confirmation dialog before removing the task. | In memory. |
| Move task | Drag cards within/across columns, or choose a standard-status destination in a task menu. | In memory. |
| Reorder task | Dragging within a column changes its sequential `position`. Keyboard dragging is configured as well. | In memory. |
| Add column | Adds an empty, neutral-styled column. | In memory. |
| Rename column | Opens a dialog and updates the column title. | In memory. |
| Delete column | Allowed only when the column is empty; otherwise an error toast explains that tasks must be moved or deleted first. | In memory. |
| Responsive navigation | Desktop sidebar is shown on large screens; smaller screens use a slide-out navigation sheet. | UI state only. |

### Authentication screens

`/login` and `/register` share a neumorphic authentication form. They provide client-side form validation, password visibility, a simple length-based strength indicator (register mode), remember-me/terms toggles, and simulated loading/success messages.

They do **not** create users, authenticate credentials, manage sessions, redirect after sign-in, reset passwords, or connect Google/GitHub sign-in. Every completion message is a browser `alert` simulation.

### UI shown but not yet wired to product behavior

The following controls are currently visual-only or have no downstream effect:

- Sidebar menu items: Dashboard, My Tasks, Calendar, Team, Settings, Help & search, and Log out.
- Sidebar board list: selection styling changes locally, but it does not load another board. The add-board button is also inactive.
- Header: Summary, AI tasks, notifications, activity, team, and user-menu items.
- The header button says **New board**, but currently opens the **Create New Task** dialog.
- The `Board.totalTasks` and sidebar board counts are mock values; the active board’s value is not recalculated.

## How the application works

### State ownership and data flow

`DashboardClient` owns only shell-level UI state: whether the mobile sidebar and header-triggered task dialog are open. It passes those controls to the sidebar/topbar and the board.

`KanbanBoard` is the state owner for the active board. On initial render it copies `initialBoard.columns` and `initialBoard.tasks` into React state. It also owns search/filter values, drag state, and dialog/confirmation targets.

```text
mock-board.ts
    -> KanbanBoard local state
        -> BoardToolbar (reads/changes search and filters)
        -> KanbanColumn (renders a filtered column)
            -> TaskCard (renders / edits / moves / deletes a task)
        -> task and column dialogs
```

Because this is React local state, navigating away or refreshing the browser restores the initial mock board and discards every change.

### Filtering

`filteredTasks` is memoized from the complete in-memory task list. A task must meet every active condition:

1. Its title or description contains the search text (case-insensitive), if a search exists.
2. Its priority matches the chosen priority, unless “All priorities” is selected.
3. Its assignee matches the chosen user, unless “All assignees” is selected.

The resulting tasks are sorted by `position`, then each column receives only tasks whose `columnId` matches it. Filters do not alter the task data.

### Drag and drop

Cards use dnd-kit sortable behavior with a 3-pixel pointer activation distance and keyboard-sortable coordinates. While dragging, the board uses pointer containment first, then rectangle intersection, then closest-corner collision detection. A drag can:

- reorder tasks in the same column;
- move a task onto a column background; or
- move a task onto another task in a different column and place it at that task’s index.

After movement, `updateTaskPositions` groups tasks by column and rewrites each task’s zero-based `position`. A toast reports the target column and final position.

### Task create/edit/delete

The task dialog collects title, description, priority, a standard status, optional assignee, and free-text due date. New tasks are assigned an ID based on `Date.now()` and receive the current number of tasks in their selected column as their initial position. Editing merges the submitted values into the original task. Deletes require confirmation.

Subtask and comment counts are display-only fields from the mock data; the task form does not edit them.

### Columns

New columns receive a generated `col-<timestamp>` ID, a `New Column <n>` title, and neutral Slate styling. Column names can be changed. A column is deletable only when it contains no tasks.

Important limitation: the task form’s status selector and the task action menu know only the four original IDs (`todo`, `in_progress`, `review`, and `done`). Tasks can still be dragged into a custom column, but they cannot currently be created directly in one through the form or selected as a menu destination.

## Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` → `DashboardClient` | Main Kanban board shell. |
| `/login` | `app/login/page.tsx` → `NeumorphicAuth` | Sign-in-first version of the simulated auth screen. |
| `/register` | `app/register/page.tsx` → `NeumorphicAuth` | Sign-up-first version of the simulated auth screen. |

The root layout loads Geist/Geist Mono, global styles, metadata, and one bottom-right Sonner toaster for all routes.

## Project structure

```text
webBriks-kanban-board/
├── README.md
└── client/
    ├── app/
    │   ├── layout.tsx              # Shared document layout, metadata, toaster
    │   ├── page.tsx                # Board route
    │   ├── login/page.tsx          # Login route
    │   ├── register/page.tsx       # Register route
    │   └── globals.css             # Tailwind import and custom UI utilities
    ├── components/
    │   ├── auth/neumorphic-auth.tsx
    │   ├── kanban/                 # Board, columns, cards, filters, dialogs
    │   ├── layout/                 # Desktop sidebar, top bar, mobile sidebar
    │   ├── ui/                     # Reusable Radix/Tailwind UI primitives
    │   └── dashboard-client.tsx    # Application shell state
    ├── data/mock-board.ts          # Seed users, boards, columns, and tasks
    ├── lib/utils.ts                # `cn` class-name utility
    ├── types/kanban.ts             # Shared domain TypeScript types
    ├── public/                     # Static assets
    └── package.json
```

## Data model and seed data

Domain types are defined in `client/types/kanban.ts`.

| Type | Key fields | Use |
| --- | --- | --- |
| `User` | `id`, `name`, `email`, `initials`, optional `avatar`/`color` | Current user and task assignees. |
| `Task` | `id`, `title`, `description`, `priority`, `columnId`, `position`, optional assignee/due date/tags/subtasks/comments | A board card. |
| `Column` | `id`, `title`, and Tailwind styling tokens | A Kanban status lane. |
| `Board` | `id`, `name`, `subtitle`, `totalTasks`, `columns`, `tasks` | Board seed object. |
| `BoardItem` | Sidebar display metadata and count | Entry in the sidebar board list. |

`client/data/mock-board.ts` is the single seed source. It defines five users, five sidebar board entries, four initial columns, and 22 sample tasks. Treat it as demo data rather than a source of truth.

## Component responsibilities

| File | Responsibility |
| --- | --- |
| `components/dashboard-client.tsx` | Composes the application shell and coordinates header/mobile-sidebar dialog state. |
| `components/kanban/kanban-board.tsx` | Owns board data, filtering, CRUD handlers, drag/drop logic, toast notifications, and confirmation dialogs. |
| `components/kanban/kanban-column.tsx` | Registers a droppable column, renders sortable task IDs, empty state, and column action menu. |
| `components/kanban/task-card.tsx` | Registers a sortable card and displays task metadata plus card actions. |
| `components/kanban/board-toolbar.tsx` | Renders search and priority/assignee filters with a clear action and derived count. |
| `components/kanban/new-task-dialog.tsx` | Renders create/edit fields and converts submitted values to a task payload. |
| `components/kanban/rename-column-dialog.tsx` | Renders and submits a column-title edit. |
| `components/layout/sidebar.tsx` | Renders desktop navigation, seeded boards, promo area, and current-user footer. |
| `components/layout/mobile-sidebar.tsx` | Places the sidebar inside a responsive Radix Sheet. |
| `components/layout/topbar.tsx` | Renders board heading, visual action controls, and the task-dialog trigger. |
| `components/auth/neumorphic-auth.tsx` | Hosts both simulated login and registration experiences. |

## Frontend audit

### What is implemented well enough for a frontend prototype

- Responsive board shell with desktop and mobile navigation variants.
- Interactive task CRUD and column CRUD within one browser session.
- Multi-column pointer and keyboard drag-and-drop with visible drag feedback.
- Search plus composable priority and assignee filters.
- Reusable UI primitives, toast feedback, confirmation dialogs, and TypeScript domain models.
- Accessible Radix-based dialogs, menus, sheet, tooltip, and alert-dialog foundations.

### What is intentionally missing or incomplete

- No database, API, server actions, API route, ORM, or environment configuration.
- No real user identity, authorization, workspace membership, sessions, or protected routes.
- No persistent boards, tasks, column ordering, files, comments, tags, activity, notifications, reporting, or calendar.
- No backend validation, request error handling, optimistic updates, loading/error states for data, or automated tests.
- No board switching despite a multi-board sidebar presentation.
- No actual AI task generation, summaries, sharing, team actions, or notification center.
- No screenshot/demo asset currently included in the repository.

### Known quality issues

`npm run lint` was run during this documentation audit. It currently exits with **2 errors and 7 warnings**:

- Errors: `NewTaskDialog` and `RenameColumnDialog` synchronously initialize form state inside `useEffect`, which triggers `react-hooks/set-state-in-effect`.
- Warnings: unused imports appear in the auth form, board toolbar, sidebar, top bar, and dropdown-menu UI wrapper.

No source code was changed as part of this documentation update. Contributors should resolve these lint findings before treating the app as build-ready.

## Development notes

- Use the `@/` import alias for modules under `client` (configured in `client/tsconfig.json`).
- Interactive board modules are client components because they depend on React state, dnd-kit, dialogs, and browser events.
- Styling tokens such as column colors live on the column data model, which keeps column rendering generic.
- Use `cn` from `lib/utils.ts` when conditionally combining Tailwind classes.
- The UI library files in `components/ui` wrap Radix primitives and local Tailwind variants; extend those primitives before duplicating common dialog/menu/button behavior.

## Recommended next steps

1. Fix the two lint errors and unused imports; add tests for filtering, task CRUD, movement, and column deletion rules.
2. Replace `mock-board.ts` runtime state with a persisted API and database schema for users, workspaces, boards, columns, and tasks.
3. Add authentication, session handling, authorization, protected routes, and real OAuth integration.
4. Make board selection load data; implement create-board, rename/reorder columns, and dynamic custom-column choices in task forms and menus.
5. Define a real due-date type and date picker, then add task details, subtasks, comments, tags, attachments, and activity history.
6. Wire Summary, AI tasks, notifications, team, settings, logout, and password recovery to designed product flows.
7. Add integration/E2E testing, accessibility review, error boundaries, empty/loading/error states, and deployment/environment documentation.

## License

No license file is currently included. Add one before distributing or accepting external contributions under a defined license.
