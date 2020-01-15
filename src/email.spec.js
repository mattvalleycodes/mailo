const sinon = require("sinon");
const got = require("got");
const { expect } = require("chai");

const Email = require("./email");

describe("Email", () => {
  let fakeGot;
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    fakeGot = {
      post: sandbox.stub().returns({
        json: sandbox.stub().resolves({}),
      }),
    };

    sandbox.stub(got, "post").value(fakeGot.post);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe(".send()", () => {
    it("without a message object, throws error", async () => {
      const email = new Email();

      await expect(email.send()).to.eventually.be.rejectedWith(Error, "message not provided.");
    });

    it("delivers the email to the Sendgrid API", async () => {
      const email = new Email();
      const message = {
        from: "foo@bar.com",
        to: ["amazing@company.com"],
        cc: ["great@idea.com"],
        bcc: ["boss@company.com"],
        subject: "Hello, world!",
        body: "Have a wonderful day!",
      };

      await email.send(message);

      expect(got.post.callCount).to.equal(1);
      expect(got.post.firstCall.args).to.deep.equal([
        "https://api.sendgrid.com/v3/mail/send",
        {
          headers: {
            Authorization: `Bearer SENDGRID_TOKEN`,
          },
          json: {
            from: { email: "foo@bar.com" },
            subject: "Hello, world!",
            content: [{ type: "text/plain", value: "Have a wonderful day!" }],
            personalizations: [
              {
                to: [{ email: "amazing@company.com" }],
                cc: [{ email: "great@idea.com" }],
                bcc: [{ email: "boss@company.com" }],
              },
            ],
          },
          retry: 0,
        },
      ]);
    });
  });
});
