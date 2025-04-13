const AuthenticateUser = require('../entities/AuthenticateUser');

describe('AuthenticateUser', () => {
  it('should contain error when payload did not contain needed properties', () => {
    const payload = {
      username: 'abc',
    };

    expect(() => new AuthenticateUser(payload)).toThrow('AUTHENTICATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      fullname: true,
      password: 'abc',
    };

    expect(() => new AuthenticateUser(payload)).toThrow('AUTHENTICATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create authenticateUser object correctly', () => {
    const payload = {
      username: 'dicoding',
      password: 'abc',
    };

    const { username, password } = new AuthenticateUser(payload);

    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});