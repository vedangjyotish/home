# Students Module

This module handles student authentication, profile management, and course enrollment features.

## Platform Checks
Since this is a server-side rendered application, platform checks are implemented where necessary using:
- `isPlatformBrowser` and `isPlatformServer` from `@angular/common`
- Conditional imports and logic for browser-specific features

## Features
1. Authentication (Login/Signup)
2. Profile Management
3. Course Enrollment View
4. Profile Picture Management

# Project Rules and Conventions

## 1. Code Style and Formatting
- **Indentation**: Use 2 spaces for indentation
- **Naming Conventions**:
  - Components: PascalCase (e.g., `UserProfile`)
  - Services: PascalCase with 'Service' suffix (e.g., `AuthenticationService`)
  - Interfaces: PascalCase with 'I' prefix (e.g., `IUserData`)
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **CSS Units**:
  - Use `rem` for font sizes and spacing (1rem = 10px)
  - Base font size: 1.6rem (16px)
  - Headings: 2.4rem - 4rem (24px - 40px)
  - Body text: 1.6rem (16px)
  - Small text: 1.4rem (14px)

## 2. Project Structure and Generation
- **Component Generation**: 
  ```bash
  ng generate component path/component-name --skip-tests --standalone
  ```
- **Service Generation**: 
  ```bash
  ng generate service path/service-name --skip-tests
  ```
- **Directory Structure**:
  ```
  src/app/
  ├── components/         # Shared/common components
  │   ├── ui/            # Reusable UI components
  │   └── layout/        # Layout components
  ├── features/          # Feature modules/components
  │   ├── feature1/
  │   └── feature2/
  ├── services/          # Application services
  ├── interfaces/        # TypeScript interfaces
  ├── utils/            # Utility functions
  └── constants/        # Application constants
  ```

## 3. Angular 17 Standards
- **Standalone Components**: Use standalone components by default
  ```typescript
  @Component({
    standalone: true,
    imports: [CommonModule],
    ...
  })
  ```
- **Control Flow Syntax**: Use new Angular 17 control flow
  - Use `@if` instead of `*ngIf`
  - Use `@for` instead of `*ngFor`
  - Use `@switch` instead of `*ngSwitch`
  - Use `@defer` for lazy loading components
- **Signals**: Implement reactive state management using signals
  ```typescript
  // Prefer
  count = signal(0);
  // Instead of
  count = 0;
  ```
- **Computed Values**: Use computed() for derived state
  ```typescript
  totalPrice = computed(() => this.quantity() * this.price());
  ```

## 4. CSS Standards
- **Use Vanilla CSS Only**: 
  - No external CSS frameworks allowed
  - No UI component libraries
  - Build custom components from scratch
- **CSS Organization**:
  - Use BEM naming convention
  - Maintain separate CSS file for each component
  - Use CSS custom properties for theming
  - Implement responsive design using CSS Grid and Flexbox
- **CSS Best Practices**:
  - Use semantic class names
  - Avoid deep nesting (max 3 levels)
  - Implement mobile-first approach
  - Use relative units (rem, em) over fixed units (px)

## 5. Component Guidelines
- One component per file
- Component file naming: `component-name.component.ts`
- Keep components small and focused on a single responsibility
- Use smart/dumb component pattern

## 6. State Management
- Use NgRx for state management
- Follow the action/reducer/effect pattern
- Document all state changes

## 7. API Integration
- All API calls should go through services
- Use environment files for API endpoints
- Implement proper error handling
- Use TypeScript interfaces for API responses

## 8. Testing
- Write unit tests for all services
- Write component tests for complex logic
- Maintain minimum 80% code coverage
- Use meaningful test descriptions

## 9. Documentation
- Document all public methods and complex logic
- Use JSDoc format for documentation
- Keep documentation up to date with code changes
- Document any workarounds or temporary solutions

## 10. Git Workflow
- Branch naming: `feature/feature-name` or `bugfix/bug-description`
- Commit messages should be clear and descriptive
- Pull requests should include description of changes
- Keep commits small and focused

## 11. Performance Guidelines
- Lazy load modules where possible
- Implement proper change detection strategy
- Optimize images and assets
- Use trackBy for ngFor loops

## 12. Accessibility
- Follow WCAG 2.1 guidelines
- Use semantic HTML
- Implement proper ARIA attributes
- Test with screen readers

## 13. Security
- Never store sensitive information in local storage
- Implement proper authentication/authorization
- Sanitize user inputs
- Follow Angular security best practices

## How to Update These Rules
1. Create a pull request with proposed changes
2. Get approval from at least two team members
3. Update documentation accordingly
4. Communicate changes to the team

Note: This document should be reviewed and updated regularly to ensure it remains relevant and helpful.
