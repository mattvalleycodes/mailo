const got = require("got");
const FormData = require("form-data");

const config = require("./config");
const validators = require("./validators");

const SENDGRID = "SENDGRID";
const MAILGUN = "MAILGUN";

class Email {
  constructor() {
    this.activeProvider = config.defaultProvider;

    this.sendViaSendgrid = this.sendViaSendgrid.bind(this);
    this.sendViaMailgun = this.sendViaMailgun.bind(this);
    this.switchProvider = this.switchProvider.bind(this);
    this.isInternalError = this.isInternalError.bind(this);
  }

  async send(message) {
    if (!validators.hasValue(message)) throw new Error("message not provided.");

    const validations = {
      from: { required: true, email: true },
      to: { required: true, email: true },
      cc: { email: true },
      bcc: { email: true },
      subject: { required: true },
      body: { required: true },
    };

    const validationResult = validators.validate(message, validations);
    if (validators.containsError(validationResult)) {
      const err = new Error("invalid payload provided.");
      err.more = validationResult;

      throw err;
    }

    if (this.activeProvider === SENDGRID) {
      await this.sendViaSendgrid(message);
    } else {
      await this.sendViaMailgun(message);
    }
  }

  async sendViaSendgrid(message) {
    const url = "https://api.sendgrid.com/v3/mail/send";

    const options = {
      headers: {
        Authorization: `Bearer ${config.sendgridToken}`,
      },
      json: {
        from: { email: message.from },
        subject: message.subject,
        content: [{ type: "text/plain", value: message.body }],
        personalizations: [
          {
            to: message.to.map((to) => ({ email: to })),
            cc: message.cc ? message.cc.map((cc) => ({ email: cc })) : null,
            bcc: message.bcc ? message.bcc.map((bcc) => ({ email: bcc })) : null,
          },
        ],
      },
      retry: 0,
    };

    try {
      await got.post(url, options).json();
    } catch (err) {
      if (!this.isInternalError(err)) throw this.generateError(err);

      this.switchProvider();
      this.sendViaMailgun(message);
    }
  }

  async sendViaMailgun(message) {
    const url = `https://api:${config.mailgunToken}@api.mailgun.net/v3/${config.mailgunDomain}/messages`;

    const form = new FormData();
    form.append("from", message.from);
    message.to.forEach((to) => form.append("to[]", to));
    if (message.cc) message.to.forEach((cc) => form.append("cc[]", cc));
    if (message.bcc) message.to.forEach((bcc) => form.append("bcc[]", bcc));
    form.append("subject", message.subject);
    form.append("text", message.body);

    const options = { retry: 0, body: form };

    try {
      await got.post(url, options).json();
    } catch (error) {
      if (!this.isInternalError(error)) throw this.generateError(error);

      this.switchProvider();
      this.sendViaSendgrid(message);
    }
  }

  switchProvider() {
    this.activeProvider = this.activeProvider === SENDGRID ? MAILGUN : SENDGRID;
  }

  isInternalError(error) {
    return error.response.statusCode === 500;
  }

  generateError(error) {
    return new Error(`${error.response.statusCode} - ${error.response.body}`);
  }
}

module.exports = Email;
