import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
import { Team } from "./team.model";
import { Venue } from "./venue.model";



export const Fixture = sequelize.define('fixture',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },
     external_id:{
        type: DataTypes.INTEGER,
        unique:true
     },
     date:{
        type: DataTypes.DATE
     },
     homeIdTeam:{
        type: DataTypes.INTEGER,
        references: {
            model: Team,
            key: 'id'
        }
     },
     awayIdTeam:{
        type: DataTypes.INTEGER,
        references: {
            model: Team,
            key: 'id'
        }
     },
     venueId:{
        type: DataTypes.INTEGER,
        references: {
            model: Venue,
            key: 'id'
        }
     }
});

Team.hasMany(Fixture, { as: 'HomeFixtures', foreignKey: 'homeIdTeam' });
Team.hasMany(Fixture, { as: 'AwayFixtures', foreignKey: 'awayIdTeam' });
Fixture.belongsTo(Team, { as: 'HomeTeam', foreignKey: 'homeIdTeam' });
Fixture.belongsTo(Team, { as: 'AwayTeam', foreignKey: 'awayIdTeam' });

Venue.hasMany(Fixture, { foreignKey: 'venueId' });
Fixture.belongsTo(Venue, { foreignKey: 'venueId' });
