import { DataTypes } from "sequelize";
import sequelize from "../db/connection";
import { Fixture } from "./fixture.model";

export const Card = sequelize.define('card',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
     },
     title:{
        type: DataTypes.STRING(100)
     },
     content:{
        type: DataTypes.TEXT
     },
     imageUrl:{
      type: DataTypes.STRING(255)
    },
     views:{
        type: DataTypes.BIGINT
     },
     active:{
        type: DataTypes.BOOLEAN
     },
     category:{
        type: DataTypes.TINYINT
     },
     fixtureId: {
      type: DataTypes.INTEGER,
      references: {
          model: Fixture,
          key: 'id'
      }
    }
}, 
{
   indexes: [
     {
       fields: ['fixtureId'],
     },
   ],
}
); 

Fixture.hasMany(Card, { foreignKey: 'fixtureId' });
Card.belongsTo(Fixture, { foreignKey: 'fixtureId' });