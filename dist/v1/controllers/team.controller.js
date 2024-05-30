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
exports.getTeams = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const team_model_1 = require("../models/team.model");
const venue_model_1 = require("../models/venue.model");
const getTeams = () => __awaiter(void 0, void 0, void 0, function* () {
    checkQuantityData();
    //const listTeams = await Team.findAll({ include: Venue }); 
    const teams = yield team_model_1.Team.findAll({
        include: [
            {
                model: venue_model_1.Venue,
                required: true // Esto asegura que solo se devuelvan equipos que tengan una sede asociada
            }
        ]
    });
});
exports.getTeams = getTeams;
const checkQuantityData = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield team_model_1.Team.count();
    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
});
const fillFromJson = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.resolve(__dirname, '../mocks/teams.json');
    try {
        const jsonData = yield fs.promises.readFile(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        if (data && data[0].response) {
            const teams = data[0].response;
            teams.forEach((data) => __awaiter(void 0, void 0, void 0, function* () {
                const team = data.team;
                insertTeam(team)
                    .then(teamId => {
                    const venue = data.venue;
                    if (teamId && venue) {
                        venue.teamId = teamId;
                        return insertVenue(venue);
                    }
                })
                    .catch(error => {
                    console.error("Error al insertar equipo o sede:", error.message);
                });
            }));
        }
    }
    catch (error) {
        console.error("Error en procesamiento de datos: ", error.message);
    }
});
const fillFromAPI = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Cargar desde API");
});
const insertTeam = (team) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        var _a;
        const dateFounded = new Date((_a = team.founded) !== null && _a !== void 0 ? _a : 1900, 0, 1);
        team_model_1.Team.create({
            external_id: team.id,
            name: team.name,
            code: team.code,
            country: team.country,
            founded: dateFounded,
            national: team.national,
            logo: team.logo
        }).then(newTeamRegister => {
            const teamId = newTeamRegister.id;
            resolve(teamId);
        }).catch(error => {
            reject(error);
        });
    });
});
const insertVenue = (venue) => __awaiter(void 0, void 0, void 0, function* () {
    return yield venue_model_1.Venue.create({
        external_id: venue.id,
        name: venue.name,
        address: venue.address,
        city: venue.city,
        capacity: venue.capacity,
        surface: venue.surface,
        image: venue.image,
        teamId: venue.teamId
    });
});
