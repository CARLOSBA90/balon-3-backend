import express, {Application} from 'express';
import routesCard from '../routes/card.router';
import routesUser from '../routes/user.router';
import { Card } from './card.model';
import { User } from './user.model';


class Server {
    private app: Application;
    private port: string;

    constructor(){
        
       this.app=express();
       this.port= process.env.PORT || '3000';
       this.middlewares();
       this.routes();
       this.dbConnect();
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
     this.app.use(express.json());
    }

    async dbConnect(){
        try {
            await Card.sync();
            await User.sync();
        } catch (error:any) {
            console.error("Unable to connect to database: "+error.message);
            
        }

    }
}

export default Server;