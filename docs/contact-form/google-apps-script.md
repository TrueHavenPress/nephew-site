# Set up your contact form with Google (free)

This guide connects your website's contact form to your own Google account.
Once it's done, every time someone fills in the form:

- **you get an email** with their message, and you can hit **Reply** to answer them,
- **they get a short "thanks, we got your message" email** sent from *your*
  email address, and
- **a copy is saved** in a Google spreadsheet, so nothing gets lost.

**It's free** and there's nothing to install. It takes about **20 minutes**,
once. You don't need to understand any of it: just follow the steps in order.

> **Who this is for:** anyone with a Gmail address (like `name@gmail.com`), or
> a business email run by Google Workspace. If your email is with someone else
> (Outlook, Yahoo, your web host), see [the other options](README.md) instead.

---

## Before you start

You need:

- A computer (not a phone) with **Google Chrome** or another web browser.
- To be **signed in to the Google account** whose email address you want the
  messages to come from and go to. If you have more than one Google account,
  check the round picture in the top-right corner of any Google page to see
  which one you're in.
- About 20 minutes.

At the end you'll have **one web link** to send to your site admin. That's the
only thing you hand over. You never share your password with anyone.

---

## Step 1: Create the spreadsheet

1. Go to **[sheets.new](https://sheets.new)**. A new, empty Google spreadsheet opens.
2. Click **Untitled spreadsheet** in the top-left corner and type a name, such as
   **Website messages**. Press Enter.

This spreadsheet is where the script lives and where copies of your messages
will be saved. Don't delete it later: if you do, the form stops working.

## Step 2: Open the script editor

1. In the spreadsheet's menu bar, click **Extensions**, then **Apps Script**.
2. A new browser tab opens with a code editor. You'll see a file called
   **Code.gs** containing a few lines like `function myFunction() { }`.
3. At the top-left, click **Untitled project** and rename it to
   **Contact form**. Click **Rename**.

## Step 3: Paste in the script

1. Open the script file:
   **[contact-form.gs](contact-form.gs)** (it's in the same folder as this guide).
2. Copy all of it. On GitHub, the easiest way is the **Copy raw file** button
   (it looks like two overlapping squares) near the top-right of the file.
   Your site admin can also email you the file instead.
3. Go back to the Apps Script tab. Click inside the code area, select
   everything that's there (**Ctrl + A** on Windows, **Cmd + A** on a Mac), and
   press **Delete**, so the editor is completely empty.
4. Paste (**Ctrl + V** or **Cmd + V**).
5. Click the **Save** icon (a floppy disk) above the code, or press **Ctrl + S** / **Cmd + S**.

## Step 4: Change your settings

Near the top of the script is a section headed **YOUR SETTINGS**. Change the
words **between the quote marks** and nothing else. Keep the quote marks, commas
and `+` signs exactly where they are.

| Setting | What to put there |
|---|---|
| `NOTIFY_EMAIL` | Leave it as `''` to receive messages at the Google account you're using now. To send them somewhere else, put that address between the quotes, e.g. `'me@example.com'`. |
| `NOTIFY_SUBJECT` | The subject of the emails *you* get. The default is fine. |
| `FROM_NAME` | **Change this.** Your name or business name, e.g. `'Sam\'s Bakery'`. This is who the thank-you email appears to be from. |
| `SEND_AUTO_REPLY` | `true` to send visitors a thank-you email, `false` to not. |
| `AUTO_REPLY_SUBJECT` | The subject line of the thank-you email. |
| `AUTO_REPLY_MESSAGE` | **Change this.** The thank-you email itself. `{name}` is swapped for the visitor's first name. `\n\n` starts a new paragraph. |
| `SAVE_TO_SHEET` | `true` to keep a copy of every message in the spreadsheet. |

**If your text contains an apostrophe** (like *Sam's* or *we'll*), put a
backslash in front of it: `Sam\'s`, `we\'ll`. Otherwise the script thinks the
text has ended early.

Here's an example of a finished thank-you message:

```js
  AUTO_REPLY_MESSAGE:
    'Hi {name},\n\n' +
    'Thanks for reaching out to Sam\'s Bakery. Your message came ' +
    'through and we\'ll call or email you within one business day.\n\n' +
    'Talk soon,\n' +
    'Sam',
```

Leave the **ADVANCED** section alone.

Click **Save** again when you're done.

## Step 5: Send yourself a test (and give permission)

The first time the script runs, Google asks you to allow it to send email for
you. Doing it now with a test is the easiest way.

1. Above the code there's a drop-down menu next to the **Run** and **Debug**
   buttons. Click it and choose **sendTestEmail**.
2. Click **Run**.
3. A box says **Authorization required**. Click **Review permissions**.
4. Choose your Google account.
5. You'll see a warning: **"Google hasn't verified this app."** This is normal.
   It appears because *you* wrote this app (by pasting it) rather than a company
   that paid Google to review it. It isn't a virus or a scam.
   - Click **Advanced** (small text at the bottom-left).
   - Click **Go to Contact form (unsafe)**.
6. Google lists what the script will be able to do:
   - **Send email as you**: to send you each message and send the thank-you.
   - **See, edit… spreadsheets that this application has been installed in**:
     only *this* spreadsheet, to save a copy of each message.
   - **Connect to an external service**: to check with the spam filter
     (Cloudflare Turnstile) that the visitor is a real person.
   - **See your primary email address**: so it knows where to send messages.

   If there are tick boxes, tick **Select all**. Then click **Allow** (or **Continue**).
7. At the bottom of the screen an **Execution log** appears. After a few seconds
   it should say **Execution completed**.

**Check your email.** You should have **two** emails:

- one titled **New message from your website from Test Visitor** (what you'll get
  for each real message), and
- one with your thank-you subject line (what visitors will get).

Also look at your spreadsheet: there's a new tab called **Messages** with one
test row. You can delete that row.

If you don't see the emails within a couple of minutes, check your Spam folder,
then see [Troubleshooting](#troubleshooting).

## Step 6: Put it online

This step creates the web link your website will send messages to.

1. In the top-right of the Apps Script editor, click the blue **Deploy** button,
   then **New deployment**.
2. Next to **Select type**, click the **gear icon**, then choose **Web app**.
3. Fill in:
   - **Description:** `Contact form`
   - **Execute as:** **Me** (it shows your email address)
   - **Who has access:** **Anyone**

   "Anyone" means anyone can *send a message to* the form, the same as any
   contact form. It does **not** let anyone see your spreadsheet, your email
   or your account.
4. Click **Deploy**. If Google asks for permission again, repeat the steps
   from Step 5.
5. You'll see a **Deployment ID** and, under it, a **Web app** URL (link) that starts with `https://script.google.com/macros/s/` and ends with
   `/exec`. Click **Copy**.
6. Click **Done**.

**Check the link works:** paste it into a new browser tab. You should see:
*"Your contact form connection is working. Give this link to your site admin."*

## Step 7: Send the link to your site admin

Email or text that `/exec` link to your site admin. They'll connect it to the
form on your website. It's fine to send by normal email: the link isn't a
password, and it ends up visible on your website anyway.

Once they tell you it's connected, **fill in the form on your own website** as
if you were a customer, using a *different* email address from your own if you
have one. You should get the message, and the other address should get the
thank-you.

## Step 8 (recommended): Add spam protection

Your site admin may also give you a **Turnstile secret key** (a long string of
letters and numbers). It switches on Cloudflare's free spam filter, which
stops robots from filling in your form. If they send you one:

1. In the Apps Script editor, click the **gear icon** (**Project Settings**) in
   the left-hand bar.
2. Scroll down to **Script Properties** and click **Add script property**.
3. In **Property**, type exactly: `TURNSTILE_SECRET`
4. In **Value**, paste the key your site admin gave you.
5. Click **Save script properties**.

That's all: no need to deploy again. Keep this key private. Don't paste it
into the website, an email to a customer, or anywhere public.

Until this is added, the form still works. Robots are slowed down by a
hidden trap on the form, and the script limits how many thank-you emails it
will send in a day, but the spam filter is much better at stopping them.

---

## Changing things later

**To change your thank-you message or any other setting:**

1. Open your **Website messages** spreadsheet, then **Extensions → Apps Script**.
2. Edit the **YOUR SETTINGS** section and click **Save**.
3. **This step is easy to forget:** click **Deploy → Manage deployments**, click
   the **pencil icon** (Edit), open the **Version** drop-down, choose
   **New version**, and click **Deploy**.

Without step 3 the website keeps using the old version. The web link stays the
same, so there's nothing to send your site admin.

**To stop the form sending emails** (for example while you're on holiday):
set `SEND_AUTO_REPLY` to `false` and deploy a new version as above. You'll
still receive messages; visitors just won't get the thank-you.

## Limits worth knowing

- A free Gmail account can send to about **100 addresses a day** through a
  script; Google Workspace accounts can send to about **1,500**. Each message
  from your website uses two (one to you, one thank-you). That's roughly 50
  enquiries a day on a free account, far more than most small sites get.
- If the limit is reached, messages are still **saved in your spreadsheet**;
  the emails resume the next day.
- The thank-you email is only sent **once every 6 hours to the same address**,
  and at most **25 a day** in total, so the form can't be used to flood
  someone's inbox.

## Troubleshooting

**I don't see "Advanced" or "Go to Contact form (unsafe)".**
Your account may be a Google Workspace account where the administrator has
blocked unverified apps. Ask whoever manages your company's Google account to
allow it, or use [one of the other options](README.md).

**"Who has access" doesn't offer "Anyone", only people in my organisation.**
Same cause: your Workspace administrator has restricted it. Ask them to allow
web apps to be shared with anyone, or use [one of the other options](README.md).

**The test worked, but real messages from the website don't arrive.**
- Check your Spam folder.
- Open your spreadsheet: if the message is in the **Messages** tab, the
  connection works and it's an email problem (see limits above).
- If it's not in the spreadsheet, send your site admin the link again and ask
  them to check it matches, including the `/exec` on the end.
- In Apps Script, click **Executions** (the list icon in the left-hand bar) to
  see each time the form was used and any errors. You can send a screenshot of
  that page to your site admin.

**I changed the thank-you message but visitors still get the old one.**
You need to deploy a new version. See [Changing things later](#changing-things-later).

**The thank-you email goes to people's spam.**
Ask a few people to mark it "Not spam". Keep the message short and plain, and
avoid links, all-caps and words like "free" or "offer".

**The email I receive says "Website contact form" as the sender.** That's
deliberate, so you can tell website messages apart. Hitting **Reply** answers
the visitor, not the form.
