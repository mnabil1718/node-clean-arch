const AuthenticationTokenManager = require("../../Applications/security/AuthenticationTokenManager");
const config = require("../../Commons/config");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class JwtTokenManager extends AuthenticationTokenManager {
  #jwt;
  constructor(jwt) {
    super();
    this.#jwt = jwt; // going to inject with @hapi/jwt.token
  };
  async createAccessToken(payload) {
    return this.#jwt.generate(payload, config.jwt.accessTokenSecret);
  }
  async createRefreshToken(payload) {
    return this.#jwt.generate(payload, config.jwt.refreshTokenSecret);
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this.#jwt.decode(token);
      this.#jwt.verifySignature(artifacts, config.jwt.refreshTokenSecret);
    } catch (error) {
      throw new InvariantError('invalid refresh token.');
    }
  }

  async decodePayload(token) {
    const artifacts = this.#jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;