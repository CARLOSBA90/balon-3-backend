"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = void 0;
/**
 *
 * @param value Check is value is Numeric
 * @returns
 */
const isNumeric = (value) => {
    return !isNaN(Number(value));
};
exports.isNumeric = isNumeric;
