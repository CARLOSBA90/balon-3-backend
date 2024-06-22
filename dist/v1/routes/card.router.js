"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_controller_1 = require("../controllers/card.controller");
const router = (0, express_1.Router)();
router.get('/', card_controller_1.getCards);
router.get('/page/:number', card_controller_1.getCards);
exports.default = router;
