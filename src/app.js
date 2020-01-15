const logger = require("pino")();
const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");

const config = require("./config");
const validators = require("./validators");
const handlers = require("./handlers");

const configPolicy = {
  port: { required: true, number: true },
  defaultProvider: { required: true },
  sendgridToken: { required: true },
  mailgunToken: { required: true },
  mailgunDomain: { required: true },
};

const errors = validators.validate(config, configPolicy);
if (validators.containsError(errors)) {
  logger.fatal(errors, "app config is not valid.");
  process.exit(1);
}

const app = new Koa();
const router = new Router();
router.post("/message", handlers.send);
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port);

logger.info(`MAILO is running on port ${config.port}`);
