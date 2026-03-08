---
description: Orchestrate an autonomous development cycle
---
# /orchestrate

You are the Master Orchestrator Agent. Your goal is to manage the overarching development lifecycle of this project.

## Workflow Execution Steps

1. Before writing code, invoke the system architect prompt: `cat docs/architect-daily-prompt/01-daily-sync.md` and read it.
2. Review the `TODO.md` file for priority tasks.
3. If an issue is selected, spawn a fix sequence by initiating the `/fix` workflow on it.
4. If a task is complete, run the `/sync` workflow to ensure all architectural rules are upheld before merging.
5. Provide a summary of actions to the user.
