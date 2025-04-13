const NewAuth = require("../../Domains/authentications/entities/NewAuth");
const AuthenticateUser = require("../../Domains/users/entities/AuthenticateUser");

class AuthenticateUserUseCase {
  #userRepository; // private property ES2022
  #passwordHash;
  #authenticationTokenManager;
  #authenticationRepository;

  constructor({ userRepository, passwordHash, authenticationTokenManager, authenticationRepository }) {
    this.#authenticationRepository = authenticationRepository;
    this.#userRepository = userRepository;
    this.#authenticationTokenManager = authenticationTokenManager;
    this.#passwordHash = passwordHash;
  }

  async execute(payload) {
    const authenticateUser = new AuthenticateUser(payload);
    const encryptedPassword = await this.#userRepository.getPasswordByUsername(authenticateUser.username);
    await this.#passwordHash.compare(authenticateUser.password, encryptedPassword);
    const userId = await this.#userRepository.getIdByUsername(authenticateUser.username);
    const accessToken = await this.#authenticationTokenManager.createAccessToken({ userId });
    const refreshToken = await this.#authenticationTokenManager.createRefreshToken({ userId });
    await this.#authenticationRepository.addRefreshToken(refreshToken);
    return new NewAuth({ accessToken, refreshToken });
  }
}

module.exports = AuthenticateUserUseCase;