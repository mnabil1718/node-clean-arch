const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should return proper auth error', () => {
    const msg = 'authentication error';
    const authErr = new AuthenticationError(msg);

    expect(authErr.statusCode).toEqual(401);
    expect(authErr.message).toEqual(msg);
    expect(authErr.name).toEqual('AuthenticationError');
  });
});