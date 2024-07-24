import express, {Application} from 'express';
import cors from 'cors';
import routesCard from '../routes/card.router';
import { checkServerStatus } from '../services/server.service';


class Server {
    private app: Application;
    private port: string;

    constructor(){
        
       this.app=express();
       this.port= process.env.PORT || '4501';
       this.middlewares();
       this.routes();
       this.startServer();
        
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log("App running in PORT: "+this.port);
        });
    }

    routes(){
        this.app.use('/v1/cards', routesCard);
    }

    middlewares(){
        // PARSING BODY
     this.app.use(express.json());

        // CORS
     this.app.use(cors());
    }


    async startServer(){
        try {
            await checkServerStatus();
        } catch (error:any) {
            console.error("Unable to connect to database: "+error.message);
        }
    }
}

export default Server;