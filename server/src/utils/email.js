/**
 * Email Utility — Steady Gains
 *
 * Uses Resend for transactional emails (verification, password reset).
 * Set RESEND_API_KEY in .env to enable real emails.
 * If no API key is set, falls back to console logging (dev mode).
 */

import { Resend } from 'resend';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const FROM_NAME = 'Steady Gains Investments';
const FROM_EMAIL = 'noreply@steadygains.online'; // Add this domain in Resend dashboard first

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEmail({ to, subject, html }) {
    if (!resend) {
        // Fallback: console log in development
        console.log('\n====================================================');
        console.log(`📧 [DEV EMAIL TO]: ${to}`);
        console.log(`📋 [SUBJECT]:  ${subject}`);
        console.log(`📄 [BODY]:\n${html}`);
        console.log('====================================================\n');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: [to],
            subject,
            html,
        });

        if (error) {
            console.error('[Email Error]', error);
        } else {
            console.log(`✅ Email sent to ${to} (ID: ${data?.id})`);
        }
    } catch (err) {
        console.error('[Email Send Failed]', err.message);
    }
}

/**
 * Send a verification email after sign-up.
 */
export async function sendVerificationEmail(user, token) {
    const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

    await sendEmail({
        to: user.email,
        subject: `Welcome to ${FROM_NAME} — Please Verify Your Email`,
        html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: linear-gradient(135deg, #1a1a2e, #16a34a); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Steady Gains Investments</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px;">Secure • Reliable • Growing</p>
    </div>
    <div style="padding: 32px 24px;">
        <h2 style="color: #1a1a2e; margin: 0 0 12px; font-size: 18px;">Hi ${user.name},</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">
            Thank you for signing up! To activate your account and start investing, please verify your email address.
        </p>
        <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: #16a34a; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Verify Email Address
            </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">This link is valid for 24 hours.</p>
    </div>
    <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">If you didn't create this account, you can safely ignore this email.</p>
    </div>
</div>
        `.trim(),
    });
}

/**
 * Send a password reset email.
 */
export async function sendPasswordResetEmail(user, token) {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    await sendEmail({
        to: user.email,
        subject: `${FROM_NAME} — Password Reset Request`,
        html: `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
    <div style="background: linear-gradient(135deg, #1a1a2e, #dc2626); padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Steady Gains Investments</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 13px;">Password Reset</p>
    </div>
    <div style="padding: 32px 24px;">
        <h2 style="color: #1a1a2e; margin: 0 0 12px; font-size: 18px;">Hi ${user.name},</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">
            We received a request to reset your password. Click the button below to set a new password.
        </p>
        <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                Reset Password
            </a>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">This link is valid for 1 hour.</p>
    </div>
    <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 11px; margin: 0;">If you didn't request this, your account is safe — just ignore this email.</p>
    </div>
</div>
        `.trim(),
    });
}
