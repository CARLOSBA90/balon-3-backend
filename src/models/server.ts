import express, {Application} from 'express';

class Server {
    private app: Application;
    private port: string;

    constructor(){
        this.app=express();
        this.port= process.env.PORT || '3000';
       // this.app.listen();
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log("App running in PORT: "+this.port);
        });
    }
}

export default Server;