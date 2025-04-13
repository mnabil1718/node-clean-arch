const AuthenticationTokenManager = require("../AuthenticationTokenManager");

describe('AuthenticationTokenManager', () => {
  it('should throw error when invoke abstract class', () => {
    const tokenManager = new AuthenticationTokenManager({});

    expect(tokenManager.createAccessToken).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(tokenManager.createRefreshToken).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(tokenManager.verifyRefreshToken).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    expect(tokenManager.decodePayload).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});