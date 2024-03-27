import dotenv from 'dotenv';
import Server from "./v1/models/server";

//Config dotend
dotenv.config();

const server = new Server();

server.listen();