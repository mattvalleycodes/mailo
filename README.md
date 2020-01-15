# Mailo

"Mailo" is a simple REST API written in Node.js. It sends emails using SendGrid or Mailgun. Wondering why two email providers? Mailo is configurable to use SendGrid or Mailgun as the default gateway for sending emails. When the default gateway is down, Mailo automatically tries to send the same email using the backup gateway.



## Configuration

As mentioned earlier, Mailo works with SendGrid and Mailgun so to get it working properly, you need to have API Keys for both services. Head to SendGrid and Mailgun website to get yours because I'm not going to push credentials in Github! When you got them, configure Mailo using the below environment variables:

* Configure Mailo's port using `MAILO_PORT` or `PORT`. Mailo uses 2021 as the default port.
* Set your preferred email provider using `MAILO_PROVIDERS_DEFAULT`. Use `SENDGRID` or `MAILGUN` as value. Mailo uses `SENDGRID` by default.
* `MAILO_SENDGRID_TOKEN` is for passing the token for SendGrid service.
* `MAILO_MAILGUN_TOKEN` is for passing the token for MailGun service.
* `MAILO_MAILGUN_DOMAIN` is for passing the MailGun domain.



## Run it locally

To run Mailo locally, you need Node v12.6.0. Run the following commands to clone and run Mailo locally:

```bash
git clone
cd mailo
npm install
npm start
```



## Commands

Mailo commands with a set of commands to improve your development expeirence.

* `npm start` runs Mailo locally
* `npm run start:watch` runs Mailo locally and restarts the process as soon as you change a file. This is ideal for development.
* `npm test` runs the unit & integration tests for you.
* `npm run lint` checks the codebase against the defined ESLint rules. This command also reminds you if the coding style does not match the "Prettier" configuration.



## Postman

Mailo repo comes with a working Postman collection to try the available REST endpoints. To use the collection, please import the `mailo-postman-collection.json` file.



## TODO

Mailo is a "Work In Progress". Below is a list of things in my list to do for Mailo.

* Periodically check for availability of the preferred provider after it became unavailable. Switch back to it as soon as possible.
* If needed, move the "Send Mail" logic to a queue system.
* Give a unique ID to each request and return to the user. Helpful for debugging.
* Log requests for debugging purposes. Don't log people's email though. That's not necessarily a good idea. Mask it for security purposes.
*  Extend the payload to accept name for from, to, bcc and cc, remain backward compatible.
* Extend the payload to accept to, bcc and cc as array, remain backward compatible.
* Examples of unit tests for both sync and async code are in place but the code is not fully covered with unit tests. Introduce tests for missing happy/unhappy paths in code.
* Introduce a code coverage tool like Istanbul to the project.
* Extend the current configiguraiton management solution to support .env files as well.
