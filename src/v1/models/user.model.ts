import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const User = sequelize.define('user',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },
     username:{
        type: DataTypes.STRING(30),
        unique:true,
        allowNull:false
     },
     password:{
        type: DataTypes.STRING(150),
        unique:false,
        allowNull:true
     }
});