import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const MAX_MESSAGE_LENGTH = 5000;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });

const normalize = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\r\n/g, '\n').trim() : '';

const pickField = (data: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = normalize(data[key]);
    if (value) return value;
  }
  return '';
};

const parseBody = async (req: Request): Promise<Record<string, unknown>> => {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const json = await req.json();
    if (json && typeof json === 'object') {
      return json as Record<string, unknown>;
    }
    return {};
  }

  const form = await req.formData();
  const data: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') {
      data[key] = value;
    }
  }
  return data;
};

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await parseBody(req);
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  // --------------------------------------------------------------------------
  // SPAM PROTECTION - Tier 1: Honeypots, Time Validation, Content Filtering
  // --------------------------------------------------------------------------

  // 1. Honeypot checks - multiple trap fields bots commonly fill
  const honeypotFields = ['website', 'company_url', 'fax', 'address2'];
  for (const field of honeypotFields) {
    if (pickField(data, [field])) {
      // Silently succeed to not alert bot operators
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  }

  // 2. Time-based validation - reject submissions under 3 seconds
  const formTimestamp = pickField(data, ['_ts']);
  if (formTimestamp) {
    const submissionTime = parseInt(formTimestamp, 10);
    const timeDiff = Date.now() - submissionTime;
    const MIN_SUBMISSION_TIME_MS = 3000; // 3 seconds
    if (!isNaN(submissionTime) && timeDiff < MIN_SUBMISSION_TIME_MS) {
      // Too fast - likely a bot
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  }

  const name = pickField(data, ['name', 'fullName', 'fullname']);
  const phone = pickField(data, ['phone', 'phoneNumber', 'phone_number', 'tel']);
  const address = pickField(data, ['address', 'streetAddress']);
  const zipCode = pickField(data, ['zipCode', 'zip_code', 'zip']);
  const message = pickField(data, ['message', 'details', 'notes']);
  const company = pickField(data, ['company', 'companyName', 'company_name']);
  const service = pickField(data, ['service', 'serviceNeeded', 'service_needed']);
  const page = pickField(data, ['page', 'pageUrl', 'page_url']);
  const site = pickField(data, ['site', 'siteUrl', 'site_url']);

  if (!name || !phone || !address || !zipCode || !service) {
    return NextResponse.json(
      { ok: false, error: 'Please provide your name, phone, address, zip code, and service needed.' },
      { status: 400 }
    );
  }

  // Input format validation (mirrors frontend patterns)
  const namePattern = /^[A-Za-z\s\-']{2,50}$/;
  if (!namePattern.test(name)) {
    return NextResponse.json(
      { ok: false, error: 'Name should contain only letters, spaces, and hyphens (2-50 characters).' },
      { status: 400 }
    );
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid 10-digit phone number.' },
      { status: 400 }
    );
  }

  const zipPattern = /^\d{5}$/;
  if (!zipPattern.test(zipCode)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid 5-digit zip code.' },
      { status: 400 }
    );
  }

  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { ok: false, error: 'Message is too long. Please keep it under 5000 characters.' },
      { status: 400 }
    );
  }

  // 3. Content filtering - detect spam patterns
  const combinedText = `${name} ${address} ${zipCode} ${message}`.toLowerCase();

  // 3a. Check for excessive URLs (more than 2 is suspicious)
  const urlPattern = /https?:\/\/|www\./gi;
  const urlCount = (combinedText.match(urlPattern) || []).length;
  if (urlCount > 2) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 3b. Check for spam keywords
  const spamKeywords = [
    'crypto', 'bitcoin', 'ethereum', 'nft',
    'casino', 'poker', 'gambling', 'bet ',
    'viagra', 'cialis', 'pharmacy',
    'seo services', 'backlinks', 'web traffic',
    'nigerian prince', 'lottery winner', 'congratulations you won',
    'click here now', 'act now', 'limited time',
    'work from home', 'make money fast', 'earn $$',
  ];
  if (spamKeywords.some(keyword => combinedText.includes(keyword))) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // 3c. Check for all-caps messages (spam indicator)
  if (message && message.length > 20) {
    const upperCount = (message.match(/[A-Z]/g) || []).length;
    const letterCount = (message.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 0 && upperCount / letterCount > 0.7) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
  }

  // 3d. Check for non-ASCII character overload (foreign spam)
  const nonAsciiPattern = /[^\x00-\x7F]/g;
  const nonAsciiCount = (combinedText.match(nonAsciiPattern) || []).length;
  if (combinedText.length > 0 && nonAsciiCount / combinedText.length > 0.3) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // --------------------------------------------------------------------------
  // END SPAM PROTECTION
  // --------------------------------------------------------------------------


  const timestamp = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(new Date());
  const safeName = name || 'Website Form';
  const safeService = service || 'Website Form';
  const brandName = 'Jimenez Tree Pro';
  const brandAddress = 'Pasadena, TX';
  const brandPrimary = '#166534';
  const brandAccent = '#ea580c';
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'Jimenez Tree Pro <leads@quicklaunchweb.us>';
  const subject = `New Lead: ${safeService} | ${safeName}`;

  const pageUrlIsDev =
    !!page &&
    (/localhost/i.test(page) || /127\.0\.0\.1/.test(page) || /0\.0\.0\.0/.test(page));
  const pageUrlDisplay = page ? (pageUrlIsDev ? `${page} (dev link)` : page) : '';
  const phoneLink = (() => {
    if (!phone) return '';
    if (phone.trim().startsWith('+')) {
      return phone.replace(/[^\d+]/g, '');
    }
    const digits = phone.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return digits;
  })();

  const textLines = [
    `Timestamp: ${timestamp}`,
    name ? `Name: ${name}` : '',
    phone ? `Phone: ${phone}` : '',
    address ? `Address: ${address}` : '',
    zipCode ? `Zip Code: ${zipCode}` : '',
    company ? `Company: ${company}` : '',
    service ? `Service: ${service}` : '',
    pageUrlDisplay ? `Page: ${pageUrlDisplay}` : '',
    site ? `Site: ${site}` : '',
    `Message:\n${message || '(none)'}`,
  ].filter(Boolean);

  const text = textLines.join('\n');
  const escapedMessage = message ? escapeHtml(message).replace(/\n/g, '<br />') : '';
  const html = `
  <div style="background-color:#e2e8f0;margin:0;padding:24px 12px;font-family:'Barlow','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      New quote request from ${escapeHtml(safeName)}. Respond quickly.
    </span>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #cbd5e1;border-radius:16px;box-shadow:0 14px 36px rgba(2,6,23,0.18);overflow:hidden;">
      <tr>
        <td style="background:${brandPrimary};color:#ffffff;padding:18px 20px;border-bottom:4px solid ${brandAccent};">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size:18px;font-weight:800;letter-spacing:0.4px;text-transform:uppercase;">${brandName}</td>
              <td align="right">
                <span style="display:inline-block;background:${brandAccent};color:#ffffff;font-weight:800;font-size:11px;padding:7px 10px;border-radius:999px;letter-spacing:1.2px;">NEW LEAD</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 20px 14px;">
          <div style="font-size:25px;font-weight:800;line-height:1.2;margin:0 0 6px;color:#0f172a;">${escapeHtml(safeName)}</div>
          <div style="font-size:15px;color:${brandPrimary};font-weight:700;margin:0 0 5px;">${escapeHtml(safeService)}</div>
          <div style="font-size:12px;color:#64748b;">${escapeHtml(timestamp)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:0 0 10px;">
                <a href="tel:${escapeHtml(phoneLink || phone)}" style="display:block;background:${brandAccent};color:#ffffff;text-decoration:none;font-weight:800;font-size:14px;text-align:center;padding:14px 18px;border-radius:10px;">
                  Hold to Call Lead
                </a>
              </td>
            </tr>

            ${pageUrlDisplay ? `
            <tr>
              <td style="padding:0;">
                <a href="${escapeHtml(page)}" style="font-size:12px;color:${brandAccent};text-decoration:none;">View Page</a>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #dbe5f3;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#eff6ff;padding:14px 16px;font-weight:800;border-bottom:1px solid #dbe5f3;color:${brandPrimary};">Lead Details</td>
            </tr>
            <tr>
              <td style="padding:0 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;">
                  <tr><td style="padding:10px 0;color:#64748b;width:120px;">Name</td><td style="padding:10px 0;color:#0f172a;font-weight:700;">${escapeHtml(safeName)}</td></tr>
                  <tr><td style="padding:10px 0;color:#64748b;">Phone</td><td style="padding:10px 0;"><a href="tel:${escapeHtml(phoneLink || phone)}" style="color:#0f172a;text-decoration:none;font-weight:700;">${escapeHtml(phone)}</a></td></tr>
                  <tr><td style="padding:10px 0;color:#64748b;">Address</td><td style="padding:10px 0;color:#0f172a;font-weight:700;">${escapeHtml(address)}</td></tr>
                  <tr><td style="padding:10px 0;color:#64748b;">Zip Code</td><td style="padding:10px 0;color:#0f172a;font-weight:700;">${escapeHtml(zipCode)}</td></tr>
                  <tr><td style="padding:10px 0;color:#64748b;">Service</td><td style="padding:10px 0;color:#0f172a;font-weight:700;">${escapeHtml(safeService)}</td></tr>
                  ${pageUrlDisplay ? `<tr><td style="padding:10px 0;color:#64748b;">Page URL</td><td style="padding:10px 0;"><a href="${escapeHtml(page)}" style="color:${brandAccent};text-decoration:none;">${escapeHtml(pageUrlDisplay)}</a></td></tr>` : ''}
                  ${site ? `<tr><td style="padding:10px 0;color:#64748b;">Site</td><td style="padding:10px 0;"><a href="${escapeHtml(site)}" style="color:${brandAccent};text-decoration:none;">${escapeHtml(site)}</a></td></tr>` : ''}
                  ${company ? `<tr><td style="padding:10px 0;color:#64748b;">Company</td><td style="padding:10px 0;color:#0f172a;font-weight:700;">${escapeHtml(company)}</td></tr>` : ''}
                  <tr>
                    <td style="padding:10px 0;color:#64748b;vertical-align:top;">Message</td>
                    <td style="padding:10px 0;color:#0f172a;">
                      ${escapedMessage ? `<div style="font-weight:500;">${escapedMessage}</div>` : `<div style="font-style:italic;color:#64748b;">No message provided.</div>`}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 22px;">
          <div style="border-left:4px solid ${brandAccent};padding:12px;background:#f8fafc;border-radius:8px;font-size:12px;color:#475569;line-height:1.5;">
            This lead came from the Jimenez Tree Pro website form.
            <span style="display:block;margin-top:6px;font-weight:700;color:${brandPrimary};">${brandAddress}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isDryRun = process.env.LEAD_DRY_RUN === 'true';

  if (isDryRun || !resendApiKey || !toEmail) {
    const missingVars = [
      !resendApiKey ? 'RESEND_API_KEY' : '',
      !toEmail ? 'LEAD_TO_EMAIL' : '',
    ].filter(Boolean);

    if (isProduction && !isDryRun && missingVars.length > 0) {
      return NextResponse.json(
        { ok: false, error: `Server misconfigured. Missing ${missingVars.join(' and ')}.` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        mode: 'dry-run',
        message:
          missingVars.length > 0
            ? `Dry run only. Missing ${missingVars.join(' and ')}.`
            : 'Dry run enabled. Email not sent.',
      },
      { status: 200 }
    );
  }

  const resend = new Resend(resendApiKey);
  const bcc = process.env.LEADS_BCC_EMAIL
    ? process.env.LEADS_BCC_EMAIL.split(',').map((entry) => entry.trim()).filter(Boolean)
    : undefined;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    bcc,
    replyTo: undefined,
    subject,
    text,
    html,
  });

  if (error) {
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? `Failed to send email: ${error.message || 'Unknown Resend error'}`
        : 'Failed to send email.';

    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
