import { join } from 'path';
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
const smtpMockDir = process.env.SMTP_OUTPUT_DIR || 'tmp/emails';
const smtpFallbackToFile =
  (process.env.SMTP_FALLBACK_TO_FILE || '').toLowerCase() === 'true';

const ensureMockDir = async () => {
  const { mkdir } = await import('fs/promises');
  const { join: pathJoin } = await import('path');
  const dirPath = pathJoin(/* turbopackIgnore: true */ process.cwd(), smtpMockDir);
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

const sanitizeForFile = (value: string) =>
  value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase();

const writeMockEmail = async (
  info: nodemailer.SentMessageInfo,
  subjectLine?: string,
  fallbackFile?: string
) => {
  const dir = await ensureMockDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = crypto.randomBytes(4).toString('hex');
  const fileName =
    fallbackFile ??
    `${stamp}-${random}-${subjectLine ? sanitizeForFile(subjectLine).slice(0, 40) : 'message'}.eml`;

  const content =
    typeof info.message === 'string'
      ? info.message
      : Buffer.isBuffer(info.message)
        ? info.message
        : info.response || JSON.stringify(info, null, 2);

  const { writeFile } = await import('fs/promises');
  await writeFile(join(dir, fileName), content);
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
      const messageId = await writeMockEmail(info, subject ?? undefined);
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
