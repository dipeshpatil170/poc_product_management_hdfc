const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/User");
const { StatusCode, CONTENT_TYPE_APPLICATION_JSON } = require("../utils/errorPhrase");
const { ErrorHandler, SECRET_KEY } = require("../utils/utils");
const jwt = require('jsonwebtoken');

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
            res.end(JSON.stringify({ user, token }));

        } catch (error) {
            res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorHandler(error) }));
        }
    });
}
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ users }));
    } catch (error) {
        console.log(error)
        res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ message: ErrorHandler(error) }));
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("id ", id);

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById
}