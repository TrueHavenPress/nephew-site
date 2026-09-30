/**
 * @OnlyCurrentDoc
 *
 * WEBSITE CONTACT FORM → EMAIL
 *
 * When someone fills in the contact form on your website, this script:
 *   1. emails the message to you,
 *   2. sends the visitor a short "thanks, we got your message" reply
 *      from YOUR Google email address, and
 *   3. saves a copy of the message in this spreadsheet.
 *
 * Setup instructions: docs/contact-form/google-apps-script.md
 *
 * The only part you need to change is the "YOUR SETTINGS" section just
 * below. Change the words between the 'quote marks' and nothing else.
 * After any change, create a new version: Deploy → Manage deployments →
 * pencil icon → Version: "New version" → Deploy.
 */

// ===================== YOUR SETTINGS =====================

var SETTINGS = {

  // Where new messages from the website should go.
  // Leave it as '' to use the Google account you set this up with.
  NOTIFY_EMAIL: '',

  // Subject line of the email YOU receive for each new message.
  NOTIFY_SUBJECT: 'New message from your website',

  // Your name or business name. The automatic reply shows as coming from this.
  FROM_NAME: 'Your Business Name',

  // Send the visitor an automatic reply? true = yes, false = no.
  SEND_AUTO_REPLY: true,

  // Subject line of the automatic reply.
  AUTO_REPLY_SUBJECT: 'Thanks, we got your message',

  // The automatic reply itself. {name} becomes the visitor's first name
  // (or "there" if they didn't give one). Keep each line inside quote marks,
  // and keep the + at the end of every line except the last.
  AUTO_REPLY_MESSAGE:
    'Hi {name},\n\n' +
    'Thanks for getting in touch. This is a quick note to let you know ' +
    'your message arrived safely.\n\n' +
    'We usually reply within one or two business days.\n\n' +
    'Your Business Name',

  // Save every message in this spreadsheet too? true = yes, false = no.
  SAVE_TO_SHEET: true

};

// ============ ADVANCED: leave these alone unless your site admin asks ============

var ADVANCED = {
  // Hidden "trap" field on the form. Real people never fill it in; spam bots do.
  HONEYPOT_FIELD: 'company',

  // Only send the automatic reply when Cloudflare Turnstile has confirmed
  // the visitor is a person. Has no effect until a Turnstile key is added
  // (see docs/contact-form/turnstile.md).
  AUTO_REPLY_NEEDS_TURNSTILE: true,

  // At most one automatic reply to the same address every this many hours (6 at most).
  AUTO_REPLY_HOURS_PER_ADDRESS: 6,

  // At most this many automatic replies per day, in total.
  AUTO_REPLY_DAILY_LIMIT: 25,

  // Name of the tab in this spreadsheet that messages are saved to.
  SHEET_NAME: 'Messages'
};

// =================== The rest of the script: no changes needed ===================

var IGNORED_FIELDS = ['cf-turnstile-response', 'g-recaptcha-response', 'h-captcha-response'];
var EMAIL_PATTERN = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;
var MAX_FIELDS = 30;
var MAX_VALUE_LENGTH = 5000;

/** The website sends each form here. */
function doPost(e) {
  try {
    var data = (e && e.parameter) || {};

    // Spam trap filled in: pretend it worked so the bot moves on.
    if (String(data[ADVANCED.HONEYPOT_FIELD] || '').trim() !== '') {
      return respond_(true);
    }

    var turnstileSecret = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
    var turnstilePassed = false;
    if (turnstileSecret) {
      if (!turnstileOk_(turnstileSecret, data['cf-turnstile-response'])) {
        return respond_(false, 'spam-check-failed');
      }
      turnstilePassed = true;
    }

    var fields = cleanFields_(data);
    if (!Object.keys(fields).length) {
      return respond_(false, 'empty');
    }

    var visitorEmail = String(data.email || data.Email || '').trim();
    if (!EMAIL_PATTERN.test(visitorEmail) || visitorEmail.length > 254) {
      visitorEmail = '';
    }

    if (SETTINGS.SAVE_TO_SHEET) {
      saveToSheet_(fields);
    }

    notifyOwner_(fields, visitorEmail, data.name);

    var autoReplyAllowed = turnstilePassed || !turnstileSecret || !ADVANCED.AUTO_REPLY_NEEDS_TURNSTILE;
    if (SETTINGS.SEND_AUTO_REPLY && visitorEmail && autoReplyAllowed) {
      try {
        if (MailApp.getRemainingDailyQuota() > 0 && autoReplyWithinLimits_(visitorEmail)) {
          sendAutoReply_(visitorEmail, data.name);
        }
      } catch (err) {
        // The message itself was delivered; a failed thank-you shouldn't fail the form.
        console.error('Auto-reply not sent: ' + err);
      }
    }

    return respond_(true);
  } catch (err) {
    console.error(err);
    return respond_(false, 'server-error');
  }
}

/** Opening the web app link in a browser shows this, so you can tell it's live. */
function doGet() {
  return ContentService.createTextOutput(
    'Your contact form connection is working. Give this link to your site admin.'
  );
}

/**
 * Run this once from the editor (choose "sendTestEmail" in the menu at the
 * top, then click Run). It asks for permission, then sends you a sample of
 * both emails and adds a sample row to the spreadsheet.
 */
function sendTestEmail() {
  var sample = {
    name: 'Test Visitor',
    email: ownerEmail_(),
    message: 'This is a test message. If you can read this, the contact form is set up.'
  };
  if (SETTINGS.SAVE_TO_SHEET) {
    saveToSheet_(sample);
  }
  notifyOwner_(sample, sample.email, sample.name);
  if (SETTINGS.SEND_AUTO_REPLY) {
    sendAutoReply_(ownerEmail_(), 'Test');
  }
  console.log('Done. Check ' + ownerEmail_() + ' for two test emails.');
}

function ownerEmail_() {
  return String(SETTINGS.NOTIFY_EMAIL || '').trim() || Session.getEffectiveUser().getEmail();
}

function turnstileOk_(secret, token) {
  if (!token) return false;
  var res = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: String(token) },
    muteHttpExceptions: true
  });
  try {
    return JSON.parse(res.getContentText()).success === true;
  } catch (err) {
    return false;
  }
}

function cleanFields_(data) {
  var fields = {};
  var names = Object.keys(data);
  for (var i = 0; i < names.length && Object.keys(fields).length < MAX_FIELDS; i++) {
    var key = names[i];
    if (key === ADVANCED.HONEYPOT_FIELD || key.charAt(0) === '_' || IGNORED_FIELDS.indexOf(key) !== -1) {
      continue;
    }
    var value = String(data[key] == null ? '' : data[key]).trim().slice(0, MAX_VALUE_LENGTH);
    if (value) {
      fields[key.slice(0, 60)] = value;
    }
  }
  return fields;
}

function saveToSheet_(fields) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = spreadsheet.getSheetByName(ADVANCED.SHEET_NAME) || spreadsheet.insertSheet(ADVANCED.SHEET_NAME);
    var lastColumn = sheet.getLastColumn();
    var headers = lastColumn ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : ['Received'];

    Object.keys(fields).forEach(function (key) {
      if (headers.indexOf(key) === -1) headers.push(key);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);

    sheet.appendRow(headers.map(function (header) {
      if (header === 'Received') return new Date();
      var value = fields[header] || '';
      // Stop typed text like "=SUM(...)" being treated as a spreadsheet formula.
      return /^[=+\-@]/.test(value) ? "'" + value : value;
    }));
  } finally {
    lock.releaseLock();
  }
}

function notifyOwner_(fields, visitorEmail, visitorName) {
  var rows = Object.keys(fields).map(function (key) {
    return '<tr><th align="left" valign="top" style="padding:6px 12px 6px 0">' + escapeHtml_(labelFor_(key)) +
      '</th><td style="padding:6px 0;white-space:pre-wrap">' + escapeHtml_(fields[key]) + '</td></tr>';
  }).join('');
  var text = Object.keys(fields).map(function (key) {
    return labelFor_(key) + ': ' + fields[key];
  }).join('\n\n');

  var name = oneLine_(visitorName).slice(0, 60);
  var options = {
    to: ownerEmail_(),
    subject: SETTINGS.NOTIFY_SUBJECT + (name ? ' from ' + name : ''),
    body: text + (visitorEmail ? '\n\nHit Reply to answer ' + visitorEmail + ' directly.' : ''),
    htmlBody: '<table style="font:15px/1.5 Arial,sans-serif;border-collapse:collapse">' + rows + '</table>' +
      (visitorEmail ? '<p style="font:14px Arial,sans-serif;color:#555">Hit Reply to answer ' +
        escapeHtml_(visitorEmail) + ' directly.</p>' : ''),
    name: 'Website contact form'
  };
  if (visitorEmail) options.replyTo = visitorEmail;
  MailApp.sendEmail(options);
}

function sendAutoReply_(to, visitorName) {
  var message = SETTINGS.AUTO_REPLY_MESSAGE.replace(/\{name\}/g, safeFirstName_(visitorName));
  MailApp.sendEmail({
    to: to,
    subject: SETTINGS.AUTO_REPLY_SUBJECT,
    body: message,
    htmlBody: '<div style="font:15px/1.6 Arial,sans-serif;white-space:pre-wrap">' + escapeHtml_(message) + '</div>',
    name: SETTINGS.FROM_NAME,
    replyTo: ownerEmail_()
  });
}

/** Caps automatic replies so the form can't be used to flood someone's inbox. */
function autoReplyWithinLimits_(email) {
  var cache = CacheService.getScriptCache();
  var addressKey = 'replied:' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase())
  );
  if (cache.get(addressKey)) return false;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var props = PropertiesService.getScriptProperties();
    var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    var counter = JSON.parse(props.getProperty('AUTO_REPLY_COUNT') || '{}');
    var count = counter.day === today ? counter.count : 0;
    if (count >= ADVANCED.AUTO_REPLY_DAILY_LIMIT) return false;
    props.setProperty('AUTO_REPLY_COUNT', JSON.stringify({ day: today, count: count + 1 }));
  } finally {
    lock.releaseLock();
  }

  // Cache entries can last at most 6 hours.
  cache.put(addressKey, '1', Math.min(ADVANCED.AUTO_REPLY_HOURS_PER_ADDRESS, 6) * 3600);
  return true;
}

/** Only use the visitor's name in the reply if it looks like a real first name. */
function safeFirstName_(name) {
  var first = oneLine_(name).split(' ')[0];
  return /^[A-Za-zÀ-ɏ'’-]{1,30}$/.test(first) ? first : 'there';
}

function labelFor_(key) {
  var label = key.replace(/[_-]+/g, ' ').trim();
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function oneLine_(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function respond_(ok, error) {
  return ContentService
    .createTextOutput(JSON.stringify(ok ? { ok: true } : { ok: false, error: error }))
    .setMimeType(ContentService.MimeType.JSON);
}
