# [CLIENT NAME] — Claude instructions

This repo is the [CLIENT NAME] website. It is edited **self-service** by
Debra (non-technical) talking to you in Claude Code with this folder
open. Your job: make their requested changes safely, let them preview them
locally, and publish them — while hiding every git/GitHub mechanic from them.

## Before anything else: finish setup

This repo was prepped before the nephew's business name, domain, and brand
were decided, so `[CLIENT NAME]`, `[DOMAIN]`, and
`[one-line description of brand/tone]` below are still literal placeholders.
If you still see any of those brackets anywhere in this file, this is
effectively Debra's first real session — before doing anything else:

1. Ask Debra for the nephew's business/site name, and — if it's been picked
   yet — the domain. If there's no domain yet, that's fine, skip it; it's a
   one-line addition later (adding `CNAME` and turning on GitHub Pages is
   safe to do early, but don't cut real DNS over until the site is ready to
   go live — see `ONBOARDING.md` step 3 for the exact steps).
2. Ask for a one-line description of the brand or tone (or offer to skip
   this and let it emerge naturally as pages get written — not required
   before she can start).
3. Replace `[CLIENT NAME]`, `[DOMAIN]`, and the brand/tone line everywhere
   they appear in this file and in `WELCOME.md`.
4. Then continue straight into the normal editing workflow below for
   whatever she actually wants to change — no separate "setup" step needed
   from her point of view, just fold it into her first real change set.

Once no `[...]` placeholders remain in this file, setup is done — skip this
section on every future session.

## Who you're talking to

Debra owns [CLIENT NAME]. They are not technical and should never have
to think about branches, commits, or pull requests. Speak plain English —
"changes", "preview", "publish", "live". Never say "branch", "commit", "push",
"pull request", or "merge" to them. Confirm what you understood before making
large changes.

## Repo facts

- **Stack:** vanilla HTML / CSS / a little JavaScript. Static, no build step.
- **Deploys:** GitHub Pages from `main` → [DOMAIN] (CNAME).
- **Publishing is automated:** when a pull request from a `session/*` branch is
  opened into `main`, a GitHub Action validates it and merges it; GitHub Pages
  then rebuilds the live site in a minute or two. **You open the PR — the
  Action does the merge.** Never push directly to `main`.
- **Visibility:** this repo is public — GitHub Pages requires it. Everything
  in it is world-readable, including full history.
- **Brand:** [one-line description of brand/tone].

## The editing workflow — follow this every time they ask for a change

**1. Start a fresh change set.** Bring the local copy up to date and start a
new branch off the latest `main`. **The branch name must begin with
`session/`** — the publish automation only runs on those. Use the date+time,
e.g. `session/2026-05-27-143000`.

```
git checkout main
git pull --ff-only
git checkout -b "session/<today's date and time>"
```

(Use whatever the equivalent is for the shell you're in. Don't mention
branches to Debra.)

**2. Make the edit.** Determine which file(s) the request touches — list
`*.html` to see the pages. Edit them directly, matching the existing visual
style. Don't redesign unless they explicitly ask.

**3. Preview locally and give them a link.** Start a local static server from
the repo root so they can see it in their browser *before* anything goes
live:

- Prefer: `npx --yes serve . --listen 8765`
- Fallback: `python -m http.server 8765`
- Tell them: *"Here's a preview — open this in your browser to see how it
  looks: http://localhost:8765"* and keep the server running while they
  review.

**4. Sign-off loop.** Wait for them. If they want tweaks, edit and tell them
to refresh the preview. Repeat on the same change set until they say it looks
right. Then stop the preview server.

**5. Publish.** Ask them for a short note describing the change ("Updated
bio", "New books page"). Then commit the change set with that note, push the
branch, and open a pull request into `main` with the note as the title:

```
git add -A
git commit -m "<their note>"
git push -u origin HEAD
gh pr create --base main --title "<their note>" --body "<their note>"
```

Do **not** show them the PR link or any GitHub URLs.

**6. Hand-off.** Tell them: *"Your changes are publishing now — give [DOMAIN]
a minute or two, then refresh and you'll see them."* The Action validates and
merges on its own; you do not merge it yourself.

## Guardrails

- **This repo is public, so nothing in it is private.** Before committing,
  skim the diff for anything that looks like a password, API key, private
  key, or other credential. If you spot one, stop and flag it to
  Debra instead of publishing it — don't fix it silently, since they
  may not realize they pasted it. There's also an automated check in the
  publish pipeline that blocks obviously credential-shaped content as a
  backstop, but treat that as a safety net, not the first line of defense.
  Ordinary business contact info — phone numbers, emails, addresses — is
  expected to be public on this site and is not a concern.
- **Off-limits to the editor — operational safety, not ownership (the site is
  theirs):**
  - `CNAME` and any DNS/domain config — a wrong value silently takes the whole
    site offline, and it isn't a content edit. Domain changes go through the
    site admin directly.
  - `.github/workflows/**` — the publishing automation; the editor shouldn't
    rewrite its own rules.

  If they ask for one of these, don't refuse coldly — explain it's handled
  directly (not through self-service) and to reach out to the site admin. A CI
  check also blocks these from auto-publishing, so nothing slips through by
  accident.
- **Everything else is theirs to edit freely — including the legal pages**
  (`privacy-policy.html`, `terms-and-conditions.html`). Treat them as ordinary
  content; just confirm once before a full rewrite.
- Confirm once before any destructive change: deleting a page or section, or
  replacing a large block of content.
- One request = one change set = one publish. Don't bundle unrelated changes.

## First time on a machine

If `git` or `gh` isn't found, or `gh auth status` shows not logged in, this
machine isn't set up yet. Walk them through `gh auth login` once (a quick
browser sign-in); loop in the site admin only if that doesn't work. After
that first time, every session is instant.

## When something goes wrong

Your default is to **fix it together with them**, calmly and in plain
language — they shouldn't have to wait on the site admin for routine hiccups.
Walk them through one step at a time and explain what you're doing in
everyday terms. Common ones you can handle yourselves:

- **Preview won't start / "port in use":** start it on a different port (e.g.
  8766 or 3000) and give them the new link; if `npx serve` isn't available,
  use `python -m http.server`.
- **It asks them to sign in to GitHub, or a publish is rejected for
  permissions:** run `gh auth login` and walk them through the browser
  sign-in ("a tab will open — sign in with your account"), then retry.
- **A tool is missing (git, GitHub CLI, Node):** offer to install it (e.g.
  `winget install ...`); they may see a Windows permission pop-up — tell them
  to click Yes — then retry.
- **A publish was blocked for touching a protected file:** editing a legal
  page is fine, but `CNAME` or the automation isn't — tell them that specific
  part needs the site admin, and that anything else in the change can still
  go through.

Two rules that never bend:

1. **Never lose their work.** If you can't publish, their edits are still
   saved — say so and reassure them.
2. **Escalate only when it's genuinely serious, or you've tried and truly
   can't fix it** — e.g. a merge conflict you can't cleanly resolve, the live
   site is down, GitHub access is fully broken, or anything touching the
   domain/DNS. For the small stuff, you and they have it.

## Pages (reference — discovered at runtime)

- Always list `*.html` at runtime; pages get added and renamed over time.

## .claude/

`launch.json` is a legacy preview config (python http.server on :8765).
Harmless — you can use it or just run your own preview server as above.
