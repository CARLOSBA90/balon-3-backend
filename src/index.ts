import dotenv from 'dotenv';
import Server from "./models/server";

//Config dotend
dotenv.config();

const server = new Server();

server.listen();