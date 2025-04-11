const UserRepository = require("../UserRepository");

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    const userRepo = new UserRepository();

    expect(userRepo.addUser({})).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(userRepo.verifyAvailableUsername('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});