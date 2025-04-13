const JwtTokenManager = require("../JwtTokenManager");
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const Jwt = require('@hapi/jwt');
const config = require('../../../Commons/config');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      const payload = {
        username: 'dicoding'
      };
      const mockToken = 'mock-token';
      const mockJwt = {
        generate: jest.fn().mockImplementation(() => mockToken) // using mock because we can't know the generated token
      };
      const jwtTokenManager = new JwtTokenManager(mockJwt);

      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(accessToken).toEqual(mockToken);
      expect(mockJwt.generate).toHaveBeenCalledWith(payload, config.jwt.accessTokenSecret);
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      const payload = {
        username: 'dicoding'
      };
      const mockToken = 'mock-token';
      const mockJwt = {
        generate: jest.fn().mockImplementation(() => mockToken) // using mock because we can't know the generated token
      };
      const jwtTokenManager = new JwtTokenManager(mockJwt);

      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      expect(refreshToken).toEqual(mockToken);
      expect(mockJwt.generate).toHaveBeenCalledWith(payload, config.jwt.refreshTokenSecret);
    });
  });


  describe('should verify refresh token correctly', () => {
    it('should throw InvariantError when verification failed', async () => {
      const payload = { username: 'dicoding' };
      const jwtTokenManager = new JwtTokenManager(Jwt.token); // using @hapi/jwt because we don't need expected token
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError);
    });


    it('should not throw InvariantError when verification succeed', async () => {
      const payload = { username: 'dicoding' };
      const jwtTokenManager = new JwtTokenManager(Jwt.token); // using @hapi/jwt because we don't need expected token
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('should decode payload correctly', () => {
    it('should decode payload correctly', async () => {
      const payload = { username: 'jaja07' };
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accToken = await jwtTokenManager.createAccessToken(payload);

      const { username } = await jwtTokenManager.decodePayload(accToken);

      expect(username).toEqual(payload.username);
    });
  });

});