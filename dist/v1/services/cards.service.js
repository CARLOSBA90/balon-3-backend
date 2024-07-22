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
exports.CardService = void 0;
const sequelize_1 = require("sequelize");
const card_model_1 = require("../models/card.model");
const fixture_model_1 = require("../models/fixture.model");
class CardService {
    static getHomeContent(date, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtener el total de registros que cumplen con la condición
                const total = yield card_model_1.Card.count({
                    include: [
                        {
                            model: fixture_model_1.Fixture,
                            where: {
                                date: {
                                    [sequelize_1.Op.gte]: date // Usar la fecha proporcionada
                                }
                            }
                        }
                    ]
                });
                // Obtener los registros paginados
                const cards = yield card_model_1.Card.findAll({
                    attributes: ['id', 'title', 'imageUrl'],
                    include: [
                        {
                            model: fixture_model_1.Fixture,
                            where: {
                                date: {
                                    [sequelize_1.Op.gte]: date // Usar la fecha proporcionada
                                }
                            },
                            attributes: ['date_formatted'],
                        }
                    ],
                    limit: limit,
                    offset: offset,
                    order: [
                        [fixture_model_1.Fixture, 'date', 'ASC'] // Ordenar por fecha ascendente
                    ]
                });
                return { cards, total };
            }
            catch (error) {
                console.error('Error fetching cards:', error);
                throw new Error('Error fetching cards');
            }
        });
    }
    static getCardContent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const card = yield card_model_1.Card.findByPk(id);
                if (!card)
                    throw new Error('Card not found');
                const fixtureId = card.get('fixtureId');
                const fixture = yield fixture_model_1.Fixture.findByPk(fixtureId);
                if (!fixture)
                    throw new Error('Fixture not found');
                let homeIdTeam = fixture.get('homeIdTeam');
                let awayIdTeam = fixture.get('awayIdTeam');
                const teamIds = new Set([homeIdTeam, awayIdTeam]);
                const gallery = yield card_model_1.Card.findAll({
                    attributes: ['id', 'title', 'imageUrl'],
                    include: [
                        {
                            model: fixture_model_1.Fixture,
                            where: {
                                [sequelize_1.Op.or]: [
                                    { homeIdTeam: { [sequelize_1.Op.in]: Array.from(teamIds) } },
                                    { awayIdTeam: { [sequelize_1.Op.in]: Array.from(teamIds) } }
                                ],
                                [sequelize_1.Op.and]: [
                                    {
                                        id: { [sequelize_1.Op.not]: fixtureId }
                                    }
                                ],
                            },
                            attributes: ['date_formatted'],
                        }
                    ],
                    order: [
                        [fixture_model_1.Fixture, 'date', 'ASC']
                    ],
                    limit: 5
                });
                return { card, gallery };
            }
            catch (error) {
                console.error('Error fetching cards:', error);
                throw new Error('Error fetching cards');
            }
        });
    }
}
exports.CardService = CardService;
