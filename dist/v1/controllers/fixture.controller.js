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
exports.checkQuantityData = exports.getFixtures = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const fixture_model_1 = require("../models/fixture.model");
const team_model_1 = require("../models/team.model");
const venue_model_1 = require("../models/venue.model");
const getFixtures = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.checkQuantityData)();
    try {
        const listFixtures = yield fixture_model_1.Fixture.findAll({
            include: [
                {
                    model: team_model_1.Team,
                    as: 'HomeTeam',
                    attributes: ['id', 'name']
                },
                {
                    model: team_model_1.Team,
                    as: 'AwayTeam',
                    attributes: ['id', 'name']
                },
                {
                    model: venue_model_1.Venue,
                    attributes: ['id', 'name']
                }
            ]
        });
        res.json(listFixtures);
    }
    catch (error) {
        console.error('Error fetching fixtures:', error);
        res.status(500).json({ error: 'An error occurred while fetching fixtures' });
    }
});
exports.getFixtures = getFixtures;
const checkQuantityData = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield fixture_model_1.Fixture.count();
    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
});
exports.checkQuantityData = checkQuantityData;
const fillFromJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.resolve(__dirname, '../mocks/fixture.json');
    try {
        const jsonData = yield fs.promises.readFile(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        if (data && data[0].response) {
            const response = data[0].response;
            const fixtures = yield extractFixtures(response);
            insertFixtures(fixtures);
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
        var _a, _b, _c, _d, _e;
        const homeIdTeam = (_a = teamMap.get(data.teams.home.id)) !== null && _a !== void 0 ? _a : 0;
        const awayIdTeam = (_b = teamMap.get(data.teams.away.id)) !== null && _b !== void 0 ? _b : 0;
        const venueId = (_c = venueMap.get(data.fixture.venue.id)) !== null && _c !== void 0 ? _c : 0;
        return {
            external_id: (_d = data.fixture.id) !== null && _d !== void 0 ? _d : 0,
            // Convierte la fecha a UTC antes de guardarla(Solo para este caso en especifico)
            // El JSON viene en formato (UTC-3), casting a UTC 
            date: (_e = (0, moment_timezone_1.default)(data.fixture.date).utc().format('YYYY-MM-DD HH:mm:ss')) !== null && _e !== void 0 ? _e : '',
            homeIdTeam,
            awayIdTeam,
            venueId
        };
    });
    return fixtures;
});
const insertFixtures = (fixtures) => __awaiter(void 0, void 0, void 0, function* () {
    yield fixture_model_1.Fixture.bulkCreate(fixtures);
});
