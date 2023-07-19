const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'poc_hdfc',
    'root',
    'root',
    {
        host: 'localhost',
        dialect: 'mysql',
    }
);  
module.exports = sequelize;


