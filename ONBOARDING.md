# Onboarding a new site from this template

This file is for whoever (a human, or Claude Code acting on their behalf) is
standing up a brand-new client site from this template. It is not part of the
client-facing product — delete it once onboarding is done, or leave it, it's
harmless either way.

## 1. Generate the repo

```
gh repo create <ORG>/<Name>-Site --public --template <this-repo> --clone
```

Match the existing naming convention: client initials + `-Site` (e.g.
`THP-Site`, `PBE-Site`).

**Keep `--public`.** GitHub Pages, as set up here, requires a public repo —
there's no private-repo fallback on the free plan this template assumes. That
means everything ever committed to the new repo is world-readable, including
history. If a client asks for a private repo, that's a different plan
(GitHub Pro/Team with private Pages) and isn't what this template supports.

## 2. Replace placeholders

Find and replace across `claude.md`, `WELCOME.md`:

- `[CLIENT NAME]` → the business name
- `[OWNER NAME]` → the non-technical person who will talk to Claude
- `[DOMAIN]` → the site's domain, e.g. `example.com`
- `[one-line description of brand/tone]` in `claude.md` → a short line
  describing the brand voice

## 3. Add the domain

- Add a `CNAME` file at the repo root containing just the domain, e.g.
  `example.com` (no `https://`, no trailing slash).
- In the repo's Settings → Pages, set the source to "Deploy from a branch",
  branch `main`, and set the custom domain to match `CNAME`.

**Do not point live DNS at GitHub Pages until the site is actually ready to
go live.** Adding the `CNAME` file and enabling Pages is safe to do early —
it just makes the GitHub Pages URL live, not the custom domain. The DNS
cutover at the registrar (pointing the domain's A/CNAME records at GitHub
Pages) is a separate, deliberate step to take only when the content is ready
and the client has been told to expect the switch.

## 4. Confirm the automation works

- `gh auth status` should show a logged-in, active account with access to
  create branches/PRs on the new repo.
- The `.github/workflows/auto-publish.yml` guardrail list
  (`^(CNAME$|\.github/workflows/)`) should match this repo's protected files —
  it ships generic and usually doesn't need editing.

## 5. Get the client set up

Walk the client through installing Git, the GitHub CLI, and Claude Code, then
cloning their new repo and opening it in Claude Code. Full steps for this are
in [README.md](README.md#getting-the-client-set-up-on-their-machine) — it's
the same every time regardless of client, so it isn't duplicated here.

## 6. Starter content

The template ships with a minimal placeholder homepage, a 404 page, and
skeleton legal pages. Real content gets built the same way every other change
does afterward: page by page, through normal self-service requests — not as
one big migration commit.

## 7. Clean up

Delete this `ONBOARDING.md` file once the above is done (optional).
