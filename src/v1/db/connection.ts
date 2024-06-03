import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const dataBasePort = ()  => {
   return   Number(process.env.DB_PORT)? parseInt(process.env.DB_PORT||'3306') :3306;
}

const sequelize = new Sequelize(  
    process.env.DB_NAME|| '',
    process.env.DB_USER|| '',
    process.env.DB_PASSWORD|| '',
    { host: process.env.DB_HOST || 'localhost',
    port: dataBasePort(),
    dialect:'mysql',
        dialectOptions: {
            useUTC: false, 
            dateStrings: true,
            typeCast: true 
        },
        // config en produccion (server)
        timezone: '-03:00',

    },
  
)



export default sequelize;