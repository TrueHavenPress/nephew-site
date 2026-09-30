# Set up your contact form with Formspree

Formspree is a company that receives your website's form messages and emails
them to you. You manage everything on their website: no code, nothing to
install.

- **Free plan:** you receive messages by email. A small number per month.
- **Paid plans:** add the automatic **thank-you email** to visitors. Check
  **[formspree.io/plans](https://formspree.io/plans)** for today's prices and
  which plan includes "autoresponses"; plans change from time to time.

Time needed: about **15 minutes**.

> **Where do the thank-you emails come from?** From Formspree's email system,
> showing **your name** as the sender, and **replies come back to you**. They
> won't show your exact email address as the sender unless your plan
> includes a custom sending domain *and* you own a domain (e.g.
> `you@yourname.com`, not Gmail). If you want the thank-you to come from your
> own Gmail, the [free Google option](google-apps-script.md) does that.

---

## Step 1: Create your account and form

1. Go to **[formspree.io](https://formspree.io)** and click **Get started**
   (or **Sign up**). Sign up with the email address you want messages sent to.
2. Confirm your email address when Formspree sends you a link. **Messages
   aren't delivered until you do.**
3. Click **+ New form** (or **Create form**).
4. Give it a name, such as **Website contact form**, and make sure the email
   shown is where you want messages sent. Click **Create form**.
5. You'll see your form's **endpoint**, an address like
   `https://formspree.io/f/abcdwxyz`. Copy it.

## Step 2: Send the endpoint to your site admin

Email that `https://formspree.io/f/...` address to your site admin. It isn't a
password and is fine to send by normal email: it ends up visible on your
website anyway. They'll connect it to the form on your site.

## Step 3: Test it

Once your site admin says it's connected, fill in the form on your own website.

- The **first** message may show a Formspree page asking you to confirm, or
  send you an email to confirm the form. Do what it asks. After that, messages
  flow straight to your inbox.
- Check your Spam folder if nothing arrives, and mark it "Not spam".

## Step 4: Turn on the thank-you email (paid plans)

1. Sign in to Formspree and open your form.
2. Look for **Autoresponse** in the form's tabs or settings (it may be under
   **Workflow**, **Plugins** or **Settings**, depending on Formspree's current
   layout). If it's greyed out or asks you to upgrade, your plan doesn't
   include it.
3. Turn it on and fill in:
   - **From name:** your name or business name.
   - **Reply-to:** your own email address, so replies come to you.
   - **Subject** and **message:** a short, friendly note, e.g. *"Thanks for
     getting in touch. Your message arrived safely and I'll reply within a
     couple of days."*
4. Save, then send yourself a test through your website using a *different*
   email address.

Keep the thank-you short and plain. Avoid links, all-caps and words like
"free" or "offer", which make it more likely to land in spam.

## Spam protection

Formspree has its own spam filter, switched on by default. For extra
protection, and **strongly recommended once thank-you emails are on**, add
Cloudflare Turnstile:

1. Follow the [Turnstile guide](turnstile.md) to get a **site key** and **secret
   key**, or ask your site admin to.
2. In Formspree, open your form's **Settings** and find the **CAPTCHA** or spam
   section. Choose **Cloudflare Turnstile** and paste the **secret key**. Save.
3. Send the **site key** to your site admin to add to the website. Do this
   straight away: until the website has the site key, Formspree will
   reject messages.

## Troubleshooting

**Nothing arrives.** Did you confirm your email (Step 1.2) and the form (Step 3)?
Check Spam. In Formspree, open your form's **Submissions**: if messages are
listed there, the website side is working and it's an email delivery issue.

**Messages are marked as spam in Formspree.** Open **Submissions**, find the
Spam view and mark them as not spam, so the filter learns.

**I hit the monthly limit.** Messages over the limit may not be delivered.
Upgrade in Formspree, or ask your site admin about the free Google option.
