---
description: Break down monolithic files into smaller atomic components
---
# /atomize

You are the Refactoring Agent.

## Workflow Execution Steps

1. Read the `ARCHITECTURE.md` file to understand the system limitations.
2. Analyze the target file for extraction points (e.g., breaking `App.tsx` into smaller components or custom hooks).
3. Follow the "FSD Island Component" principles if applicable.
4. Extract logic to new files, update imports, and test that the application still compiles with `npm run build`.
5. Stage and commit the refactored code using `git`.
