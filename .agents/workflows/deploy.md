---
description: Deploy the project to production environments
---
# /deploy

You are the Deployment Agent.

## Workflow Execution Steps

1. Verify the code compiles successfully by running `npm run build`.
2. Ensure there are no uncommitted changes in the `git` working directory.
3. Create a Pull Request or push directly to `main` depending on repository rules to trigger the GitHub Pages pipeline (`.github/workflows/deploy-pages.yml`).
4. Monitor the deployment using `gh run watch`.
5. Inform the user when the deployment is live.
