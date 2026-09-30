# Set up your contact form with Basin

Basin is a company that receives your website's form messages and emails them
to you. You manage everything on their website: no code, nothing to install.

It's the best choice if you have **your own domain email** (like
`you@yourname.com`) and want the thank-you email to come **from that exact
address**.

- The **thank-you email** (Basin calls it an **auto-response**) needs the
  **Growth** plan or higher.
- Sending from **your own domain** needs the **Pro** plan or higher.
- Check **[usebasin.com/pricing](https://usebasin.com/pricing)** for today's
  prices; plans change from time to time.

Time needed: about **15 minutes**, plus about 15 more if you set up your own
domain.

---

## Step 1: Create your account and form

1. Go to **[usebasin.com](https://usebasin.com)** and click **Sign up**. Use
   the email address you want messages sent to, and confirm it when Basin
   emails you.
2. Click **New form** (or **Create form**). Give it a name, such as
   **Website contact form**.
3. Open the form. Its **endpoint** is shown near the top (look for **Setup**
   or **Integration** if not): an address like `https://usebasin.com/f/abc123`.
   Copy it.

## Step 2: Send the endpoint to your site admin

Email that `https://usebasin.com/f/...` address to your site admin. It isn't
a password and is fine to send by normal email: it ends up visible on your
website anyway. They'll connect it to your site's form.

## Step 3: Test it

Once your site admin says it's connected, fill in the form on your own website.
You should get the message by email, and see it in Basin under the form's
**Submissions**. Check your Spam folder if nothing arrives.

## Step 4: Turn on the thank-you email (Growth plan or higher)

1. In Basin, go to **Forms**, open your form, then click **Emails**.
2. In the left-hand list, click **Auto-response**.
3. Turn it on and fill in the sender name, reply-to address (your own email),
   subject and message. Keep it short and friendly, e.g. *"Thanks for getting
   in touch. Your message arrived safely and I'll reply within a couple of
   days."*
4. Save, then send yourself a test through your website using a *different*
   email address.

## Step 5 (optional): Send from your own domain (Pro plan or higher)

This makes the thank-you come from, say, `hello@yourname.com` rather than
Basin's address. It only works with **a domain you own**, not Gmail, Yahoo or
Outlook addresses.

1. In Basin, find **Custom email sending domains** (usually under your
   account or team **Settings**, in an **Email** or **Domains** section).
2. Add your domain, e.g. `yourname.com`. Basin shows you a few **DNS records**
   (with names like **DKIM** and **Return-Path**).
3. These records are added where your domain is managed (GoDaddy, Namecheap,
   Squarespace Domains, Cloudflare, etc.). **This is the one step most people
   hand to their site admin**: forward them Basin's list of records.
4. Back in Basin, click **Verify**. It can take up to 30 minutes.
5. Once verified, choose that address as the sender for the auto-response.

## Spam protection

Basin has its own spam filter. For extra protection, and **strongly
recommended once thank-you emails are on**, add Cloudflare Turnstile:

1. Follow the [Turnstile guide](turnstile.md) to get a **site key** and **secret
   key**, or ask your site admin to.
2. In Basin, open your form, go to **Settings → Spam**, paste the **secret key**
   and switch on **Require a valid Turnstile response**. Save.
3. Send the **site key** to your site admin to add to the website. Do this
   straight away: until the website has the site key, Basin will reject
   messages.

## Troubleshooting

**Nothing arrives.** Check Spam, then check the form's **Submissions** in Basin.
If messages are there, the website side works and it's an email issue: check
the notification email address in the form's **Emails** settings.

**Real messages are landing in Basin's spam list.** Open them and mark them as
not spam so the filter learns.
