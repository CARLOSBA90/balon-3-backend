"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Card = connection_1.default.define('card', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    description: {
        type: sequelize_1.DataTypes.STRING(2000)
    },
    views: {
        type: sequelize_1.DataTypes.BIGINT
    },
    active: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    category: {
        type: sequelize_1.DataTypes.TINYINT
    },
    dateCreated: {
        type: sequelize_1.DataTypes.DATE
    },
    dateModified: {
        type: sequelize_1.DataTypes.DATE
    }
});
