const http = require('http');
const url = require('url');
const { CONTENT_TYPE_APPLICATION_JSON, StatusCode, ErrorPhrases } = require('./utils/errorPhrase');
const userController = require('./controllers/userController');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { notFound } = require('./utils/utils');
require('dotenv').config();

const server = http.createServer((req, res) => {

    const { pathname, query } = url.parse(req.url, true);
    const method = req.method;


    if (method === 'POST' && pathname === '/users') {
        userController.createUser(req, res);
    } else if (method === 'POST' && pathname === '/users/login') {
        userController.userLogin(req, res);
    } else {
        customMiddleware(req, res, () => {
            if (method === 'GET' && pathname === '/users') {
                userController.getUsers(req, res);
            } else if (method === 'POST' && pathname === '/users/reset-password') {
                userController.userPasswordReset(req, res);
            } else if (method === 'POST' && pathname === '/products') {
                productController.createProduct(req, res);
            } else if (method === 'GET' && pathname === '/products') {
                productController.getProducts(req, res);
            } else if (method === 'GET' && pathname.includes('/product/')) {
                productController.getSingleProduct(req, res, pathname);
            } else if (method === 'POST' && pathname === '/products/order') {
                orderController.placeOrder(req, res);
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

        const decoded = jwt.verify(seperatedtoken, process.env.SECRET_KEY);

        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
            return res.end(JSON.stringify({ message: notFound('User', decoded.userId) }));
        }
        next();
    } catch (error) {
        console.error(error);
        res.writeHead(StatusCode.FORBIDDEN, CONTENT_TYPE_APPLICATION_JSON);
        return res.end(JSON.stringify({ message: `${ErrorPhrases.FORBIDDEN}- Issue in verifying token - ${error.message}` }));
    }
};


const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


