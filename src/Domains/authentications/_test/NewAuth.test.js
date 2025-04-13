const NewAuth = require("../entities/NewAuth");

describe('NewAuth', () => {
  it('it should throw error when payload did not contain needed property', () => {
    const payload = {
      accessToken: 'dicoding',
    };

    expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      accessToken: 123,
      refreshToken: true,
    };

    expect(() => new NewAuth(payload)).toThrow('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return proper newAuth object', () => {
    const payload = {
      accessToken: 'secret',
      refreshToken: 'secret'
    };

    const res = new NewAuth(payload);

    expect(res.accessToken).toEqual(payload.accessToken);
    expect(res.refreshToken).toEqual(payload.refreshToken);
  });
});