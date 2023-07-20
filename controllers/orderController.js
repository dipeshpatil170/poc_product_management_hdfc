
const { StatusCode, CONTENT_TYPE_APPLICATION_JSON } = require('../utils/errorPhrase');
const { ErrorHandler, extractUserId, notFound } = require('../utils/utils');
const Product = require('../models/product');
const Order = require('../models/order');

const placeOrder = async (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            const { productId, quantity } = JSON.parse(body);

            const userId = await extractUserId(req);

            const product = await Product.findByPk(productId);
            if (!product) {
                res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ message: notFound('Product', productId) }));
            } else {
                const totalPrice = product.price * quantity;

                const order = await Order.create({
                    quantity,
                    totalPrice,
                    userId: userId,
                    productId: productId,
                });

                res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ data: order, count: 0 }));
            }

        } catch (error) {
            console.error("error ", error)
            res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorHandler(error) }));
        }
    });


};

module.exports = {
    placeOrder
}