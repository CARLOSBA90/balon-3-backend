"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const card_router_1 = __importDefault(require("../routes/card.router"));
const server_service_1 = require("../services/server.service");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '4501';
        this.middlewares();
        this.routes();
        this.startServer();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("App running in PORT: " + this.port);
        });
    }
    routes() {
        this.app.use('/v1/cards', card_router_1.default);
    }
    middlewares() {
        // PARSING BODY
        this.app.use(express_1.default.json());
        // CORS
        this.app.use((0, cors_1.default)());
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, server_service_1.checkServerStatus)();
            }
            catch (error) {
                console.error("Unable to connect to database: " + error.message);
            }
        });
    }
}
exports.default = Server;
