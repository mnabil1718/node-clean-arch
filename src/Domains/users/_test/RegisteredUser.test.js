const RegisteredUser = require("../entities/RegisteredUser");

describe('RegisteredUser', () => {
  it('it should throw error when payload did not contain needed property', () => {
    const payload = {
      username: 'dicoding',
      fullname: 'Dicoding Indonesia'
    };

    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'id-123',
      username: 123,
      fullname: true,
    };

    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return proper registeredUser object', () => {
    const payload = {
      id: 'id-123',
      username: 'Dicoding',
      fullname: 'Dicoding Indonesia'
    };

    const res = new RegisteredUser(payload);

    expect(res.id).toEqual(payload.id);
    expect(res.username).toEqual(payload.username);
    expect(res.fullname).toEqual(payload.fullname);
  });
});