const RegisterUser = require("../../Domains/users/entities/RegisterUser");

class AddUserUserCase {
  constructor({ userRepository, passwordHash }) {
    this.userRepository = userRepository;
    this.passwordHash = passwordHash;
  };

  async execute(payload) {
    const registerUser = new RegisterUser(payload);
    await this.userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this.passwordHash.hash(registerUser.password);
    return this.userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUserCase;