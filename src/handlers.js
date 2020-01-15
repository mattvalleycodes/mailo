const logger = require("pino")();
const Email = require("./email");
const validators = require("./validators");

const email = new Email();

const send = async (ctx) => {
  const policy = {
    from: { required: true, email: true },
    to: { required: true, email: true },
    subject: { required: true },
    body: { required: true },
    cc: { email: true },
    bcc: { email: true },
  };

  const validationResult = validators.validate(ctx.request.body, policy);
  if (validators.containsError(validationResult)) {
    ctx.status = 422;
    ctx.body = {
      success: false,
      error: "INVALID_PAYLOAD: provided payload is invalid.",
      details: validationResult,
    };

    return;
  }

  const { from, to, subject, body, cc, bcc } = ctx.request.body;

  const message = {
    from,
    to: Array.isArray(to) ? to : [to],
    cc: cc ? (Array.isArray(cc) ? cc : [cc]) : null,
    bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : null,
    subject,
    body,
  };

  try {
    await email.send(message);
    ctx.body = { success: true };
  } catch (error) {
    logger.error(error, "failed to send the email.");

    ctx.status = 500;
    ctx.body = {
      success: false,
      error: "INTERNAL_ERROR: an internal error occured.",
      details: null,
    };
  }
};

module.exports = { send };
