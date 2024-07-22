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
exports.checkFixturesData = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fixture_model_1 = require("../models/fixture.model");
const team_model_1 = require("../models/team.model");
const venue_model_1 = require("../models/venue.model");
const card_model_1 = require("../models/card.model");
const checkFixturesData = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield fixture_model_1.Fixture.count();
    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
});
exports.checkFixturesData = checkFixturesData;
const fillFromJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.resolve(__dirname, '../mocks/fixture.json');
    try {
        const jsonData = yield fs.promises.readFile(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        if (data && data[0].response) {
            const response = data[0].response;
            const fixtures = yield extractFixtures(response);
            insertCards(fixtures);
        }
    }
    catch (error) {
        console.error("Error en procesamiento de datos: ", error.message);
    }
});
const fillFromAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Cargar desde API");
});
const extractFixtures = (response) => __awaiter(void 0, void 0, void 0, function* () {
    // Debe ser de una liga especifica para un procesamiento optimo 
    const teams = yield team_model_1.Team.findAll();
    const venues = yield venue_model_1.Venue.findAll();
    // Mapeo interno
    const teamMap = new Map();
    teams.forEach((team) => {
        teamMap.set(team.external_id, team.id);
    });
    const venueMap = new Map();
    venues.forEach((venue) => {
        venueMap.set(venue.external_id, venue.id);
    });
    const fixtures = response.map((data) => {
        var _a, _b, _c, _d, _e, _f;
        const homeIdTeam = (_a = teamMap.get(data.teams.home.id)) !== null && _a !== void 0 ? _a : 0;
        const awayIdTeam = (_b = teamMap.get(data.teams.away.id)) !== null && _b !== void 0 ? _b : 0;
        const venueId = (_c = venueMap.get(data.fixture.venue.id)) !== null && _c !== void 0 ? _c : 0;
        return {
            external_id: (_d = data.fixture.id) !== null && _d !== void 0 ? _d : 0,
            // date: moment(data.fixture.date).utc().format('YYYY-MM-DD HH:mm:ss') ?? '',
            date: (_e = (0, moment_timezone_1.default)(data.fixture.date).format('YYYY-MM-DD HH:mm:ss')) !== null && _e !== void 0 ? _e : '',
            date_formatted: (_f = (0, moment_timezone_1.default)(data.fixture.date).format('DD-MM-YYYY')) !== null && _f !== void 0 ? _f : '',
            homeIdTeam,
            awayIdTeam,
            venueId
        };
    });
    return fixtures;
});
const insertFixtures = (fixtures) => __awaiter(void 0, void 0, void 0, function* () {
    // T0D0 check if n Fixture already exists - handling exception
    try {
        yield fixture_model_1.Fixture.bulkCreate(fixtures);
    }
    catch (error) {
        console.error("Error while inserts fixtures", error.message);
    }
});
const insertCards = (fixtures) => __awaiter(void 0, void 0, void 0, function* () {
    for (const data of fixtures) {
        //    console.log(data);
        try {
            const { external_id, date, date_formatted, homeIdTeam, awayIdTeam, venueId } = data;
            let fixture = yield fixture_model_1.Fixture.create({
                external_id,
                date,
                date_formatted,
                homeIdTeam,
                awayIdTeam,
                venueId,
            });
            const homeTeam = yield team_model_1.Team.findByPk(homeIdTeam);
            const awayTeam = yield team_model_1.Team.findByPk(awayIdTeam);
            const venue = yield venue_model_1.Venue.findByPk(venueId);
            let fixtureId = fixture.get('id');
            if (homeTeam && awayTeam && venue && fixtureId) {
                const homeTeamName = homeTeam.get('name');
                const homeLogo = homeTeam.get('logo');
                const awayTeamName = awayTeam.get('name');
                const awayLogo = awayTeam.get('logo');
                const venueName = venue.get('name');
                const venueCity = venue.get('city');
                const venueImage = venue.get('image');
                const title = `${homeTeamName} VS ${awayTeamName}`;
                const content = ` 
                <div class="p-4 bg-white rounded shadow-md">
                  <p class="mt-1 text-gray-500 text-sm"><b>FECHA</b> ${(0, moment_timezone_1.default)(date).format('YYYY-MM-DD HH:mm')}</p>
                  <p class="text-indigo-500 text-sm inline-flex items-center mt-4 mb-4"> ${venueName}, ${venueCity}</p>
                  <div class="flex justify-between items-center mb-4">
                    <div class="w-1/2 text-center">
                      <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">EQUIPO LOCAL</h2>
                      <img src="${homeLogo}" alt="${homeTeamName} logo" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div> 
                    <div class="w-1/2 text-center">
                      <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">EQUIPO VISITANTE</h2>
                      <img src="${awayLogo}" alt="${awayTeamName} logo" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div>
                  </div>
                </div>
              `;
                const imageUrl = venueImage;
                yield card_model_1.Card.create({
                    title,
                    content,
                    imageUrl,
                    views: 0,
                    active: true,
                    category: null,
                    fixtureId: fixtureId
                });
            }
            else
                throw new Error("Unable to complete data");
        }
        catch (error) {
            //T0D0
            // SAVE LOG DATA IF FIXTURE CRASHED
            console.error("Unable to create card", error.message);
        }
    }
});
