"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timezone = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Timezone = connection_1.default.define('timezone', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: sequelize_1.DataTypes.STRING(60),
        unique: true,
        allowNull: false
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['description'],
        },
    ],
});
