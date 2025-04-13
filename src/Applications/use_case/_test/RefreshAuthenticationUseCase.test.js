const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const RefreshAuthenticationUseCase = require("../RefreshAuthenticationUseCase");

describe('RefreshAuthenticationUseCase', () => {
  it('should throw Error when payload empty', async () => {
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
    expect(refreshAuthenticationUseCase.execute({})).rejects.toThrow('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw Error when payload does not match required data type', () => {
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});
    expect(refreshAuthenticationUseCase.execute({ refreshToken: 123 })).rejects.toThrow('REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating refresh access token correctly', async () => {
    const refreshToken = 'secret';
    const accessToken = 'secret-access';
    const dumbId = 'user-123';

    const mockAuthRepo = new AuthenticationRepository();
    const mockAuthTokenManager = new AuthenticationTokenManager();

    mockAuthTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ userId: dumbId }));
    mockAuthRepo.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve(accessToken));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({ authenticationRepository: mockAuthRepo, authenticationTokenManager: mockAuthTokenManager });

    const resultAccessToken = await refreshAuthenticationUseCase.execute({ refreshToken });

    expect(resultAccessToken).toBe(accessToken);
    expect(mockAuthTokenManager.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(mockAuthTokenManager.decodePayload).toHaveBeenCalledWith(refreshToken);
    expect(mockAuthRepo.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(mockAuthTokenManager.createAccessToken).toHaveBeenCalledWith({ userId: dumbId });
  });
});