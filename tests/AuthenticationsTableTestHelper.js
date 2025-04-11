/* istanbul ignore file */
const pool = require('../src/Infrastructures/databases/postgresql/pool');


const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token]
    };

    await pool.query(query);
  },
  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    };

    const res = await pool.query(query);
    return res.rows;
  },

  async truncateTable() {
    await pool.query('TRUNCATE TABLE authentications');
  }
};

module.exports = AuthenticationsTableTestHelper;