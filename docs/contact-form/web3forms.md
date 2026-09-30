# Set up your contact form with Web3Forms

Web3Forms is a low-cost service that receives your website's form messages and
emails them to you. It's the quickest to start: there's no password, just
your email address.

- **Free plan:** you receive messages by email, with a generous monthly limit.
- **Pro plan:** adds the automatic **thank-you email** to visitors and the
  Cloudflare Turnstile spam filter. Check
  **[web3forms.com/pricing](https://web3forms.com/pricing)** for today's prices.

Time needed: about **10 minutes**.

> **Where do the thank-you emails come from?** From Web3Forms' email system,
> showing **your name or business name** as the sender. They won't show your
> own email address as the sender. If you want that, see the
> [free Google option](google-apps-script.md) (Gmail) or [Basin](basin.md)
> (your own domain).

---

## Step 1: Get your access key

1. Go to **[web3forms.com](https://web3forms.com)**.
2. Enter the email address you want messages sent to and click **Create
   Access Key** (or similar).
3. Web3Forms emails you an **access key**: a long string of letters, numbers
   and dashes.

**This key is not a password.** It's designed to sit on your website, and all
it does is tell Web3Forms which inbox to deliver to. It's fine to send it to
your site admin by normal email.

## Step 2: Send the access key to your site admin

Forward the email with the access key to your site admin. They'll connect it
to the form on your website.

## Step 3: Test it

Once your site admin says it's connected, fill in the form on your own website.
The message should arrive in your inbox. Check Spam if it doesn't, and mark it
"Not spam".

## Step 4: Turn on the thank-you email (Pro plan)

1. Sign in to the Web3Forms dashboard at **[app.web3forms.com](https://app.web3forms.com)**
   using the same email address.
2. Upgrade to **Pro** if you haven't.
3. Open your form's **Settings** and find **Autoresponder**.
4. Turn it on and fill in:
   - **From name:** your name or business name.
   - **Subject** and **intro text:** a short, friendly note, e.g. *"Thanks for
     getting in touch. Your message arrived safely and we'll reply within a
     couple of days."*
   - Optionally, the web address of your **logo**.
5. Save, then send yourself a test through your **live** website, using a
   *different* email address. (The thank-you isn't sent from test or preview
   copies of the site, only the live one.)

## Spam protection

Web3Forms has a basic spam filter on every plan. Cloudflare Turnstile is a
**Pro** feature:

1. Follow the [Turnstile guide](turnstile.md) to get a **site key** and **secret
   key**, or ask your site admin to.
2. In the Web3Forms dashboard, open your form's **Settings**, find the
   **Cloudflare Turnstile** / CAPTCHA section, and paste the **secret key**. Save.
3. Send the **site key** to your site admin to add to the website. Do this
   straight away: until the website has it, Web3Forms will reject messages.

## Troubleshooting

**Nothing arrives.** Check Spam. Make sure your site admin used the access key
from the most recent email: if you requested a key twice, each one is
different.

**Want to change the email address messages go to?** Change it in the
dashboard, or create a new access key and send it to your site admin.
