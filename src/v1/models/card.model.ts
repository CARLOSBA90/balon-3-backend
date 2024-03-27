import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const Card = sequelize.define('card',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },
     title:{
        type: DataTypes.STRING(100)
     },
     description:{
        type: DataTypes.STRING(2000)
     }
});