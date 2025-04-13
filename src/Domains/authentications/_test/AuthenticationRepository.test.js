const AuthenticationRepository = require('../AuthenticationRepository');

describe('AuthenticationRepository', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const authRepo = new AuthenticationRepository();

    expect(authRepo.addRefreshToken('')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(authRepo.verifyRefreshToken('')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(authRepo.deleteRefreshToken('')).rejects.toThrow('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});