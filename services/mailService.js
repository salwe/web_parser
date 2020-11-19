const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
    name: 'pixel-parser.com',
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

class MailService {
    sendMail(email, subject, body) {
        const message = {
            from: 'pixel24@parser.com',
            to: email,
            subject,
            html: body,
        };

        transport.sendMail(message, (err, info) => {
            const message = err ? err : info;
            console.info(`email: ${email}, subject: ${subject}`, message);
        });
    }

    generateSaleMail(data) {
        return data.map(item => (
            `<h2>${item.title}</h2>
             <p>Даты: ${item.dates}</p>
             <div><img src="${item.img}" alt=""/></div>
             <p><a href="${item.link}">Перейти</a></p>
            `
        )).join('<hr/>');
    }

    async sendSaleMail(data, email) {
        const body = this.generateSaleMail(data);

        this.sendMail(email, 'New sale proposal on pixel24.ru', body);
    }

    generateCommissionMail(data) {
        return data.map(item => (
            `<h2>${item.title}</h2>
             <p>${item.price} р.</p>
             <div><img src="${item.img}" alt=""/></div>
             <p><a href="${item.link}">Перейти</a></p>
            `
        )).join('<hr/>');
    }

    async sendCommissionMail(data, email) {
        const body = this.generateCommissionMail(data);

        this.sendMail(email, 'New commission proposal on pixel24.ru', body);
    }
}

module.exports = new MailService();