const INTERNAL_SERVER_ERROR = 'Something went wrong';
const CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': 'application/json' };

const StatusCode = {
    SUCCESS: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
}

const ErrorPhrases = {
    END_POINT_NOT_FOUND: 'The endpoint you are trying to access is not found.',
    TOKEN_NOT_PROVIDED: 'Token not provoided',
    UNAUTHORIZED: 'Unauthorized',
    INVALID_TOKEN: 'Invalid Token',
    FORBIDDEN: 'forbidden',
    USER_NOT_FOUND: 'User not found'
}

module.exports = {
    INTERNAL_SERVER_ERROR,
    CONTENT_TYPE_APPLICATION_JSON,
    StatusCode,
    ErrorPhrases
}