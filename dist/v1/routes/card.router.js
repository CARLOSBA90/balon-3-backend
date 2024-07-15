"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_controller_1 = require("../controllers/card.controller");
const validate_token_1 = __importDefault(require("../middleware/validate.token"));
const router = (0, express_1.Router)();
router.get('/', card_controller_1.getCards);
router.get('/test', validate_token_1.default, card_controller_1.getCards);
exports.default = router;
