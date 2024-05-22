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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkServerStatus = void 0;
const card_model_1 = require("../models/card.model");
const fixture_model_1 = require("../models/fixture.model");
const team_model_1 = require("../models/team.model");
const timezone_model_1 = require("../models/timezone.model");
const user_model_1 = require("../models/user.model");
const venue_model_1 = require("../models/venue.model");
const checkServerStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield card_model_1.Card.sync();
        yield user_model_1.User.sync();
        yield timezone_model_1.Timezone.sync();
        yield team_model_1.Team.sync();
        yield venue_model_1.Venue.sync();
        yield fixture_model_1.Fixture.sync();
    }
    catch (error) {
    }
});
exports.checkServerStatus = checkServerStatus;
