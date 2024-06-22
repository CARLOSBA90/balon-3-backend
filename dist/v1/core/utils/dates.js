"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToDate = exports.today = void 0;
const moment_1 = __importDefault(require("moment"));
const today = (zeroTime) => {
    const today = new Date();
    if (zeroTime)
        today.setHours(-3, 0, 0, 0);
    return today;
};
exports.today = today;
const parseToDate = (value) => {
    if (!/^\d{8}$/.test(value)) {
        throw new Error('Formato de fecha no válido. Debe ser yyyyMMdd');
    }
    const date = (0, moment_1.default)(value, 'YYYYMMDD').toDate();
    return date;
};
exports.parseToDate = parseToDate;
