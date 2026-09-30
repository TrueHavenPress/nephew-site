# Getting messages from your website's contact form

A website like yours can't send email by itself, so the contact form needs a
helper service to pass each message on. This folder explains the options and
how to set each one up. **You only need one.**

Whichever you choose:

- you'll get an email for every message, and can hit **Reply** to answer,
- the visitor can get an automatic **"thanks, we got your message"** email,
- **no passwords go on your website.** You set the service up in your own
  account, then send your site admin one web address (or key) that is safe to
  be public.

## Which one should I pick?

| | **Google** (recommended) | **Formspree** | **Basin** | **Web3Forms** |
|---|---|---|---|---|
| **Cost** | Free | Free to receive; paid for thank-you emails | Paid for thank-you emails | Free to receive; paid (Pro) for thank-you emails |
| **Thank-you email comes from** | **Your own email address** | Formspree, with your name on it | Basin, or **your own domain** on the Pro plan | Web3Forms, with your name on it |
| **You need** | A Gmail or Google Workspace account | Any email address | Any email address | Any email address |
| **Copy of every message** | In a Google spreadsheet | In your Formspree account | In your Basin account | In your inbox |
| **Setup time** | About 20 minutes | About 15 minutes | 15–30 minutes | About 10 minutes |
| **Guide** | [Google guide](google-apps-script.md) | [Formspree guide](formspree.md) | [Basin guide](basin.md) | [Web3Forms guide](web3forms.md) |

**In short:**

- **You use Gmail, or your business email is run by Google?** Use the
  **[Google option](google-apps-script.md)**. It's free and the thank-you comes
  from your real address.
- **You have your own domain email** (like `you@yourname.com`) **that isn't
  Google?** Use **[Basin](basin.md)** with its own-domain feature.
- **You just want the simplest thing and don't mind paying a little?** Use
  **[Formspree](formspree.md)** or **[Web3Forms](web3forms.md)**.

Not sure? Ask your site admin. They'll help you choose.

## Spam protection

Once your form sends thank-you emails, it's worth adding Cloudflare's free
spam filter, **Turnstile**, so robots can't use your form. It works with
all four options. Usually your site admin sets it up; the
**[Turnstile guide](turnstile.md)** explains it if you want to do it yourself.

## What your site admin does

After you finish your guide, send your site admin the web address or key it
tells you to. They connect it to your website. Technical notes for them are in
**[for-site-admins.md](for-site-admins.md)**.
