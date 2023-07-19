const http = require('http');
const url = require('url');
const { CONTENT_TYPE_APPLICATION_JSON, StatusCode, ErrorPhrases } = require('./utils/errorPhrase');
const userController = require('./controllers/userController');
const { SECRET_KEY } = require('./utils/utils');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const server = http.createServer((req, res) => {

    const { pathname, query } = url.parse(req.url, true);
    const method = req.method;

    if (method === 'POST' && pathname === '/users') {
        userController.createUser(req, res);
    } else {
        customMiddleware(req, res, () => {
            if (method === 'GET' && pathname === '/users') {
                userController.getUsers(req, res);
            } else {
                res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ message: ErrorPhrases.END_POINT_NOT_FOUND }));
            }
        });
    }

});
const customMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        if (!token) {
            res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
            return res.end(JSON.stringify({ message: ErrorPhrases.TOKEN_NOT_PROVIDED }));
        }
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
            return res.end(JSON.stringify({ message: ErrorPhrases.USER_NOT_FOUND }));
        }
        next();
    } catch (error) {
        console.error(error);
        res.writeHead(StatusCode.FORBIDDEN, CONTENT_TYPE_APPLICATION_JSON);
        return res.end(JSON.stringify({ message: `${ErrorPhrases.FORBIDDEN}- Issue in verifying token` }));
    }
};

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


