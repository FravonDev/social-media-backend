import { MailRequest } from './interfaces/mail';

export abstract class MailService {
  abstract sendMail(request: MailRequest): Promise<void>;
}
