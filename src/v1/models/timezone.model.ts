import { DataTypes } from "sequelize";
import sequelize from "../db/connection";

export const Timezone = sequelize.define('timezone',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },
     description:{
        type: DataTypes.STRING(60),
        unique:true,
        allowNull:false
     },
},
{
   indexes: [
     {
       unique: true,
       fields: ['description'],
     },
   ],
 }
);