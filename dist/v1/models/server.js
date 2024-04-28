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
const card_model_1 = require("./card.model");
const user_model_1 = require("./user.model");
const timezone_model_1 = require("./timezone.model");
const timezone_controller_1 = require("../controllers/timezone.controller");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.middlewares();
        this.routes();
        this.dbConnect();
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
    }
    middlewares() {
        // Parese body
        this.app.use(express_1.default.json());
        // CORS
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield card_model_1.Card.sync();
                yield user_model_1.User.sync();
                yield timezone_model_1.Timezone.sync();
            }
            catch (error) {
                console.error("Unable to connect to database: " + error.message);
            }
        });
    }
    startServer() {
        (0, timezone_controller_1.getTimeZones)();
    }
}
exports.default = Server;
