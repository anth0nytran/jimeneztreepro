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

  const honeypot = pickField(data, ['website']);
  if (honeypot) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const name = pickField(data, ['name', 'fullName', 'fullname']);
  const phone = pickField(data, ['phone', 'phoneNumber', 'phone_number', 'tel']);
  const email = pickField(data, ['email', 'emailAddress', 'email_address']);
  const message = pickField(data, ['message', 'details', 'notes']);
  const company = pickField(data, ['company', 'companyName', 'company_name']);
  const service = pickField(data, ['service', 'serviceNeeded', 'service_needed']);
  const page = pickField(data, ['page', 'pageUrl', 'page_url']);
  const site = pickField(data, ['site', 'siteUrl', 'site_url']);

  if (!name || !phone || !email || !service) {
    return NextResponse.json(
      { ok: false, error: 'Please provide your name, phone, email, and service needed.' },
      { status: 400 }
    );
  }

  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { ok: false, error: 'Message is too long. Please keep it under 5000 characters.' },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;
  if (!resendApiKey || !toEmail) {
    return NextResponse.json(
      { ok: false, error: 'Server misconfigured. Missing RESEND_API_KEY or LEAD_TO_EMAIL.' },
      { status: 500 }
    );
  }

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
  const subject = `🚨 New Lead 🚨 ${safeService} | ${safeName}`;

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
    email ? `Email: ${email}` : '',
    company ? `Company: ${company}` : '',
    service ? `Service: ${service}` : '',
    pageUrlDisplay ? `Page: ${pageUrlDisplay}` : '',
    site ? `Site: ${site}` : '',
    `Message:\n${message || '(none)'}`,
  ].filter(Boolean);

  const text = textLines.join('\n');
  const escapedMessage = message ? escapeHtml(message).replace(/\n/g, '<br />') : '';
  const html = `
  <div style="background-color:#f3f4f6;margin:0;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">
      New quote request from ${escapeHtml(safeName)} — tap to call now.
    </span>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 25px rgba(17,24,39,0.08);overflow:hidden;">
      <tr>
        <td style="background:#ffffff;color:#111827;padding:18px 20px;border-top:6px solid #ff7a00;border-bottom:1px solid #f1f5f9;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size:16px;font-weight:700;letter-spacing:0.3px;">3D Fencing &amp; Gate</td>
              <td align="right">
                <span style="display:inline-block;background:#ff7a00;color:#111827;font-weight:700;font-size:12px;padding:6px 10px;border-radius:999px;letter-spacing:1px;">NEW LEAD</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 20px 16px;">
          <div style="font-size:24px;font-weight:800;margin:0 0 6px;">${escapeHtml(safeName)}</div>
          <div style="font-size:16px;color:#374151;font-weight:600;margin:0 0 4px;">${escapeHtml(safeService)}</div>
          <div style="font-size:12px;color:#6b7280;">${escapeHtml(timestamp)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:0 0 10px;">
                <a href="tel:${escapeHtml(phoneLink || phone)}" style="display:block;background:#ff7a00;color:#111827;text-decoration:none;font-weight:800;font-size:14px;text-align:center;padding:14px 18px;border-radius:10px;">
                  Hold to Call Lead
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 10px;">
                <a href="mailto:${escapeHtml(email)}" style="display:block;background:#111827;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;text-align:center;padding:14px 18px;border-radius:10px;">Email Lead</a>
              </td>
            </tr>
            ${pageUrlDisplay ? `
            <tr>
              <td style="padding:0;">
                <a href="${page}" style="font-size:12px;color:#ff7a00;text-decoration:none;">View Page</a>
              </td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 20px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#f9fafb;padding:14px 16px;font-weight:700;border-bottom:1px solid #e5e7eb;">Lead Details</td>
            </tr>
            <tr>
              <td style="padding:0 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px;">
                  <tr><td style="padding:10px 0;color:#6b7280;width:120px;">Name</td><td style="padding:10px 0;color:#111827;font-weight:600;">${escapeHtml(safeName)}</td></tr>
                  <tr><td style="padding:10px 0;color:#6b7280;">Phone</td><td style="padding:10px 0;"><a href="tel:${escapeHtml(phoneLink || phone)}" style="color:#111827;text-decoration:none;font-weight:600;">${escapeHtml(phone)}</a></td></tr>
                  <tr><td style="padding:10px 0;color:#6b7280;">Email</td><td style="padding:10px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#111827;text-decoration:none;font-weight:600;">${escapeHtml(email)}</a></td></tr>
                  <tr><td style="padding:10px 0;color:#6b7280;">Service</td><td style="padding:10px 0;color:#111827;font-weight:600;">${escapeHtml(safeService)}</td></tr>
                  ${pageUrlDisplay ? `<tr><td style="padding:10px 0;color:#6b7280;">Page URL</td><td style="padding:10px 0;"><a href="${page}" style="color:#ff7a00;text-decoration:none;">${escapeHtml(pageUrlDisplay)}</a></td></tr>` : ''}
                  ${site ? `<tr><td style="padding:10px 0;color:#6b7280;">Site</td><td style="padding:10px 0;"><a href="${escapeHtml(site)}" style="color:#ff7a00;text-decoration:none;">${escapeHtml(site)}</a></td></tr>` : ''}
                  ${company ? `<tr><td style="padding:10px 0;color:#6b7280;">Company</td><td style="padding:10px 0;color:#111827;font-weight:600;">${escapeHtml(company)}</td></tr>` : ''}
                  <tr>
                    <td style="padding:10px 0;color:#6b7280;vertical-align:top;">Message</td>
                    <td style="padding:10px 0;color:#111827;">
                      ${escapedMessage ? `<div style="font-weight:500;">${escapedMessage}</div>` : `<div style="font-style:italic;color:#6b7280;">No message provided.</div>`}
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
          <div style="border-left:4px solid #ff7a00;padding:10px 12px;background:#f9fafb;border-radius:8px;font-size:12px;color:#6b7280;">
            This lead came from your website form.
            <span style="display:block;margin-top:4px;color:#9ca3af;">Powered by QuickLaunchWeb</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  const resend = new Resend(resendApiKey);
  const bcc = process.env.LEADS_BCC_EMAIL
    ? process.env.LEADS_BCC_EMAIL.split(',').map((entry) => entry.trim()).filter(Boolean)
    : undefined;

  const { error } = await resend.emails.send({
    from: '3D Fencing & Gate | New Lead <leads@quicklaunchweb.us>',
    to: [toEmail],
    bcc,
    replyTo: email || undefined,
    subject,
    text,
    html,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: 'Failed to send email.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
