# Stop spam with Cloudflare Turnstile (free)

Turnstile is a free spam filter from Cloudflare. It checks in the background
that the person filling in your form is a real person, not a robot. Most
visitors never see it; occasionally someone is asked to tick a box.

It matters more once your form sends thank-you emails. Without a filter,
robots can type strangers' email addresses into your form so that *your*
address sends them mail. That can land your emails in spam folders.

**Usually your site admin does this part** and sends you one key to paste in.
This guide is here if you'd like to do it yourself, or want to know what
they're doing.

Time needed: about **10 minutes**. Cost: **free**. Your website does *not* need
to be hosted by Cloudflare.

---

## How it works, in one paragraph

Turnstile gives you **two keys**:

- a **site key**, which goes on your website. It's public, like your address
  on a letter.
- a **secret key**, which goes into your form service (Google, Formspree,
  Basin or Web3Forms) so it can double-check each message with Cloudflare.
  It's private, like a password. **Never put the secret key on your website
  or anywhere public.**

## Step 1: Create a free Cloudflare account

1. Go to **[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)**.
2. Enter your email address and a password, then confirm your email when
   Cloudflare sends you a link.
3. If Cloudflare asks you to add a website or domain, **skip it**. You don't
   need to move anything to Cloudflare for Turnstile.

## Step 2: Create a Turnstile widget

1. In the Cloudflare dashboard, find **Turnstile** in the left-hand menu. It
   may be inside a section called **Application security** or **Protect &
   Connect**. If you can't find it, use the search box at the top and type
   **Turnstile**.
2. Click **Add widget** (or **Add site**).
3. Fill in:
   - **Widget name:** your website's name, e.g. `My website`.
   - **Hostnames:** add your website's address *without* `https://` or `www`,
     e.g. `yourbusiness.com`. Your site admin may ask you to add a second
     one ending in `github.io` too: add each one separately.
   - **Widget mode:** **Managed** (recommended).
   - If asked about **pre-clearance**, choose **No**.
4. Click **Create**.

You'll now see a **Site Key** and a **Secret Key**, each with a copy button.

## Step 3: Hand the keys to the right places

- **Site key → your site admin.** They add it to the form on your website.
  Fine to send by normal email.
- **Secret key → your form service.** Where it goes depends on the option you
  chose:
  - **Google (free option):** [Step 8 of the Google guide](google-apps-script.md#step-8-recommended-add-spam-protection)
  - **Formspree:** [see the Formspree guide](formspree.md#spam-protection)
  - **Basin:** [see the Basin guide](basin.md#spam-protection)
  - **Web3Forms:** [see the Web3Forms guide](web3forms.md#spam-protection)

  If your site admin is setting this up for you, they'll either put it in
  themselves or send it to you privately. It should never be posted on the
  website.

## Step 4: Check it works

Once your site admin says the form is updated, fill in your own contact form.
The message should arrive as usual. If your site admin or the form service
says messages are being **rejected**, the most common cause is a missing
hostname in Step 2: add the website address exactly as it appears in the
browser's address bar.

## Can I see what it's blocking?

Yes. In Cloudflare, open **Turnstile** and click your widget to see how many
visitors were checked and how many were stopped.

## Lost or leaked the secret key?

In Cloudflare, open your Turnstile widget, choose **Rotate secret key** (in the
widget's settings), and paste the new secret into your form service. The old
one stops working. The site key doesn't change, so your website needs no
update.
