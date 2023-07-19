const Product = require("../models/product");
const { StatusCode, CONTENT_TYPE_APPLICATION_JSON, ErrorPhrases } = require("../utils/errorPhrase");
const { ErrorHandler } = require("../utils/utils");
const url = require('url');
const { Op } = require('sequelize');

const createProduct = async (req, res) => {
    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            const { name, price, description } = JSON.parse(body);

            const product = await Product.create({
                name,
                price,
                description,
            });

            res.writeHead(StatusCode.CREATED, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ data: product }));

        } catch (error) {
            res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorHandler(error) }));
        }
    });
}
const getProducts = async (req, res) => {
    try {
        const { query } = url.parse(req.url, true);
        const { page = 1, limit = 10, sortBy, sortOrder, filter } = query;
        console.log({
            page,
            limit,
            sortBy,
            sortOrder,
            filter
        });
        const options = {
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [],
            where: {},
        };

        if (sortBy) {
            const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
            options.order.push([sortBy, order]);
        }

        if (filter) {
            options.where = {
                [Op.or]: [
                    { name: { [Op.like]: `%${filter}%` } },
                    { description: { [Op.like]: `%${filter}%` } },
                ],
            };
        }
        const products = await Product.findAll(options);
        const totalCount = await Product.count(options);

        res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ data: products, count: totalCount }));
    } catch (error) {
        console.log(error)
        res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ message: ErrorHandler(error) }));
    }
}

const getSingleProduct = async (req, res, pathname) => {

    const id = pathname[pathname.length - 1];

    try {
        if (id) {
            const product = await Product.findByPk(id);
            if (!product) {
                res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ message: ErrorPhrases.DATA_NOT_FOUND }));
            } else {
                res.writeHead(StatusCode.SUCCESS, CONTENT_TYPE_APPLICATION_JSON);
                res.end(JSON.stringify({ data: product }));
            }

        } else {
            res.writeHead(StatusCode.NOT_FOUND, CONTENT_TYPE_APPLICATION_JSON);
            res.end(JSON.stringify({ message: ErrorPhrases.ID_NOT_FOUND }));
        }

    } catch (error) {
        res.writeHead(StatusCode.INTERNAL_SERVER_ERROR, CONTENT_TYPE_APPLICATION_JSON);
        res.end(JSON.stringify({ message: ErrorHandler(error) }));
    }
}



module.exports = {
    createProduct,
    getProducts,
    getSingleProduct
}