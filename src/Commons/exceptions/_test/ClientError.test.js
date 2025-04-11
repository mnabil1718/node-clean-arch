const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw error when use ClientError directly', () => {
    expect(() => new ClientError('')).toThrow('cannot instantiate abstract class');
  });
});