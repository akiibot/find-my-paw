import { Resend } from 'resend'

interface ScanAlertOptions {
  ownerEmail: string
  petName: string
  publicId: string
  lastSeenArea?: string | null
  rewardEnabled?: boolean
  rewardText?: string | null
  userAgent?: string | null
}

export async function sendScanAlert(opts: ScanAlertOptions) {
  // Lazy init — avoids build-time crash when env var not present
  const resend = new Resend(process.env.RESEND_API_KEY)

  const {
    ownerEmail,
    petName,
    publicId,
    lastSeenArea,
    rewardEnabled,
    rewardText,
    userAgent,
  } = opts

  const profileUrl = `${process.env.AUTH_URL || 'http://localhost:3000'}/p/${publicId}`

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🚨 ${petName}'s tag was just scanned!</title>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f0f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#1a1a1a;border-radius:24px;overflow:hidden;border:1px solid #333;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#dc2626,#7f1d1d);padding:40px 40px 32px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🐾</div>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;line-height:1.2;">
                ${petName}'s tag was just scanned!
              </h1>
              <p style="margin:12px 0 0;color:rgba(255,255,255,0.8);font-size:16px;font-weight:500;">
                Someone found your pet. Act fast.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">

              <!-- Alert info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff08;border:1px solid #333;border-radius:16px;margin-bottom:32px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;color:#9ca3af;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Scan Details</p>
                    <table width="100%">
                      <tr>
                        <td style="color:#6b7280;font-size:14px;padding:6px 0;width:40%;">Pet</td>
                        <td style="color:#ffffff;font-size:14px;font-weight:700;padding:6px 0;">${petName}</td>
                      </tr>
                      ${lastSeenArea ? `
                      <tr>
                        <td style="color:#6b7280;font-size:14px;padding:6px 0;">Last Seen</td>
                        <td style="color:#ffffff;font-size:14px;font-weight:700;padding:6px 0;">${lastSeenArea}</td>
                      </tr>` : ''}
                      ${rewardEnabled && rewardText ? `
                      <tr>
                        <td style="color:#6b7280;font-size:14px;padding:6px 0;">Reward</td>
                        <td style="color:#fbbf24;font-size:14px;font-weight:700;padding:6px 0;">৳${rewardText}</td>
                      </tr>` : ''}
                      ${userAgent ? `
                      <tr>
                        <td style="color:#6b7280;font-size:14px;padding:6px 0;vertical-align:top;">Scanner Device</td>
                        <td style="color:#4b5563;font-size:12px;padding:6px 0;word-break:break-all;">${userAgent.substring(0, 80)}…</td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="${profileUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;font-size:18px;font-weight:900;padding:18px 40px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;box-shadow:0 8px 24px rgba(220,38,38,0.4);">
                  View ${petName}'s Live Profile →
                </a>
              </div>

              <!-- Tip -->
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.7;text-align:center;">
                The finder can see your contact details on the profile page right now.<br/>
                Open the profile, or contact them directly using the numbers you've registered.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#111;padding:24px 40px;border-top:1px solid #222;text-align:center;">
              <p style="margin:0;color:#4b5563;font-size:13px;">
                This alert was sent by <strong style="color:#6b7280;">Find My Paw</strong> because your pet's QR tag was just scanned.<br/>
                <span style="color:#374151;">SMS alerts coming soon.</span>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const { data, error } = await resend.emails.send({
    from: 'Find My Paw <onboarding@resend.dev>',
    to: ownerEmail,
    subject: `🚨 ${petName}'s QR tag was just scanned!`,
    html,
  })

  if (error) {
    console.error('[resend] API error:', JSON.stringify(error))
  } else {
    console.log('[resend] Email sent successfully. ID:', data?.id, '→ to:', ownerEmail)
  }

  return { data, error }
}
