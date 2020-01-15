const { expect } = require("chai");

const validators = require("./validators");

describe("validators", () => {
  describe("hasValue()", () => {
    it("null is not considered a value", () => {
      const result = validators.hasValue(null);

      expect(result).to.equal(false);
    });

    it("undefined is not considered a value", () => {
      const result = validators.hasValue(undefined);

      expect(result).to.equal(false);
    });

    it("0 is considered a value", () => {
      const result = validators.hasValue(0);

      expect(result).to.equal(true);
    });

    it("'' (empty string) is considered a value", () => {
      const result = validators.hasValue("");

      expect(result).to.equal(true);
    });

    it("[] (empty array) is considered a value", () => {
      const result = validators.hasValue([]);

      expect(result).to.equal(true);
    });

    it("{} (empty object) is considered a value", () => {
      const result = validators.hasValue({});

      expect(result).to.equal(true);
    });

    it("strings are considered a value", () => {
      const result = validators.hasValue("foo");

      expect(result).to.equal(true);
    });

    it("numbers are considered a value", () => {
      const result = validators.hasValue(-12);

      expect(result).to.equal(true);
    });

    it("objects are considered a value", () => {
      const result = validators.hasValue({ foo: "bar" });

      expect(result).to.equal(true);
    });

    it("arrays are considered a value", () => {
      const result = validators.hasValue(["foo", "bar"]);

      expect(result).to.equal(true);
    });
  });
});
