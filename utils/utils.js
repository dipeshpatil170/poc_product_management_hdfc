const jwt = require('jsonwebtoken');

const ErrorHandler = (error) => {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return `Duplicate entry: ${error.errors[0].message}`;
    } else {
        return error;
    }
}

const extractUserId = async (req) => {
    const token = req.headers.authorization;
    try {
        if (!token) {
            return;
        }
        const tokenRegex = /^Bearer (.+)$/i;
        const matches = token.match(tokenRegex);

        if (!matches || matches.length < 2) {
            return false;
        }
        const seperatedtoken = matches[1];

        const decoded = jwt.verify(seperatedtoken, process.env.SECRET_KEY);

        return decoded.userId;
    } catch (error) {
        console.error(error);
        return;
    }
};

const notFound = (pageName, id) => {
    return `${pageName} not found with id ${id}`
}



module.exports = {
    ErrorHandler,
    extractUserId,
    notFound
}