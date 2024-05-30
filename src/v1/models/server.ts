import express, {Application} from 'express';
import cors from 'cors';
import routesCard from '../routes/card.router';
import routesUser from '../routes/user.router';
import routesFixture from '../routes/fixture.router';
import { checkServerStatus } from '../controllers/server.controller';


class Server {
    private app: Application;
    private port: string;

    constructor(){
        
       this.app=express();
       this.port= process.env.PORT || '3000';
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
        this.app.use('/api/v1/cards', routesCard);
        this.app.use('/api/v1/users', routesUser);
        this.app.use('/api/v1/fixtures', routesFixture);
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