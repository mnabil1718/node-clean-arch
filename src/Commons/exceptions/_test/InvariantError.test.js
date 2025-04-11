const InvariantError = require('../InvariantError');

describe('InvariantError', () => {
  it('should produce proper invariant error', () => {
    const msg = 'an error occurs';
    const invariantErr = new InvariantError(msg);

    expect(invariantErr.statusCode).toEqual(400);
    expect(invariantErr.message).toEqual(msg);
    expect(invariantErr.name).toEqual('InvariantError');
  });
});