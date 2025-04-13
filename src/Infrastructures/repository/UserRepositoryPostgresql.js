const InvariantError = require('../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');

class UserRepositoryPostgresql extends UserRepository {
  #pool; // private prop ES2022
  #idGenerator; // private prop ES2022

  constructor(pool, idGenerator) {
    super();
    this.#pool = pool;
    this.#idGenerator = idGenerator;
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    };

    const result = await this.#pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username not available');
    }
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${this.#idGenerator()}`;

    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    };

    await this.#pool.query(query);

    return new RegisteredUser({ id, username, fullname });
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const res = await this.#pool.query(query);

    if (!res.rowCount) {
      throw new InvariantError('username not found.');
    }

    return res.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const res = await this.#pool.query(query);

    if (!res.rowCount) {
      throw new InvariantError('username not found.');
    }

    return res.rows[0].id;
  }


}

module.exports = UserRepositoryPostgresql;