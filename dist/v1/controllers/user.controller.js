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
exports.login = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_model_1.User.findOne({ where: { username: username } });
    if (user) {
        const errorMsg = 'Ya existe el usuario ' + username;
        return res.status(400).json({
            msg: errorMsg
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield user_model_1.User.create({
            username: username,
            password: hashedPassword
        });
        const message = 'Usuario ' + username + ' creado exitosamente!';
        res.json({
            msg: message
        });
    }
    catch (error) {
        const errorMsg = 'Error al crear nuevo usuario: ' + error.message;
        res.status(400).json({
            msg: errorMsg
        });
    }
});
exports.newUser = newUser;
const login = (req, res) => {
    const body = req.body;
    res.json({
        msg: 'Login User',
        body
    });
};
exports.login = login;
