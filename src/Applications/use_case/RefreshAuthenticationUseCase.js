class RefreshAuthenticationUseCase {
  #authenticationTokenManager;
  #authenticationRepository;
  constructor({ authenticationRepository, authenticationTokenManager }) {
    this.#authenticationRepository = authenticationRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { refreshToken } = payload;

    await this.#authenticationTokenManager.verifyRefreshToken(refreshToken);
    const { userId } = await this.#authenticationTokenManager.decodePayload(refreshToken);
    await this.#authenticationRepository.verifyRefreshToken(refreshToken);
    return this.#authenticationTokenManager.createAccessToken({ userId });
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshAuthenticationUseCase;