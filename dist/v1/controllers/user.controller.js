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
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
/**
 *
 * @param req
 * @param res
 * @returns
 */
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    validateInputParameters(req, res);
    const { username, password } = req.body;
    const userExist = yield checkIfUserExist(username);
    if (userExist)
        return errorMsg(res, 'Ya existe el usuario ' + username);
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
        errorMsg(res, 'Error al crear nuevo usuario: ' + error.message);
    }
});
exports.newUser = newUser;
/**
 *
 * @param req
 * @param res
 * @returns
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    validateInputParameters(req, res);
    const { username, password } = req.body;
    const userExist = yield checkIfUserExist(username);
    // Validate if exist user exists
    if (!userExist)
        return errorMsg(res, 'No existe el usuario ' + username);
    // validate if password is equal
    const passwordValid = yield checkPasswordValid(req, res);
    if (!passwordValid)
        return errorMsg(res, 'Password incorrecto!');
    // Generate Token
    const token = jsonwebtoken_1.default.sign({ username: username }, process.env.SECRET_KEY || '.SECRET.KEY.313.');
    res.json({
        token
    });
});
exports.login = login;
/**
 * Validate Inputs before flows sequences
 * @param req
 * @param res
 */
const validateInputParameters = (req, res) => {
    const { username, password } = req.body;
    if (!username)
        errorMsg(res, 'Debe ingresar username.');
    if (!password)
        errorMsg(res, 'Debe ingresar password.');
};
/**
 * Check if exists user in Table USER
 * @param username
 * @returns
 */
const checkIfUserExist = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.count({ where: { username: username } });
        return user ? true : false;
    }
    catch (error) {
        return false; // T0D0 handle
    }
});
/**
 * Function to give back response with STATUS 404 with error message
 * @param res
 * @param errorMsg
 * @returns
 */
const errorMsg = (res, errorMsg) => {
    return res.status(400).json({
        msg: errorMsg
    });
};
const checkPasswordValid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_model_1.User.findOne({ where: { username: username } });
        if (user) {
            const passwordValidate = yield bcrypt_1.default.compare(password, user.password);
            return passwordValidate;
        }
        else {
            errorMsg(res, 'Error al validar usuario');
        }
    }
    catch (error) {
        errorMsg(res, 'Error al validar usuario : <br>' + error.message);
    }
});
