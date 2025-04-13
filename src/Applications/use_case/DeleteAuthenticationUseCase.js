class DeleteAuthenticationUseCase {
  #authenticationRepository;
  constructor({ authenticationRepository }) {
    this.#authenticationRepository = authenticationRepository;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { refreshToken } = payload;

    await this.#authenticationRepository.verifyRefreshToken(refreshToken);
    await this.#authenticationRepository.deleteRefreshToken(refreshToken);
  }

  _verifyPayload({ refreshToken }) {
    if (!refreshToken) {
      throw Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteAuthenticationUseCase;