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
    END_POINT_NOT_FOUND: 'The endpoint you are attempting to access cannot be found.',
    TOKEN_NOT_PROVIDED: 'Token not provided.',
    UNAUTHORIZED: 'Access unauthorized.',
    INVALID_TOKEN: 'The token provided is invalid.',
    FORBIDDEN: 'Access forbidden.',
    USER_NOT_FOUND: 'The user could not be found.',
    INVALID_CREDENTIALS: 'Invalid credentials; please double-check your login information and try again.',
    ID_NOT_FOUND: 'The specified ID was not found in the URL.',
    DATA_NOT_FOUND: 'The data you are attempting to search for is not found.'
}

module.exports = {
    INTERNAL_SERVER_ERROR,
    CONTENT_TYPE_APPLICATION_JSON,
    StatusCode,
    ErrorPhrases
}