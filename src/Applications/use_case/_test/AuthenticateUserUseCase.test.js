const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticateUser = require('../../../Domains/users/entities/AuthenticateUser');
const UserRepository = require("../../../Domains/users/UserRepository");
const PasswordHash = require("../../security/PasswordHash");
const AuthenticateUserUseCase = require("../AuthenticateUserUseCase");
const NewAuth = require("../../../Domains/authentications/entities/NewAuth");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");

describe('AuthenticateUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const dumbId = 'user-123';
    const encryptedPass = 'encrypted_pass';
    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';

    // DTO to input to use case
    const payload = {
      username: 'cucibaju123',
      password: 'plain_pass',
    };

    const mockNewAuth = new NewAuth({
      accessToken: accessToken,
      refreshToken: refreshToken
    });


    const mockUserRepo = new UserRepository();
    const mockPassHasher = new PasswordHash();
    const mockAuthTokenManager = new AuthenticationTokenManager();
    const mockAuthRepo = new AuthenticationRepository();

    // mind that this sequence is a step by step calls on how to register a new user
    mockUserRepo.getPasswordByUsername = jest.fn().mockImplementation(() => Promise.resolve(encryptedPass));
    mockPassHasher.compare = jest.fn().mockImplementation(() => Promise.resolve());
    mockUserRepo.getIdByUsername = jest.fn().mockImplementation(() => Promise.resolve(dumbId));
    mockAuthTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
    mockAuthTokenManager.createRefreshToken = jest.fn().mockImplementation(() => Promise.resolve(refreshToken));
    mockAuthRepo.addRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    const authenticateUserUseCase = new AuthenticateUserUseCase({ userRepository: mockUserRepo, passwordHash: mockPassHasher, authenticationTokenManager: mockAuthTokenManager, authenticationRepository: mockAuthRepo });

    const newAuth = await authenticateUserUseCase.execute(payload);

    expect(newAuth).toStrictEqual(mockNewAuth);
    expect(mockUserRepo.getPasswordByUsername).toHaveBeenCalledWith(payload.username);
    expect(mockPassHasher.compare).toHaveBeenCalledWith(payload.password, encryptedPass);
    expect(mockUserRepo.getIdByUsername).toHaveBeenCalledWith(payload.username);
    expect(mockAuthTokenManager.createAccessToken).toHaveBeenCalledWith({ userId: dumbId });
    expect(mockAuthTokenManager.createRefreshToken).toHaveBeenCalledWith({ userId: dumbId });
    expect(mockAuthRepo.addRefreshToken).toHaveBeenCalledWith(refreshToken);

  });
});