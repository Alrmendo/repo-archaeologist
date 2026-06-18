# Prompt cho Claude Code — Export Report Feature

Now add the Export Report feature. The git analysis logic and real data flow are already working — this step just adds a way to export the analyzed data to a JSON file.

If anything below is ambiguous, ask me first before proceeding.

## What to build

1. Add an "Export Report" button in the TopBar, next to the existing "Open Repository" button. It should only be enabled/visible when a repository has been successfully analyzed (disable or hide it in the empty state, same logic as how other repo-dependent UI already behaves).
2. Clicking it triggers Electron's native "Save File" dialog (`dialog.showSaveDialog` in the main process, via IPC from the renderer) defaulting to a filename like `<repo-name>-report.json` and defaulting to `.json` extension.
3. Once the user picks a location, write the file with this exact structure (matching the PRD):

```json
{
  "repository": {
    "name": "...",
    "totalCommits": 0,
    "totalContributors": 0,
    "filesTracked": 0,
    "firstCommitDate": "...",
    "latestCommitDate": "..."
  },
  "hotspots": [
    { "rank": 1, "file": "...", "commits": 0, "heat": "very_high" }
  ],
  "ownership": [
    { "file": "...", "contributors": [{ "name": "...", "percentage": 0 }], "knowledgeSilo": false }
  ],
  "coupling": [
    { "fileA": "...", "fileB": "...", "coChanges": 0 }
  ]
}
```

Use the same data that's already been computed and is currently driving the UI — don't re-run the git analysis just for export, reuse whatever's already in memory/state from the last analysis run.

**Important nuance on "ownership" in the export**: the live UI only computes ownership for one file at a time (on-demand, when the user clicks into a file in the Knowledge & Coupling page), since running `git blame` on every file upfront was explicitly ruled out for performance reasons. For the export, decide whether to (a) only include ownership data for files the user has already clicked into during this session, or (b) compute ownership for some reasonable subset (e.g. just the hotspot files, since those are the most relevant ones) at export time. Pick whichever makes more sense given the current code structure, but tell me which you chose and why — don't silently run `git blame` on every single file in the repo at export time, since that reintroduces the exact performance problem the PRD told us to avoid.

4. After a successful save, show a brief success confirmation in the UI (a small toast/inline message is enough — doesn't need to be fancy). If the save fails (e.g. permission error, disk full), show an error message rather than failing silently.


## Out of scope for this step

No electron-builder packaging yet (that's next). Don't touch the churn score, timeline, or dark mode nice-to-haves.