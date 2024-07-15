"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Team = connection_1.default.define('team', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    external_id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    code: {
        type: sequelize_1.DataTypes.STRING(10)
    },
    country: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    founded: {
        type: sequelize_1.DataTypes.DATE
    },
    national: {
        type: sequelize_1.DataTypes.BOOLEAN
    },
    logo: {
        type: sequelize_1.DataTypes.STRING(150)
    }
});
