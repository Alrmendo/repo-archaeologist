# Repo Archaeologist

A desktop app for exploring the history of a local Git repository: commit
activity over time, hotspot files (highest churn), code ownership per file,
and change coupling between files that tend to be edited together.

## Prerequisites

- Node.js
- Git (must be available on your `PATH`)

## Run locally

1. Install dependencies:
   ```
   npm install
   ```
2. Start the app in development mode:
   ```
   npm run dev
   ```

This launches the Electron app with hot reload for the renderer.

## Build

```
npm run build
```

Builds the main, preload, and renderer bundles into `out/`.

## How it works

- Click **Open Repository** and pick a local folder (it must contain a
  `.git` directory).
- The app analyzes the currently checked-out commit (`HEAD`) using `git`
  directly (via `simple-git`) — commit history, file hotspots, and change
  coupling are computed up front; per-file ownership (`git blame`) is
  computed on demand when you select a file on the Knowledge & Coupling
  page.
- Analysis is not cached — reopening a repository re-runs it from scratch.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the app in development mode |
| `npm run build` | Build production bundles |
| `npm run preview` | Preview a production build |
| `npm run lint` | Type-check the project |
| `npm run clean` | Remove build output |
