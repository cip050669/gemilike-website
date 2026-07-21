import { basename, join, resolve } from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import type { SendEmailOptions, SendEmailResult } from './types';

const transportMode = (process.env.SMTP_TRANSPORT || 'smtp').toLowerCase();
const smtpHost = process.env.SMTP_HOST || 'smtp.strato.de';
const smtpPort = Number.parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER || 'info@gemilike.com';
const smtpPassword = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';
const smtpFrom = process.env.SMTP_FROM || smtpUser || 'noreply@gemilike.com';
/** Relative output dir only — reject absolute / traversal paths from env */
const smtpMockDir = (() => {
  const raw = (process.env.SMTP_OUTPUT_DIR || 'tmp/emails').replace(/\\/g, '/');
  const segments = raw.split('/').filter((s) => s && s !== '.' && s !== '..');
  return segments.length > 0 ? segments.join('/') : 'tmp/emails';
})();
const smtpFallbackToFile =
  (process.env.SMTP_FALLBACK_TO_FILE || '').toLowerCase() === 'true';

const ensureMockDir = async () => {
  const { mkdir } = await import('fs/promises');
  const cwd = /* turbopackIgnore: true */ process.cwd();
  const root = resolve(cwd);
  const dirPath = resolve(cwd, smtpMockDir);
  if (dirPath !== root && !dirPath.startsWith(root + '/')) {
    throw new Error('Invalid SMTP_OUTPUT_DIR');
  }
  await mkdir(dirPath, { recursive: true });
  return dirPath;
};

const createFileTransport = () =>
  nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });

const createSmtpTransport = () =>
  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

const baseTransporter =
  transportMode === 'file' ? createFileTransport() : createSmtpTransport();

const writeMockEmail = async (info: nodemailer.SentMessageInfo) => {
  const dir = await ensureMockDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = crypto.randomBytes(4).toString('hex');
  // Filename is fully server-generated — never derived from email subject/body
  const fileName = basename(`${stamp}-${random}-message.eml`);
  const targetPath = join(dir, fileName);
  const resolvedTarget = resolve(targetPath);
  if (resolvedTarget !== dir && !resolvedTarget.startsWith(dir + '/')) {
    throw new Error('Refusing to write email outside mock directory');
  }

  const content =
    typeof info.message === 'string'
      ? info.message
      : Buffer.isBuffer(info.message)
        ? info.message
        : info.response || JSON.stringify(info, null, 2);

  const { writeFile } = await import('fs/promises');
  await writeFile(targetPath, content);
  return fileName;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: SendEmailOptions): Promise<SendEmailResult> {
  const sendWithTransport = async (transporter: nodemailer.Transporter) => {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to,
      subject,
      html,
      text,
      attachments,
    });

    if ('streamTransport' in transporter.options) {
      const messageId = await writeMockEmail(info);
      return { success: true as const, messageId };
    }

    return { success: true as const, messageId: info.messageId };
  };

  try {
    return await sendWithTransport(baseTransporter);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown email error';
    console.error('E-Mail-Versand Fehler:', error);

    if (smtpFallbackToFile && transportMode !== 'file') {
      try {
        const fallbackTransport = createFileTransport();
        return await sendWithTransport(fallbackTransport);
      } catch (fallbackError) {
        const fallbackMessage =
          fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        console.error('Fallback-Versand Fehler:', fallbackError);
        return {
          success: false,
          error: `${message} (Fallback fehlgeschlagen: ${fallbackMessage})`,
        };
      }
    }

    return { success: false, error: message };
  }
}
