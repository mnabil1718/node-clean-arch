const PasswordHash = require('../../Applications/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  #bcrypt;
  #saltRound;

  constructor(bcrypt, saltRound = 10) {
    super();
    this.#bcrypt = bcrypt;
    this.#saltRound = saltRound;
  }

  async hash(plainText) {
    return this.#bcrypt.hash(plainText, this.#saltRound);
  };

  async compare(plainPassword, encryptedPassword) {
    const res = await this.#bcrypt.compare(plainPassword, encryptedPassword);

    if (!res) {
      throw new AuthenticationError('invalid credentials.');
    }
  };
}

module.exports = BcryptPasswordHash;