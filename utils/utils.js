
const ErrorHandler = (error) => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return `Duplicate entry: ${error.errors[0].message}`;
    } else {
        return error;
    }
}

const SECRET_KEY = 'HDFC';

module.exports = {
    ErrorHandler,
    SECRET_KEY,
}