"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToInt = exports.isNumeric = void 0;
/**
 *
 * @param value Check is value is Numeric
 * @returns
 */
const isNumeric = (value) => {
    return !isNaN(Number(value));
};
exports.isNumeric = isNumeric;
/**
 *  Checks if string is number and returned casted value
 * @param string
 * @returns integer parse number
 */
const parseToInt = (string) => {
    try {
        const intValue = parseInt(string);
        if (!isNaN(intValue)) {
            return intValue;
        }
    }
    catch (error) {
        console.error(error);
    }
    return 0;
};
exports.parseToInt = parseToInt;
