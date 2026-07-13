import { Resend } from "resend";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Fix the case mismatch bug: env exports resendApiKey, not RESEND_API_KEY
const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

// Initialize SMTP transporter if SMTP host config is provided
const transporter = env.smtp.host
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465, // SSL/TLS
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass
      }
    })
  : null;

export async function sendEmail({ to, subject, html }) {
  // 1. Try sending via Resend first if API Key is configured
  if (resend) {
    try {
      await resend.emails.send({
        from: env.smtp.from,
        to,
        subject,
        html
      });
      console.log(`[MAILER] Email successfully sent via Resend to: ${to}`);
      return;
    } catch (error) {
      console.error(`[MAILER ERROR] Resend failed to send email to ${to}:`, error.message || error);
    }
  }

  // 2. Try sending via standard SMTP if configured as fallback
  if (transporter) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject,
        html
      });
      console.log(`[MAILER] Email successfully sent via SMTP to: ${to}`);
      return;
    } catch (error) {
      console.error(`[MAILER ERROR] SMTP failed to send email to ${to}:`, error.message || error);
    }
  }

  console.log(`[MAILER] Both Resend and SMTP skipped/failed. Local fallback OTP code logged in console. Email was to: ${to}`);
}


