const PasswordHash = require('../../Applications/security/PasswordHash');

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
}

module.exports = BcryptPasswordHash;