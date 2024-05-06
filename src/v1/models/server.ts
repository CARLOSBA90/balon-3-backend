import express, {Application} from 'express';
import cors from 'cors';
import routesCard from '../routes/card.router';
import routesUser from '../routes/user.router';
import { Card } from './card.model';
import { User } from './user.model';
import { Timezone } from './timezone.model';
import { getTimeZones } from '../controllers/timezone.controller';
import { Team } from './team.model';
import { Venue } from './venue.model';
import { getTeams } from '../controllers/team.controller';


class Server {
    private app: Application;
    private port: string;

    constructor(){
        
       this.app=express();
       this.port= process.env.PORT || '3000';
       this.middlewares();
       this.routes();
       this.dbConnect();
       this.startServer();
        
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log("App running in PORT: "+this.port);
        });
    }

    routes(){
        this.app.use('/api/v1/cards', routesCard);
        this.app.use('/api/v1/users', routesUser);
    }

    middlewares(){
        // Parese body
     this.app.use(express.json());

        // CORS
     this.app.use(cors());
    }

    async dbConnect(){
        try {
            await Card.sync();
            await User.sync();
            await Timezone.sync();
            await Team.sync();
            await Venue.sync();
        } catch (error:any) {
            console.error("Unable to connect to database: "+error.message);
            
        }

    }

    startServer(){
      //getTimeZones();
      //getTeams();
    }
}

export default Server;