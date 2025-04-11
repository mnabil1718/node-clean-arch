const RegisteredUser = require("../../../Domains/users/entities/RegisteredUser");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const UserRepository = require("../../../Domains/users/UserRepository");
const PasswordHash = require("../../security/PasswordHash");
const AddUserUserCase = require("../AddUserUseCase");

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const dumbId = 'user-123';
    const encryptedPass = 'encrypted_pass';

    // DTO to input to use case
    const payload = {
      username: 'cucibaju123',
      password: 'plain_pass',
      fullname: 'Dicoding Indonesia',
    };

    // DTO from use case to repo
    const mockRegisterUser = new RegisterUser({
      username: payload.username,
      password: encryptedPass,
      fullname: payload.fullname
    });

    // DTO returned from use case
    const mockRegisteredUser = new RegisteredUser({
      id: dumbId,
      username: payload.username,
      fullname: payload.fullname
    });

    const mockUserRepo = new UserRepository();
    const mockPassHasher = new PasswordHash();

    // mind that this sequence is a step by step calls on how to register a new user
    mockUserRepo.verifyAvailableUsername = jest.fn().mockImplementation(() => Promise.resolve());
    mockPassHasher.hash = jest.fn().mockImplementation(() => Promise.resolve(encryptedPass));
    mockUserRepo.addUser = jest.fn().mockImplementation(() => Promise.resolve(mockRegisteredUser));
    const addUserUseCase = new AddUserUserCase({ userRepository: mockUserRepo, passwordHash: mockPassHasher });

    const registeredUser = await addUserUseCase.execute(payload);


    expect(registeredUser).toStrictEqual(mockRegisteredUser);

    // step by step calls assertions
    expect(mockUserRepo.verifyAvailableUsername).toHaveBeenCalledWith(payload.username);
    expect(mockPassHasher.hash).toHaveBeenCalledWith(payload.password);
    expect(mockUserRepo.addUser).toHaveBeenCalledWith(mockRegisterUser);

  });
});