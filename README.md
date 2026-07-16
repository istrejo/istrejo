# Pendie

A cross-platform productivity application for planning daily work, building habits, and protecting focus time from a single mobile experience.

Pendie is built with modern Angular and Ionic architecture: standalone components, zoneless change detection, Signals, NgRx SignalStore, lazy routes, Supabase, and native authentication through Capacitor.

> **Project status:** Active product development. The repository is public as an engineering portfolio and does not include private Supabase credentials or production data.

## Product areas

### Today

- Daily task planning.
- Subtasks, notes, priorities, and recurring frequencies.
- Calendar context for the current day.
- Google Calendar event integration.

### Habits

- Habit creation and progress tracking.
- Categories such as Health, Work, Study, Finance, and Mindfulness.
- Custom schedules and daily reminders.
- Weekly progress visualization.

### Focus

- Pomodoro focus and break sessions.
- Configurable durations.
- Long-break intervals.
- Optional automatic session transitions.

### Settings and account

- Light, dark, and monochrome themes.
- English and Spanish localization.
- Email/password authentication.
- Google OAuth and Apple Sign-In.
- Password recovery and email-confirmation flows.
- Calendar and account settings.

## Architecture highlights

- **Standalone Angular:** no feature `NgModule` dependencies.
- **Zoneless change detection:** configured with `provideZonelessChangeDetection()`.
- **Signals-first UI:** `signal()`, `computed()`, and `effect()` for local reactive state.
- **Shared state:** NgRx SignalStore for state used across routes.
- **Modern component APIs:** `input()`, `output()`, and `model()`.
- **Modern template control flow:** `@if`, `@for`, and `@switch`.
- **Lazy routing:** routed screens load through `loadComponent`.
- **OnPush components:** explicit and predictable rendering boundaries.
- **Backend as a service:** Supabase authentication and persisted application data.
- **Cross-platform runtime:** Capacitor projects for iOS and Android.

## Tech stack

| Area | Technology |
|---|---|
| Framework | Angular 20, standalone and zoneless |
| Mobile UI | Ionic 8 |
| Native runtime | Capacitor 8 |
| Backend | Supabase |
| Shared state | NgRx Signals / SignalStore |
| Local state | Angular Signals |
| Forms | Angular Reactive Forms |
| Authentication | Supabase Auth, Google Sign-In, Apple Sign-In |
| Internationalization | ngx-translate, English and Spanish |
| Date utilities | FormKit Tempo |
| Testing | Jasmine, Karma |

## Project structure

```text
src/app/
├── core/
│   ├── constants/
│   ├── guards/
│   ├── interceptors/
│   ├── models/
│   └── services/
│       ├── auth/
│       ├── calendar/
│       ├── categories/
│       ├── habits/
│       ├── language/
│       ├── profiles/
│       ├── tasks/
│       └── theme/
├── pages/
│   ├── auth/
│   ├── habits/
│   ├── pomodoro/
│   ├── settings/
│   ├── tabs/
│   └── today/
├── shared/
│   └── components/
└── store/
    ├── auth.store.ts
    ├── calendar.store.ts
    ├── habits.store.ts
    ├── pomodoro.store.ts
    └── tasks.store.ts
```

## State-management rule

Pendie uses a simple ownership rule to avoid unnecessary global state:

- State shared across routes belongs in a SignalStore.
- State owned by a single screen or component stays in Angular Signals.
- Services coordinate data access and integrations; UI components consume reactive state.

This keeps state boundaries explicit while preserving a Signals-first development model.

## What this project demonstrates

- Applying current Angular APIs in a real mobile product.
- Designing a scalable feature and state structure.
- Combining web UI, native capabilities, authentication, and cloud persistence.
- Supporting iOS, Android, English, Spanish, and multiple themes from one codebase.
- Separating local UI state from cross-route application state.
- Building a product beyond a tutorial or isolated technical demo.

## Getting started

### Prerequisites

- Node.js 20+
- Angular CLI
- Ionic CLI
- Xcode for iOS development
- Android Studio for Android development
- A Supabase project

### Installation

```bash
git clone https://github.com/istrejo/pendie.git
cd pendie
npm install
```

Create `src/environments/environment.ts` with your own Supabase project values:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
};
```

Run in the browser:

```bash
npm start
# or
ionic serve
```

Run on a device or emulator:

```bash
ionic capacitor run ios
ionic capacitor run android
```

Build and synchronize native projects:

```bash
npm run build
ionic capacitor sync
```

Run tests:

```bash
npm test
```

## Native application ID

```text
com.istrejo.pendie
```

## Security note

Only public Supabase client configuration belongs in the frontend environment. Service-role keys, private OAuth secrets, production data, and server-side credentials must never be committed.

## License

This repository is shared for portfolio and evaluation purposes. No permission is granted for production reuse unless explicitly stated otherwise.
