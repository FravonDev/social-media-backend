export interface MailRequest {
  to: string;
  subject: string;
  template?: string;
  html?: string;
  context?: any;
}
