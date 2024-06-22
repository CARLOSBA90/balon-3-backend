"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const fixture_model_1 = require("./fixture.model");
exports.Card = connection_1.default.define('card', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100)
    },
    content: {
        type: sequelize_1.DataTypes.TEXT
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING(255)
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
    fixtureId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: fixture_model_1.Fixture,
            key: 'id'
        }
    }
}, {
    indexes: [
        {
            fields: ['fixtureId'],
        },
    ],
});
fixture_model_1.Fixture.hasMany(exports.Card, { foreignKey: 'fixtureId' });
exports.Card.belongsTo(fixture_model_1.Fixture, { foreignKey: 'fixtureId' });
