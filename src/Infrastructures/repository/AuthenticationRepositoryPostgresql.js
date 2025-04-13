const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthenticationRepository = require('../../Domains/authentications/AuthenticationRepository');

class AuthenticationRepositoryPostgresql extends AuthenticationRepository {
  #pool;

  constructor(pool) {
    super();
    this.#pool = pool;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token]
    };

    await this.#pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    };

    const result = await this.#pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('invalid refresh token.');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token]
    };

    await this.#pool.query(query);
  }
}

module.exports = AuthenticationRepositoryPostgresql;