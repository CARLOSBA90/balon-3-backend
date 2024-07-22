"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const card_controller_1 = require("../controllers/card.controller");
const router = (0, express_1.Router)();
router.get('/', card_controller_1.getHomeData);
router.get('/p/:number', card_controller_1.getHomeData);
router.get('/g/:number', card_controller_1.getCardData);
exports.default = router;
