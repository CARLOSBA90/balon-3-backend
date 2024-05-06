import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const Team = sequelize.define('team',{
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
     code:{
        type: DataTypes.STRING(10)
     },
     country:{
        type: DataTypes.STRING(50)
     },
     founded:{
        type: DataTypes.DATE
     },
     national:{
        type: DataTypes.BOOLEAN
     },
     logo:{
        type: DataTypes.STRING(150)
     }

});
 
