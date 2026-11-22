import nodemailer from 'nodemailer';

function configured() {
  return Boolean(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
}

function transport() {
  return nodemailer.createTransport({ host: process.env.EMAIL_HOST, port: Number(process.env.EMAIL_PORT || 587), secure: Number(process.env.EMAIL_PORT) === 465, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD } });
}

function layout(title, content) {
  return `<!doctype html><html><body style="margin:0;background:#f7f7f7;font-family:Arial,sans-serif;color:#111"><table width="100%" cellpadding="20"><tr><td align="center"><table width="560" style="max-width:560px;background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:32px"><tr><td><h1 style="font-size:24px;margin:0 0 16px">${title}</h1>${content}<p style="color:#737373;font-size:12px;margin-top:32px">SecureAuth</p></td></tr></table></td></tr></table></body></html>`;
}

export async function sendEmail(to, subject, title, content) {
  if (!configured()) return { delivered: false, reason: 'SMTP_NOT_CONFIGURED' };
  await transport().sendMail({ from: process.env.EMAIL_FROM || 'SecureAuth <no-reply@example.com>', to, subject, html: layout(title, content) });
  return { delivered: true };
}

export const welcomeEmail = (name) => sendEmail('', '', '', '');
