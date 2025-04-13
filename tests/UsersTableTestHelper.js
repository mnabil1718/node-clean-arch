/* istanbul ignore file */
const pool = require('../src/Infrastructures/databases/postgresql/pool');


const UsersTableTestHelper = {
  async addUser({ id = 'user-123', username = 'dicoding', password = 'secret123', fullname = 'Dicoding Indonesia' }) {
    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    };

    await pool.query(query);
  },
  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async findUserByUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async truncateTable() {
    await pool.query('TRUNCATE TABLE users');
  }
};


module.exports = UsersTableTestHelper;
