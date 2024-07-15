"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fixture_controller_1 = require("../controllers/fixture.controller");
const router = (0, express_1.Router)();
router.get('/get', fixture_controller_1.getFixtures);
exports.default = router;
