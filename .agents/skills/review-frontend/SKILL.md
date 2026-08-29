---
name: review-frontend
description: Review React applications for architectural anti-patterns, performance bottlenecks, state management flaws, and client-side security vulnerabilities.
---
# Skill: React Application Review Guide

## Overview
This skill provides a structured framework for conducting comprehensive code and security reviews of **React applications** (supporting modern Functional Components, React 18/19, Next.js / Remix / Vite, and TypeScript). Use this guide to identify architectural anti-patterns, performance bottlenecks, state management flaws, and client-side security vulnerabilities.

---

## Quick Reference Checklist

| Category | High-Priority Checks |
| :--- | :--- |
| **Architecture** | Component isolation, Custom Hooks, TypeScript usage, project structure |
| **State & Data** | Server state vs Local state, immutability, unnecessary re-renders |
| **Security** | XSS prevention, sensitive data exposure, Auth/JWT storage, dangerouslySetInnerHTML |
| **Performance** | Code splitting, memoization misuse, virtualization, bundle footprint |
| **Error Handling** | Error Boundaries, fallback UI, async error handling |
| **Testing** | React Testing Library patterns, accessibility testing, E2E scope |

---

## Phase 1: Architecture & Component Design

### 1.1 Component Responsibilities & Boundaries
- **Single Responsibility Principle (SRP)**: Ensure components stay small and focused on presentation. Abstract complex logic into custom hooks.
- **Container / Presentational Separation**: Keep UI markup decoupled from heavy API calls or complex domain logic.
- **Composition over Inheritance**: Use props (`children`, render props, or slots) instead of bloated, deeply nested component trees.

### 1.2 TypeScript Usage & Type Safety
- **Strict Mode**: Verify `strict: true` is enabled in `tsconfig.json`.
- **Avoid `any`**: Flag explicit or implicit `any` types. Require explicit Interfaces or Types for Props, State, and API payloads.
- **Props Typing**: Use strict event handler typing (e.g., `React.MouseEvent<HTMLButtonElement>`) rather than loose functions (`Function`).

```tsx
// BAD: Loose typing and mixed responsibilities
interface Props {
  data: any;
  onClick: Function;
}

// GOOD: Strictly typed props with clean composition
interface UserCardProps {
  user: UserProfile;
  onSelectUser: (id: string) => void;
  children?: React.ReactNode;
}