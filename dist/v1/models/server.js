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
const user_router_1 = __importDefault(require("../routes/user.router"));
const fixture_router_1 = __importDefault(require("../routes/fixture.router"));
const fixture_controller_1 = require("../controllers/fixture.controller");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
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
        this.app.use('/api/v1/cards', card_router_1.default);
        this.app.use('/api/v1/users', user_router_1.default);
        this.app.use('/api/v1/fixtures', fixture_router_1.default);
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
                //await checkServerStatus();
                yield (0, fixture_controller_1.checkQuantityData)();
            }
            catch (error) {
                console.error("Unable to connect to database: " + error.message);
            }
        });
    }
}
exports.default = Server;
