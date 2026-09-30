# Contact form: notes for the site admin

Technical companion to the owner-facing guides in this folder. The owner does
the account setup in their own account; you wire the site to whatever they send
back. **Nothing secret ever goes in this repo**. It's public, and everything
below is designed so the only values on the page are ones that are public by
design.

| Option | What the owner sends you | Goes on the page | Secret lives in |
|---|---|---|---|
| Google Apps Script | `https://script.google.com/macros/s/…/exec` | Form endpoint | Owner's Google account (the script runs as them) |
| Formspree | `https://formspree.io/f/…` | Form `action` | Formspree |
| Basin | `https://usebasin.com/f/…` | Form `action` | Basin |
| Web3Forms | Access key (UUID) | Hidden `access_key` field | Web3Forms (the access key is public by design) |
| Turnstile (any of the above) | Site key | `data-sitekey` | Secret key: Script Properties / service dashboard / n8n credential |

Field names the owner-side configs assume: **`name`**, **`email`** (used for
the auto-reply and Reply-To), anything else is passed through as-is. The Apps
Script treats **`company`** as the honeypot (configurable in its `ADVANCED`
block).

---

## Google Apps Script

The owner follows [google-apps-script.md](google-apps-script.md) and sends you
the `/exec` URL. Opening that URL in a browser (GET) should show *"Your contact
form connection is working."*

### Wiring it up

Post the form as **`application/x-www-form-urlencoded`** (wrap the `FormData`
in `URLSearchParams`). That keeps it a CORS "simple request" (no preflight,
which Apps Script can't answer) and populates `e.parameter`, which
`multipart/form-data` doesn't reliably do. The endpoint 302-redirects to
`script.googleusercontent.com`, which serves the JSON with
`Access-Control-Allow-Origin: *`, so the default `fetch` redirect handling
reads it fine.

The script always answers HTTP 200, so check the JSON body:

- `{ "ok": true }`: delivered (also returned for honeypot hits, on purpose)
- `{ "ok": false, "error": "spam-check-failed" | "empty" | "server-error" }`

### What's already wired in these sites

Both forms are ready; connecting them is a matter of pasting values in.

**nephew-site** (`contact.html`, Google Apps Script). Near the bottom of the
page, set:

```js
const FORM_ENDPOINT = "https://script.google.com/macros/s/…/exec";
const TURNSTILE_SITE_KEY = "";   // the public site key, once Turnstile is set up
```

The page posts URL-encoded and checks the `{ ok }` JSON, then goes to
`thank-you.html`. **Photos** are shrunk in the browser to JPEGs of at most
1600 px on the long side (max 5), sent as data URLs in `photo_1…photo_5`,
and attached to the owner's notification email by the script (15 MB cap in
total). They're not saved in the sheet. Files the browser can't decode (e.g.
HEIC on desktop Chrome) are skipped, and the email says how many. It keeps
the existing honeypot (`company`) and 3-second timing check; if
`TURNSTILE_SITE_KEY` is set, it injects the widget and waits for a token.
This endpoint is Apps Script-specific: if the owner picks a different
service instead, the photo handling would need reworking (file uploads are a
paid feature on the form services anyway).

**SB-Site** (`contact-sherry-blackman/index.html`, any service). Set the
form's `action` to the endpoint and, optionally, `data-turnstile-sitekey` to
the site key, then delete the yellow editor note:

```html
<form class="form" id="contactForm" method="POST" action="https://…"
      data-turnstile-sitekey="">
```

The script picks the request format from the `action`: a
`script.google.com` address gets a URL-encoded body and a `{ ok }` check;
anything else (Formspree, Basin, Web3Forms) gets `FormData` with
`Accept: application/json` and an HTTP status check. Success shows an inline
thank-you and clears the form. For **Web3Forms**, also add
`<input type="hidden" name="access_key" value="…">` inside the form.

### Generic snippet for other plain HTML forms

A plain form POST to Apps Script would navigate the visitor to the raw JSON,
so it needs a few lines of script:

```js
fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
  .then(function (r) { return r.json(); })
  .then(function (res) { if (!res.ok) throw new Error(res.error); /* success */ })
  .catch(function () { /* show an error; if (window.turnstile) turnstile.reset(); */ });
```

`URLSearchParams(new FormData(form))` drops file inputs (they become
`[object File]`), so use nephew-site's approach if the form takes photos.
Add a honeypot so the script's first spam check has something to catch:

```html
<div style="position:absolute;left:-9999px" aria-hidden="true">
  <label>Company <input type="text" name="company" tabindex="-1" autocomplete="off"></label>
</div>
```

### Things to know

- **Sender.** Mail goes out via `MailApp` as the Google account that deployed
  the web app ("Execute as: Me"). The owner notification has Reply-To set to
  the visitor; the auto-reply has Reply-To set to `NOTIFY_EMAIL`.
- **Quota.** `MailApp` counts recipients per day: about 100 on consumer Gmail,
  about 1,500 on Workspace. Each submission costs 2. When quota runs out, the
  submission is still saved to the sheet.
- **Abuse limits** (in the script's `ADVANCED` block): one auto-reply per
  address per 6 h (`CacheService`), 25 auto-replies per day total, the
  auto-reply text is fixed (the visitor's message is never echoed back), and
  `{name}` is only filled in if it looks like a plain first name. Once a
  `TURNSTILE_SECRET` Script Property is set, every submission must pass
  Turnstile, and auto-replies are only sent for verified submissions.
- **Scopes.** `@OnlyCurrentDoc` limits spreadsheet access to the bound sheet.
  The consent screen also asks for send-mail, external requests (Turnstile
  `siteverify`) and the owner's email address.
- **Workspace accounts** may block unverified apps or "Anyone" web-app access
  by admin policy. See the guide's troubleshooting section.
- **Updating the script.** It lives in the owner's account, not this repo.
  Send them the new `contact-form.gs`. Re-pasting **overwrites their
  `SETTINGS`**, so have them copy their settings block first, then
  *Deploy → Manage deployments → Edit → New version*. The `/exec` URL is
  stable across versions; a *new deployment* would get a new URL.
- **Sheet formulas.** Values starting with `= + - @` are prefixed with `'` so
  submissions can't inject spreadsheet formulas.
- `docs/contact-form/contact-form.gs` has no test harness in this repo. If you
  change it, test with `sendTestEmail` in the editor and a real submission
  (with a photo).

## Formspree / Basin

Plain HTML works as-is: set the form `action` to the endpoint. The visitor
lands on the service's own thank-you page (custom redirects are a paid feature
on Formspree; Basin has a redirect setting per form).

To stay on the page, submit with `fetch` and ask for JSON:

```js
fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
  .then(function (r) { if (!r.ok) throw new Error(r.status); /* success */ });
```

Auto-replies, custom sending domains and CAPTCHA secrets are all configured in
the service dashboard; see [formspree.md](formspree.md) and [basin.md](basin.md).
The auto-reply is sent to the field named `email`.

## Web3Forms

```html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="OWNER-ACCESS-KEY">
  …fields, including name="email"…
</form>
```

The access key only identifies the destination inbox and is meant to be public.
Auto-reply and Turnstile are Pro features configured in the dashboard; the
auto-reply only fires from the production hostname, not localhost or previews.

## Cloudflare Turnstile

Owner- or admin-facing setup: [turnstile.md](turnstile.md). One free
Cloudflare account can hold widgets for every site. List each hostname the
site is served from, including the `*.github.io` address if it's used.

Add to the page, inside the `<form>`:

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
…
<div class="cf-turnstile" data-sitekey="SITE-KEY"></div>
```

The widget injects a hidden `cf-turnstile-response` input, so `new FormData(form)`
picks it up automatically. Tokens are single-use: call `turnstile.reset()`
after any failed submit so a retry gets a fresh token.

**Turn verification on in the backend at the same time as the widget goes
live**. Once the secret is set, every submission without a valid token is
rejected, so deploy the widget first (or within minutes of) setting the
secret.

**Testing:** Cloudflare's documented dummy keys:

| | Site key | Secret key |
|---|---|---|
| Always passes | `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` |
| Always fails | `2x00000000000000000000AB` | `2x0000000000000000000000000000000AA` |

### n8n (THP-Site)

Same idea for the existing webhook: after the Webhook node, add an **HTTP
Request** node:

- `POST https://challenges.cloudflare.com/turnstile/v0/siteverify`
- Body (form-urlencoded): `secret` = the Turnstile secret (store it as an n8n
  credential or variable, not inline in the workflow), `response` =
  `{{ $json.body["cf-turnstile-response"] }}`

Then an **IF** node on `{{ $json.success }}`; the false branch goes to
**Respond to Webhook** with a 4xx and stops. Add the widget to
`submit-manuscript.html` and call `turnstile.reset()` in its error path. For an
auto-reply from the publisher's address, store their SMTP login as an n8n SMTP
credential and add a Send Email node on the true branch.
