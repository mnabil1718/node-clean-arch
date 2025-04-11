const NotFoundError = require('../NotFoundError');

describe('NotFoundError', () => {
  it('should return proper not found error properties', () => {
    const msg = 'not found';
    const notFoundErr = new NotFoundError(msg);

    expect(notFoundErr.statusCode).toEqual(404);
    expect(notFoundErr.message).toEqual(msg);
    expect(notFoundErr.name).toEqual('NotFoundError');

  });
});