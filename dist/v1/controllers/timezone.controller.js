"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getTimeZones = void 0;
const timezone_model_1 = require("../models/timezone.model");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const getTimeZones = () => __awaiter(void 0, void 0, void 0, function* () {
    checkQuantityData();
    const listTimeZones = yield timezone_model_1.Timezone.findAll();
});
exports.getTimeZones = getTimeZones;
const checkQuantityData = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield timezone_model_1.Timezone.count();
    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
});
const fillFromJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.resolve(__dirname, '../mocks/timezone.json'); // Ruta completa al archivo timezone.json
    try {
        const jsonData = yield fs.promises.readFile(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        console.log(data);
        data.forEach((timezone) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(timezone);
            try {
                yield timezone_model_1.Timezone.create({
                    description: timezone
                });
                console.log(`Registro ${timezone} insertado en base de datos!`);
            }
            catch (error) {
                console.log("Error al insertar Timezone", error.messsage);
            }
        }));
    }
    catch (error) {
        console.error('Error al leer el archivo:', error);
    }
});
const fillFromAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Cargar desde API");
});
