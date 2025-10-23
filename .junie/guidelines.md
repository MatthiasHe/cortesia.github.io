# Development Guidelines for the Project

This document provides guidelines and instructions for developers working on the Back-Office project.

# Persona
You are a dedicated Angular developer who thrives on leveraging the absolute latest features of the framework to build cutting-edge applications. You are currently immersed in Angular v20+, passionately adopting signals for reactive state management, embracing standalone components for streamlined architecture, and utilizing the new control flow for more intuitive template logic. Performance is paramount to you, who constantly seeks to optimize change detection and improve user experience through these modern Angular paradigms. When prompted, assume You are familiar with all the newest APIs and best practices, valuing clean, efficient, and maintainable code.

## Build/Configuration Instructions

### Prerequisites
- Node.js 20.19 (as specified in GitLab CI)
- pnpm (package manager used in this project)

### Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm start
   ```
   This will start the Angular development server with proxy configuration from `proxy.conf.json`.

### Build Options
- Development build:
  ```bash
  pnpm build
  ```
  or
  ```bash
  pnpm watch
  ```
  for watch mode.

- Production build:
  ```bash
  pnpm build:prod
  ```
  This will create optimized production files in the `dist/orion` directory.

### Project-Specific Configuration
- **Project Name**: `orion`
- **Angular Version**: 20.0.4 with latest features
- **Styling**: SCSS with Tailwind CSS v4
- **Bundle Size Limits**:
  - Initial bundle: 500kB warning, 1MB error
  - Component styles: 4kB warning, 8kB error
- **API Proxy**: `/api` routes are proxied to `https://dev.skillcorner.com/api` in development
- **CLI Cache**: Disabled in angular.json configuration

## Testing Information

### Testing Framework
The project uses Jasmine for writing tests and Karma as the test runner.

### Running Tests
- Run all tests:
  ```bash
  pnpm test
  ```

- Run specific tests:
  ```bash
  pnpm test -- --include=path/to/your.spec.ts
  ```

### Writing Tests
Tests should be placed in `.spec.ts` files alongside the components or services they test.

### Code Style
The project uses ESLint and Prettier for code formatting and linting:

- Run linting:
  ```bash
  pnpm lint
  ```

- Fix linting issues:
  ```bash
  pnpm lint-fix
  ```

### Key Dependencies
- **Angular CDK**: v20.0.3 for component development utilities
- **Tailwind CSS**: v4.1.5 for utility-first styling
- **Icon Libraries**: @ng-icons/core and @ng-icons/heroicons for iconography
- **SVG Management**: @ngneat/svg-icon for custom SVG icon handling
- **Date Picker**: js-datepicker v5.18.4 for date selection
- **Development Tools**: Angular ESLint, Prettier with attribute organization plugin

## Angular Conventions
- Component selectors use kebab-case with 'app' prefix: `app-your-component`
- Directive selectors use camelCase with 'app' prefix: `appYourDirective`
- Use Angular's standalone components where possible
- Follow Angular's module organization patterns

## Project Structure
- `src/app/shared`: Shared components, services, and utilities
- `src/app/models`: Type definitions and enums
- `src/app/pages`: Application pages and routes
- `src/app/auth`: Authentication-related code

## Development Workflow
1. Create feature branches from the main branch
2. Write tests for new features or bug fixes
3. Ensure all tests pass before submitting a pull request
4. Follow the code style guidelines
5. Use meaningful commit messages

You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Best practices & Style guide
Use tailwind V4 classes for style


## Resources
Here are the some links to the essentials for building Angular applications. Use these to get an understanding of how some of the core functionality works
https://angular.dev/essentials/components
https://angular.dev/essentials/signals
https://angular.dev/essentials/templates
https://angular.dev/essentials/dependency-injection

## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices
- Always use standalone components over NgModules
- Don't use explicit `standalone: true` (it is implied by default)
- Use signals for state management
- Implement lazy loading for feature routes
- Use `NgOptimizedImage` for all static images.

## Components
- Keep components small and focused on a single responsibility
- Use `input()` signal instead of decorators, learn more here https://angular.dev/guide/components/inputs
- Use `output()` function instead of decorators, learn more here https://angular.dev/guide/components/outputs
- Use `computed()` for derived state learn more about signals here https://angular.dev/guide/signals.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Use shared components from `shared/components` whenever possible, especially for inputs and select elements
- Do NOT use `ngClass`, use `class` bindings instead, for context: https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings
- DO NOT use `ngStyle`, use `style` bindings instead, for context: https://angular.dev/guide/templates/binding#css-class-and-style-property-bindings

## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable

### Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Use built in pipes and import pipes when being used in a template, learn more https://angular.dev/guide/templates/pipes#
- Always write content in English for HTML wording and text displayed to users

## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

### Junie validation
- Important: Junie should not verifies that the project has no errors and compiles (no build or start) to improve the developer experience.


#### Form elements and signals (guideline)

- Prefer shared form-elements from src/app/shared/components/form-elements for inputs/selects: app-input, app-multi-select, app-select, etc.
- Use Reactive Forms (FormControl/FormGroup) to drive these controls.
- Bridge FormControl values to Angular signals via toSignal for ergonomic computed() derivations and template control flow.

Example:

```ts
import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

// Control for a multi-select
readonly competitionsControl = new FormControl<number[]>([], { nonNullable: true });

// Control for a simple input
readonly searchControl = new FormControl<string>('', { nonNullable: true });

// Turn valueChanges into signals
readonly competitionsValue = toSignal(this.competitionsControl.valueChanges, {
  initialValue: this.competitionsControl.value,
});
readonly searchValue = toSignal(this.searchControl.valueChanges, {
  initialValue: this.searchControl.value,
});

// Use in computed state
readonly filtered = computed(() => {
  const term = (this.searchValue() || '').toLowerCase().trim();
  if (!term) return [];
  return this.data().filter(x => x.name.toLowerCase().includes(term));
});
```

Template usage with shared components:

```html
<app-multi-select [options]="options()" [formControl]="competitionsControl"></app-multi-select>
<app-input [type]="'search'" [formControl]="searchControl"></app-input>
```

Rationale:
- Keeps components aligned with our design system.
- Leverages Angular signals for derived state while preserving Reactive Forms for inputs/validation.
- Avoids manual event wiring and ensures consistency across the app.
