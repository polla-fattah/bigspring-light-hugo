import nodemailer from 'nodemailer';

interface SendVerificationEmailParams {
  toEmail: string;
  recipientName: string;
  verificationCode: string;
}

export async function sendVerificationEmail({
  toEmail,
  recipientName,
  verificationCode
}: SendVerificationEmailParams): Promise<{ sent: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"SURC Research Center" <${user || 'noreply@su.edu.krd'}>`;

  // Fallback mode if SMTP credentials are not configured in environment
  if (!host || !user || !pass) {
    console.log(`\n======================================================`);
    console.log(`[SURC EMAIL SERVICE] (Development / Fallback Mode)`);
    console.log(`To: ${toEmail} (${recipientName})`);
    console.log(`Security Code: ${verificationCode}`);
    console.log(`Notice: Configure SMTP_HOST, SMTP_USER, SMTP_PASS in .env to send real emails.`);
    console.log(`======================================================\n`);
    
    return {
      sent: false,
      message: 'SMTP credentials not configured. Code logged in server output.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure, // true for 465, false for 587
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates on university mailers if needed
      }
    });

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #6b1426; margin: 0; font-size: 22px; font-weight: 800;">Salahaddin University-Erbil</h2>
          <p style="color: #0f172a; margin: 4px 0 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; tracking: 1px;">Research Center Portal</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 32px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <h3 style="color: #0f172a; font-size: 16px; font-weight: 700; margin-top: 0;">Email Verification Required</h3>
          <p style="color: #475569; font-size: 13px; line-height: 1.6;">Dear <strong>${recipientName}</strong>,</p>
          <p style="color: #475569; font-size: 13px; line-height: 1.6;">Thank you for registering with your Salahaddin University email address (<code>${toEmail}</code>). Please use the 6-digit security code below to complete your account activation:</p>
          
          <div style="text-align: center; margin: 28px 0; background-color: #f1f5f9; padding: 20px; border-radius: 12px; border: 1px border-slate-200;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #6b1426;">${verificationCode}</span>
          </div>

          <p style="color: #64748b; font-size: 11px; line-height: 1.5; margin-bottom: 0;">This code is valid for single use. If you did not initiate this registration, please disregard this email or notify the Research Center IT administration.</p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #94a3b8; font-size: 11px;">
          <p style="margin: 0;">© 2026 Salahaddin University-Erbil Research Center (SURC)</p>
          <p style="margin: 4px 0 0 0;">Kirkuk Road, College of Engineering Campus, Erbil, Kurdistan Region, Iraq</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from,
      to: toEmail,
      subject: `${verificationCode} is your SURC Email Verification Security Code`,
      text: `Dear ${recipientName}, your SURC email verification security code is: ${verificationCode}`,
      html: htmlContent
    });

    console.log(`[SURC EMAIL SERVICE] Email dispatched successfully to ${toEmail}. MessageID: ${info.messageId}`);

    return {
      sent: true,
      message: `Verification email dispatched to ${toEmail}`
    };

  } catch (error: any) {
    console.error('[SURC EMAIL SERVICE] Failed to send verification email via SMTP:', error);
    return {
      sent: false,
      message: `Failed to dispatch SMTP email: ${error.message}`
    };
  }
}
