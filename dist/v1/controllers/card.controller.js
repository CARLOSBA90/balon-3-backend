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
exports.getCards = void 0;
const validators_1 = require("../core/utils/validators");
const dates_1 = require("../core/utils/dates");
const cards_service_1 = require("../services/cards.service");
const getCards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //today(true),
    try {
        let data = {
            date: (0, dates_1.parseToDate)('20240610'),
            limit: Number(process.env.PAGE_SIZE) || 1,
            total: 0,
            pages: 0,
            actualPage: 1,
            offset: 0,
            cards: []
        };
        if ((0, validators_1.isNumeric)(req.params.number))
            data.actualPage = (0, validators_1.parseToInt)(req.params.number);
        data.offset = (data.actualPage - 1) * data.limit;
        const { cards, total } = yield cards_service_1.CardService.getHomeContent(data.date, data.limit, data.offset);
        data.total = total;
        data.cards = cards;
        data.pages = Math.ceil(total / data.limit);
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching cards:', error);
        res.status(500).json({ error: 'No es posible consultar los datos' });
    }
});
exports.getCards = getCards;
