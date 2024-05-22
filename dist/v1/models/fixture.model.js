"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fixture = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const team_model_1 = require("./team.model");
const venue_model_1 = require("./venue.model");
exports.Fixture = connection_1.default.define('fixture', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    external_id: {
        type: sequelize_1.DataTypes.INTEGER,
        unique: true
    },
    date: {
        type: sequelize_1.DataTypes.DATE
    },
    homeIdTeam: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: team_model_1.Team,
            key: 'id'
        }
    },
    awayIdTeam: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: team_model_1.Team,
            key: 'id'
        }
    },
    venueId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: venue_model_1.Venue,
            key: 'id'
        }
    }
});
team_model_1.Team.hasMany(exports.Fixture, { as: 'HomeFixtures', foreignKey: 'homeIdTeam' });
team_model_1.Team.hasMany(exports.Fixture, { as: 'AwayFixtures', foreignKey: 'awayIdTeam' });
exports.Fixture.belongsTo(team_model_1.Team, { as: 'HomeTeam', foreignKey: 'homeIdTeam' });
exports.Fixture.belongsTo(team_model_1.Team, { as: 'AwayTeam', foreignKey: 'awayIdTeam' });
venue_model_1.Venue.hasMany(exports.Fixture, { foreignKey: 'venueId' });
exports.Fixture.belongsTo(venue_model_1.Venue, { foreignKey: 'venueId' });
