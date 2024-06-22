"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venue = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const team_model_1 = require("./team.model");
exports.Venue = connection_1.default.define('venue', {
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
    address: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    city: {
        type: sequelize_1.DataTypes.STRING(50)
    },
    capacity: {
        type: sequelize_1.DataTypes.INTEGER
    },
    surface: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    image: {
        type: sequelize_1.DataTypes.STRING(150)
    },
    teamId: {
        type: sequelize_1.DataTypes.INTEGER,
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['external_id'],
        },
        {
            unique: true,
            fields: ['name'],
        },
    ],
});
team_model_1.Team.hasOne(exports.Venue);
exports.Venue.belongsTo(team_model_1.Team);
