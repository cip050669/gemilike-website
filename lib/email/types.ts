import type { Attachment } from 'nodemailer/lib/mailer';

export type SendEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Attachment[];
}
