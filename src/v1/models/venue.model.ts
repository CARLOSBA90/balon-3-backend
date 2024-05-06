import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
import { Team } from "./team.model";

export const Venue = sequelize.define('venue',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },
     external_id:{
        type: DataTypes.INTEGER,
        unique:true
     },
     name:{
        type: DataTypes.STRING(50),
        unique:true,
        allowNull:false
     },
     address:{
        type: DataTypes.STRING(100)
     },
     city:{
        type: DataTypes.STRING(50)
     },
     capacity:{
        type: DataTypes.INTEGER
     },
     surface:{
        type: DataTypes.STRING(20)
     },
     image:{
        type: DataTypes.STRING(150)
     },
     teamId:{
      type: DataTypes.INTEGER,
   } 
});

Team.hasOne(Venue);
Venue.belongsTo(Team);
 
