const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../databases/postgresql/pool');
const UserRepositoryPostgresql = require('../UserRepositoryPostgresql');

describe('UserRepositoryPostgresql', () => {
  afterEach(async () => {
    await UsersTableTestHelper.truncateTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username is not available', async () => {
      const username = 'dicoding';
      const repo = new UserRepositoryPostgresql(pool, {});
      await UsersTableTestHelper.addUser({ username: username });

      await expect(repo.verifyAvailableUsername(username)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when username is available', async () => {
      const username = 'jajamhz';
      const repo = new UserRepositoryPostgresql(pool, {});

      await expect(repo.verifyAvailableUsername(username)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should persist register user', async () => {
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      });

      const fakeIDGenerator = () => '123'; // stub!
      const userRepo = new UserRepositoryPostgresql(pool, fakeIDGenerator);

      await userRepo.addUser(registerUser);

      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      const payload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia'
      };
      const registerUser = new RegisterUser(payload);
      const registeredUser = new RegisteredUser({ id: 'user-123', username: payload.username, fullname: payload.fullname });
      fakeIDGenerator = () => '123';
      const repo = new UserRepositoryPostgresql(pool, fakeIDGenerator);

      const resUser = await repo.addUser(registerUser);

      expect(resUser).toStrictEqual(registeredUser);
    });
  });


});