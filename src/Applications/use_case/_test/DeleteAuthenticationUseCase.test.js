const AuthenticationRepository = require("../../../Domains/authentications/AuthenticationRepository");
const DeleteAuthenticationUseCase = require("../DeleteAuthenticationUseCase");

describe('DeleteAuthenticationUseCase', () => {
  it('should throw Error when payload empty', async () => {
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});
    expect(deleteAuthenticationUseCase.execute({})).rejects.toThrow('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw Error when payload does not match required data type', () => {
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});
    expect(deleteAuthenticationUseCase.execute({ refreshToken: 123 })).rejects.toThrow('DELETE_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating delete refresh token correctly', async () => {
    const refreshToken = 'secret';

    const mockAuthRepo = new AuthenticationRepository();

    mockAuthRepo.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    mockAuthRepo.deleteRefreshToken = jest.fn().mockImplementation(() => Promise.resolve());
    const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({ authenticationRepository: mockAuthRepo });

    await deleteAuthenticationUseCase.execute({ refreshToken });

    expect(mockAuthRepo.verifyRefreshToken).toHaveBeenCalledWith(refreshToken);
    expect(mockAuthRepo.deleteRefreshToken).toHaveBeenCalledWith(refreshToken);
  });
});