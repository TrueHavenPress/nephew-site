# doxDev self-service site template

This is doxDev's internal template for standing up self-service marketing
sites for clients. Each client gets their own repo generated from this
template. Once set up, the client edits their own site by talking to Claude
Code in plain English — no git, GitHub, or code knowledge required on their
end.

**This README is for doxDev, not the client.** If you're the client reading
this, you probably want [WELCOME.md](WELCOME.md) instead.

## What this template provides

- A static HTML/CSS site (no build step) that deploys via GitHub Pages.
- `claude.md` — instructions that turn Claude Code into the client's
  self-service editor: it makes the edit, previews it locally, and publishes
  it, while hiding every git/GitHub mechanic from the client.
- `.github/workflows/auto-publish.yml` — a GitHub Action that auto-merges
  the client's changes once Claude opens a pull request, so a doxDev human
  doesn't need to be in the loop for routine edits.
- Guardrails so the client can edit their content freely but can't
  accidentally take the domain offline or rewrite the publishing automation.
- **The repo must be public** — that's what makes GitHub Pages work on the
  free plan this template assumes. That also means everything committed here
  is world-readable, so the pipeline includes a best-effort check that blocks
  obviously credential-shaped content (API keys, private keys, tokens) from
  auto-publishing. See "Guardrails" below.

## Repo map

| File | Purpose |
| --- | --- |
| `claude.md` | Claude Code's instructions for working in a client's repo. This is the core of the self-service workflow. |
| `WELCOME.md` | The doc the client reads. Explains the workflow ("preview", "publish") in plain language, no jargon. |
| `ONBOARDING.md` | Step-by-step for standing up a **new** client site from this template. Start there for a new client. |
| `.github/workflows/auto-publish.yml` | Validates and auto-merges the client's changes. |
| `index.html`, `404.html`, `privacy-policy.html`, `terms-and-conditions.html`, `styles.css` | Placeholder starter content for the site itself. |

## Setting up a new client site

Full steps live in [ONBOARDING.md](ONBOARDING.md). Short version:

1. Generate the repo from this template:
   ```
   gh repo create <ORG>/<Client>-Site --public --template <this-repo> --clone
   ```
2. Find-and-replace the placeholders (`[CLIENT NAME]`, `[OWNER NAME]`,
   `[DOMAIN]`) in `claude.md` and `WELCOME.md`.
3. Add the `CNAME` file and point GitHub Pages at it — but don't cut DNS
   over until the site is actually ready to go live.
4. Confirm `gh auth status` is logged in with access to the new repo.
5. Get the client set up on their machine (below), then hand off.

## Getting the client set up on their machine

This is the one-time setup a doxDev person walks the client through before
they can start talking to Claude Code about their site. After this, every
future session is just "open Claude Code and say what you want changed" —
see `WELCOME.md` for how that ongoing conversation works.

1. **Install Git** — [git-scm.com/downloads](https://git-scm.com/downloads).
   Default install options are fine.
2. **Install the GitHub CLI** — [cli.github.com](https://cli.github.com/).
   Then run `gh auth login` and follow the prompts — browser sign-in is
   easiest.
3. **Install Claude Code** — follow the setup at
   [claude.com/claude-code](https://claude.com/claude-code) for their OS.
4. **Clone their site's repo:**
   ```
   git clone https://github.com/<ORG>/<Client>-Site.git
   ```
5. **Open the folder in Claude Code** — `cd <Client>-Site`, then start
   Claude Code from inside that folder. It reads `claude.md` automatically
   and already knows the workflow — no extra setup per session.
6. Point them at `WELCOME.md` (or walk through it together) — that's their
   reference for how previews and publishing work.

From here, every change is a conversation: the client describes what they
want, Claude previews it, they approve, Claude publishes. See `claude.md`
for exactly what Claude does behind the scenes.

## Guardrails (why they exist)

- **The repo is public, and always must be** — it's what makes GitHub Pages
  serve the site on the free plan this template assumes. There's no private
  mode to fall back on here. That means nothing committed to it is private:
  Claude is instructed to skim for obvious credentials before publishing,
  and the auto-publish Action blocks obviously credential-shaped content
  (API keys, private keys, tokens) as a backstop. Neither is a substitute
  for not pasting secrets into the site in the first place.
- `CNAME` and `.github/workflows/**` are off-limits to self-service edits —
  a bad domain value or a rewritten workflow can silently take the site
  offline or break the publish pipeline. The Action blocks these from
  auto-merging; changes to them go through doxDev directly.
- Everything else — including the legal pages — is the client's to edit
  freely through Claude.

Full rationale and the exact rules Claude follows live in `claude.md`.
