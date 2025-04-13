const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../databases/postgresql/pool');
const JwtTokenManager = require('../../security/JwtTokenManager');
const Jwt = require('@hapi/jwt');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');

describe('/authentications endpoints', () => {

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.truncateTable();
    await AuthenticationsTableTestHelper.truncateTable();
  });

  describe('when /POST authentications', () => {
    it('should respond 400 when username not found', async () => {
      const payload = {
        username: 'jaja007',
        password: 'jaja123',
      };

      const server = await createServer(container);

      const response = await server.inject({ method: 'POST', url: '/authentications', payload });

      const jsonRes = await JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(jsonRes.status).toEqual('fail');
      expect(jsonRes.message).toEqual('username not found.');
    });

    it('should respond 401 when password is not correct', async () => {
      const initPayload = {
        username: 'jaja007',
        password: 'jaja123',
        fullname: 'Jaja Miharja',
      };

      const payload = {
        username: 'jaja007',
        password: 'jaja007',
      };

      const server = await createServer(container);
      await server.inject({ method: 'POST', url: '/users', payload: initPayload });

      const response = await server.inject({ method: 'POST', url: '/authentications', payload });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(401);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('invalid credentials.');
    });

    it('should respond 400 when given payload with missing properties', async () => {

      const payload = {
        username: 'jaja007',
      };

      const server = await createServer(container);

      const response = await server.inject({ method: 'POST', url: '/authentications', payload });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('cannot authenticate. missing properties.');
    });

    it('should respond 400 when given payload with invalid data type', async () => {

      const payload = {
        username: 123,
        password: true
      };

      const server = await createServer(container);

      const response = await server.inject({ method: 'POST', url: '/authentications', payload });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('cannot authenticate. data type doesnt not match.');
    });

    it('should return correct data when authentication succeeded', async () => {

      const payload = {
        username: 'dicoding',
        password: 'secret123',
        fullname: 'Dicoding Indonesia',
      };

      const server = await createServer(container);
      await server.inject({ method: 'POST', url: '/users', payload });

      const response = await server.inject({ method: 'POST', url: '/authentications', payload: { username: payload.username, password: payload.password } });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(201);
      expect(jsonRes.status).toBe('success');
      expect(jsonRes.data.accessToken).toBeDefined();
      expect(jsonRes.data.refreshToken).toBeDefined();
    });
  });

  describe('when /PUT authentications', () => {
    it('should respond 400 when refresh token is invalid', async () => {
      const payload = {
        refreshToken: 'invalid'
      };
      const server = await createServer(container);

      const response = await server.inject({ method: 'PUT', url: '/authentications', payload });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('invalid refresh token.');
    });

    it('should respond 400 when refresh token does not exists in database', async () => {
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ userId: 'user-123' });
      const server = await createServer(container);

      const response = await server.inject({ method: 'PUT', url: '/authentications', payload: { refreshToken } });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('invalid refresh token.');
    });

    it('should respond 400 if payload missing properties', async () => {
      const server = await createServer(container);

      const response = await server.inject({ method: 'PUT', url: '/authentications', payload: {} });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('cannot refresh authentication. missing properties.');
    });

    it('should respond 400 if payload did not meet data type specifications', async () => {
      const server = await createServer(container);

      const response = await server.inject({ method: 'PUT', url: '/authentications', payload: { refreshToken: 123 } });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('cannot refresh authentication. data type doesnt match.');
    });

    it('should return correct data when refresh authentication succeeded', async () => {

      const registerPayload = {
        username: 'nabil',
        password: 'nabil123',
        fullname: 'M Nabil',
      };

      const loginPayload = {
        username: registerPayload.username,
        password: registerPayload.password,
      };

      const server = await createServer(container);
      // register user
      await server.inject({ method: 'POST', url: '/users', payload: registerPayload });
      // login
      const loginRes = await server.inject({ method: 'POST', url: '/authentications', payload: loginPayload });
      // get refresh token
      const { data: { refreshToken } } = await JSON.parse(loginRes.payload);

      // re-generate access token with refresh token
      const response = await server.inject({ method: 'PUT', url: '/authentications', payload: { refreshToken } });

      const responseJson = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toBe('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });
  });

  describe('when /DELETE authentications', () => {
    it('should respond 400 when refresh token is invalid', async () => {
      const payload = {
        refreshToken: 'invalid'
      };
      const server = await createServer(container);

      const response = await server.inject({ method: 'DELETE', url: '/authentications', payload });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('invalid refresh token.');
    });

    it('should respond 400 when refresh token does not exists in database', async () => {
      const refreshToken = await container.getInstance(AuthenticationTokenManager.name).createRefreshToken({ userId: 'user-123' });
      const server = await createServer(container);

      const response = await server.inject({ method: 'DELETE', url: '/authentications', payload: { refreshToken } });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('invalid refresh token.');
    });

    it('should respond 400 if payload missing properties', async () => {
      const server = await createServer(container);

      const response = await server.inject({ method: 'DELETE', url: '/authentications', payload: {} });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('cannot delete authentication. missing properties.');
    });

    it('should respond 400 if payload did not meet data type specifications', async () => {
      const server = await createServer(container);

      const response = await server.inject({ method: 'DELETE', url: '/authentications', payload: { refreshToken: 123 } });

      const jsonRes = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(400);
      expect(jsonRes.status).toBe('fail');
      expect(jsonRes.message).toBe('cannot delete authentication. data type doesnt match.');
    });

    it('should return correct data when delete authentication succeeded', async () => {

      const registerPayload = {
        username: 'nabil',
        password: 'nabil123',
        fullname: 'M Nabil',
      };

      const loginPayload = {
        username: registerPayload.username,
        password: registerPayload.password,
      };

      const server = await createServer(container);
      // register user
      await server.inject({ method: 'POST', url: '/users', payload: registerPayload });
      // login
      const loginRes = await server.inject({ method: 'POST', url: '/authentications', payload: loginPayload });
      // get refresh token
      const { data: { refreshToken } } = await JSON.parse(loginRes.payload);

      // delete user auth
      const response = await server.inject({ method: 'DELETE', url: '/authentications', payload: { refreshToken } });

      const responseJson = await JSON.parse(response.payload);
      expect(response.statusCode).toBe(200);
      expect(responseJson.status).toBe('success');
    });
  });


});