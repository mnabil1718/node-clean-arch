const AuthenticateUserUseCase = require("../../../../Applications/use_case/AuthenticateUserUseCase");
const DeleteAuthenticationUseCase = require("../../../../Applications/use_case/DeleteAuthenticationUseCase");
const RefreshAuthenticationUseCase = require("../../../../Applications/use_case/RefreshAuthenticationUseCase");

class AuthenticationsHandler {
  #container;
  constructor(container) {
    this.#container = container;

    this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
    this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
    this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
  };

  async postAuthenticationsHandler(request, h) {
    const authenticateUserUseCase = this.#container.getInstance(AuthenticateUserUseCase.name);
    const { accessToken, refreshToken } = await authenticateUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationsHandler(request, h) {
    const refreshAuthenticationUserUseCase = this.#container.getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
    return response;
  }

  async deleteAuthenticationsHandler(request, h) {
    const deleteAuthenticationUseCase = this.#container.getInstance(DeleteAuthenticationUseCase.name);
    await deleteAuthenticationUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
    });
    return response;

  }


}

module.exports = AuthenticationsHandler;