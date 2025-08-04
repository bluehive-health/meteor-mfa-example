import assert from "assert";
import { validateEmail, validateUsername, validatePassword, validateTwoFactorCode, sanitizeInput } from "../imports/utils/validation";

describe("meteor-mfa-example", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "meteor-mfa-example");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});

describe("Input Validation", function () {
  describe("sanitizeInput", function () {
    it("should remove dangerous characters", function () {
      assert.strictEqual(sanitizeInput("<script>alert('xss')</script>"), "scriptalert(xss)/script");
      assert.strictEqual(sanitizeInput("test'quote"), "testquote");
      assert.strictEqual(sanitizeInput('test"doublequote'), "testdoublequote");
    });

    it("should trim whitespace", function () {
      assert.strictEqual(sanitizeInput("  test  "), "test");
    });

    it("should handle non-string input", function () {
      assert.strictEqual(sanitizeInput(null), "");
      assert.strictEqual(sanitizeInput(undefined), "");
      assert.strictEqual(sanitizeInput(123), "");
    });
  });

  describe("validateEmail", function () {
    it("should validate correct emails", function () {
      assert.strictEqual(validateEmail("test@example.com"), true);
      assert.strictEqual(validateEmail("user.name@domain.co.uk"), true);
    });

    it("should reject invalid emails", function () {
      assert.strictEqual(validateEmail("invalid"), false);
      assert.strictEqual(validateEmail("@example.com"), false);
      assert.strictEqual(validateEmail("test@"), false);
    });
  });

  describe("validateUsername", function () {
    it("should validate correct usernames", function () {
      assert.strictEqual(validateUsername("user123"), true);
      assert.strictEqual(validateUsername("test_user"), true);
    });

    it("should reject invalid usernames", function () {
      assert.strictEqual(validateUsername("ab"), false); // too short
      assert.strictEqual(validateUsername("user-name"), false); // invalid chars
      assert.strictEqual(validateUsername("user@name"), false); // invalid chars
    });
  });

  describe("validatePassword", function () {
    it("should validate correct passwords", function () {
      assert.strictEqual(validatePassword("password123"), true);
      assert.strictEqual(validatePassword("123456"), true);
    });

    it("should reject invalid passwords", function () {
      assert.strictEqual(validatePassword("12345"), false); // too short
      assert.strictEqual(validatePassword(""), false);
      assert.strictEqual(validatePassword(null), false);
    });
  });

  describe("validateTwoFactorCode", function () {
    it("should validate correct 2FA codes", function () {
      assert.strictEqual(validateTwoFactorCode("123456"), true);
      assert.strictEqual(validateTwoFactorCode("000000"), true);
    });

    it("should reject invalid 2FA codes", function () {
      assert.strictEqual(validateTwoFactorCode("12345"), false); // too short
      assert.strictEqual(validateTwoFactorCode("1234567"), false); // too long
      assert.strictEqual(validateTwoFactorCode("12345a"), false); // non-digits
      assert.strictEqual(validateTwoFactorCode(""), false);
    });
  });
});
