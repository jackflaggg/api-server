import { emailTemplates } from '../../../templates/email.templates';
import nodemailer from 'nodemailer';
import { AppConfig } from '../../../core/config/app.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
    constructor(private readonly coreConfig: AppConfig) {}
    async sendEmail(emailFrom: string, messageCode: string): Promise<void | null> {
        try {
            const transporter = nodemailer.createTransport({
                service: 'yandex',
                auth: {
                    user: this.coreConfig.adminEmail,
                    pass: this.coreConfig.adminEmailPassword,
                },
                secure: true,
            });

            await transporter.sendMail({
                from: `"Rasul" <${this.coreConfig.adminEmail}>`,
                to: emailFrom,
                subject: 'Осталось еще чуть-чуть до регистрации!',
                html: emailTemplates.registrationEmailTemplate(messageCode),
            });
        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null;
        }
    }
}
