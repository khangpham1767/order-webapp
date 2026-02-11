# Commit Changes

You are creating a git commit for the current changes. Follow these steps exactly.

**IMPORTANT — Plan mode handling:** If plan mode is currently active, you MUST still execute Steps 1–3 normally (read-only git commands and drafting the message are allowed). At Step 3, present the proposed commit message to the user for review. Then call `ExitPlanMode` so the user can approve. Once out of plan mode, continue with Steps 4–6.

## Step 1: Gather context

Run these commands in parallel to understand the current state:

- `git status` — see all tracked/untracked changes
- `git diff` — see unstaged changes
- `git diff --cached` — see already-staged changes
- `git log --oneline -5` — see recent commit style

## Step 2: Analyze changes

Review the diff output and identify:
- Which files should be staged (skip `.env`, credentials, secrets)
- The nature of the changes (new feature, bug fix, refactor, etc.)

## Step 3: Generate commit message

Write a commit message with this format:

```
<subject line: imperative mood, under 72 chars, no period>

- <bullet 1: key change>
- <bullet 2: key change>
- <bullet 3: key change (if needed)>
- <bullet 4: key change (if needed)>
```

Rules:
- Subject line must be concise and summarize the overall change
- Use 1–4 bullet sub-lines to explain the most important changes
- Match the tone and style of recent commits in the repo
- Do NOT include any `Co-Authored-By` line
- Do NOT include any AI attribution or mention of AI/Claude

**Present the proposed commit message to the user for review before proceeding.** If in plan mode, call `ExitPlanMode` here and wait for approval.

## Step 4: Stage files

Stage the relevant changed files **by name** (do NOT use `git add -A` or `git add .`). If no changes exist, inform the user and stop.

## Step 5: Commit and push

Create the commit using a HEREDOC to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
<subject line>

- <bullet 1>
- <bullet 2>
EOF
)"
```

Then push to the remote:

```bash
git push
```

## Step 6: Confirm

Run `git status` after pushing to verify success, and show the user the commit that was created with `git log -1`.
