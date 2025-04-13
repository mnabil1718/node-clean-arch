/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const pool = require('./databases/postgresql/pool');
const Jwt = require('@hapi/jwt');

// service (repository, helper, manager, etc)
const UserRepositoryPostgresql = require('./repository/UserRepositoryPostgresql');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const AuthenticationRepositoryPostgresql = require('./repository/AuthenticationRepositoryPostgresql');
const AuthenticateUserUseCase = require('../Applications/use_case/AuthenticateUserUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtAuthenticationTokenManager = require('../Infrastructures/security/JwtTokenManager');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const DeleteAuthenticationUseCase = require('../Applications/use_case/DeleteAuthenticationUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgresql,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgresql,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtAuthenticationTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

// registering use cases
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },
  {
    key: AuthenticateUserUseCase.name,
    Class: AuthenticateUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name,
        },
      ],
    },
  },
  {
    key: DeleteAuthenticationUseCase.name,
    Class: DeleteAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;