const pool = require("../../databases/postgresql/pool");
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const AuthenticationRepositoryPostgresql = require("../AuthenticationRepositoryPostgresql");

describe('AuthenticationRepositoryPostgresql', () => {

  afterEach(async () => {
    await AuthenticationsTableTestHelper.truncateTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addRefreshToken function', () => {
    it('should persist added refresh token in db', async () => {
      const refreshToken = 'refresh-token';
      const repo = new AuthenticationRepositoryPostgresql(pool);

      await repo.addRefreshToken(refreshToken);

      const tokens = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(tokens).toHaveLength(1);
    });
  });


  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      const refreshToken = 'non-existent-token';
      const repo = new AuthenticationRepositoryPostgresql(pool);

      expect(repo.verifyRefreshToken(refreshToken)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when verification succeeded', async () => {
      const refreshToken = 'existent-token';
      const repo = new AuthenticationRepositoryPostgresql(pool);
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      expect(repo.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError);
    });
  });


  describe('deleteRefreshToken function', () => {
    it('should delete refresh token in db correctly', async () => {
      const refreshToken = 'refresh-token';
      const repo = new AuthenticationRepositoryPostgresql(pool);
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      await repo.deleteRefreshToken(refreshToken);

      const res = await AuthenticationsTableTestHelper.findToken(refreshToken);
      expect(res).toHaveLength(0);
    });
  });
});