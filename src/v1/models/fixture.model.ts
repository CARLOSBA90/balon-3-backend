import { DataTypes } from "sequelize";
import sequelize from "../db/connection";



export const Card = sequelize.define('fixture',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },


});