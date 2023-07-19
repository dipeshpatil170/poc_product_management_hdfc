
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User');
const Product = require('./product');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

// Order.belongsTo(User, { foreignKey: 'id' });
// Order.belongsTo(Product,{ foreignKey: 'id' });

module.exports = Order;
