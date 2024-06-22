"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
const dataBasePort = () => {
    return Number(process.env.DB_PORT) ? parseInt(process.env.DB_PORT || '3306') : 3306;
};
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || '', process.env.DB_USER || '', process.env.DB_PASSWORD || '', { host: process.env.DB_HOST || 'localhost',
    port: dataBasePort(),
    dialect: 'mysql',
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    // config en produccion (server)
    timezone: '-03:00',
});
exports.default = sequelize;
