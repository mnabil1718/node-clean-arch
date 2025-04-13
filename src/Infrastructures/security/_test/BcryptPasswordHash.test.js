const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });

  describe('compare function', () => {
    it('should throw AuthenticationError when comparation failed', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action & Assert
      await expect(bcryptPasswordHash.compare('plain_password', 'encrypted_password')).rejects.toThrow(AuthenticationError);
    });

    it('should not throw AuthenticationError when comparation succeeded', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const plain = 'plain_password';
      const hashed = await bcryptPasswordHash.hash(plain);

      // Assert
      await expect(bcryptPasswordHash.compare(plain, hashed)).resolves.not.toThrow(AuthenticationError);
    });
  });
});