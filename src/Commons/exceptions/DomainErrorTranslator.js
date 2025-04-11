const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate: (error) => {
    return DomainErrorTranslator._directories[error.message] || error;
  }
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('cannot register. missing properties.'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('cannot register. data type doest not match.'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('cannot register. username exceeds character limit.'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('cannot register. username contains forbidden characters.'),
};

module.exports = DomainErrorTranslator;