const config = {
  port: process.env.MAILO_PORT || process.env.PORT || 2021,

  defaultProvider: process.env.MAILO_PROVIDERS_DEFAULT
    ? process.env.MAILO_PROVIDERS_DEFAULT.toUpperCase()
    : "SENDGRID",

  sendgridToken: process.env.MAILO_SENDGRID_TOKEN,

  mailgunToken: process.env.MAILO_MAILGUN_TOKEN,
  mailgunDomain: process.env.MAILO_MAILGUN_DOMAIN,
};

module.exports = config;
