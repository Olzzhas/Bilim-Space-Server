const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'bilimspace.edu@gmail.com',
        pass: 'omjl riav osdj rhwe',
      },
    });
  }

  async sendActivationMail(to, link) {
    try {
      await this.transporter.sendMail({
        from: 'bilimspace.edu@gmail.com',
        to,
        subject: 'Активация аккаунта Bilim Space',
        text: '',
        html: `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href ="${link}">${link}</a>
          </div>
        `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new MailService();
