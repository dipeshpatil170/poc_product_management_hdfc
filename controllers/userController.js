const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/User");
const { StatusCode, CONTENT_TYPE_APPLICATION_JSON, ErrorPhrases } = require("../utils/errorPhrase");
const { ErrorHandler, SECRET_KEY } = require("../utils/utils");
const jwt = require('jsonwebtoken');
const Order = require("../models/order");

const createUser = async (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            const { username, email, password } = JSON.parse(body);

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            const token = jwt.sign({ userId: user.id }, SECRET_KEY);

            user.token = token;
            await user.save();

            res.writeHead(StatusCode.CREATED, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ data: user }));

        } catch (error) {
            res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorHandler(error) }));
        }
    });
}
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ include: [{ model: Order, required: false }], });
        res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ data: users }));
    } catch (error) {
        console.log(error)
        res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ message: ErrorHandler(error) }));
    }
}

const userLogin = async (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', async () => {
        try {
            const { username, password } = JSON.parse(body);

            const user = await User.findOne({ where: { username: username } });

            if (!user) {
                res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ message: ErrorPhrases.USER_NOT_FOUND }));
            }

            const isMatched = await bcrypt.compare(password, user.password);

            if (!isMatched) {
                res.writeHead(StatusCode.UNAUTHORIZED, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ message: ErrorPhrases.INVALID_CREDENTIALS }));
            } else {
                res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ data: user }));
            }

        } catch (error) {
            res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorHandler(error) }));
        }
    });
};
const userPasswordReset = async (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', async () => {
        try {
            const { password } = JSON.parse(body);

            const token = req.headers.authorization;
            const tokenRegex = /^Bearer (.+)$/i;
            const matches = token.match(tokenRegex);

            if (!matches || matches.length < 2) {
                return false;
            }
            const seperatedtoken = matches[1];

            const decoded = jwt.verify(seperatedtoken, SECRET_KEY);

            const user = await User.findByPk(decoded.userId);

            if (!user) {
                res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ message: ErrorPhrases.USER_NOT_FOUND }));
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;

            await user.save();

            res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ data: "User password has been reset" }));

        } catch (error) {
            res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorHandler(error) }));
        }
    });
};

module.exports = {
    createUser,
    getUsers,
    userLogin,
    userPasswordReset
}