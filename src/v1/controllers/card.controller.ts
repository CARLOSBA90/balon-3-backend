import {Request, Response} from 'express';
import { isNumeric, parseToInt } from '../core/utils/validators';
import { HomeInterface } from '../core/interfaces/home.interface';
import { parseToDate, today } from '../core/utils/dates';
import { CardService } from '../services/cards.service';

export const getHomeData = async (req:Request, res: Response ) => {
   
   //today(true),
      try {
         let data:HomeInterface= {
            date: parseToDate('20240601'),
            limit: Number(process.env.PAGE_SIZE) || 1,
            total: 0,
            pages: 0,
            actualPage: 1,
            offset:0,
            cards: []
         };

         if (isNumeric(req.params.number))
               data.actualPage = parseToInt(req.params.number);

         data.offset = (data.actualPage - 1) * data.limit;

         const { cards, total } = await CardService.getHomeContent(data.date, data.limit, data.offset);

         data.total = total;
         data.cards = cards;
         data.pages = Math.ceil(total / data.limit);

            res.json(data);
            } catch (error) {
            console.error('Error fetching cards:', error);
            res.status(500).json({ error: 'No es posible consultar los datos' });
      }
}

export const getCardData = async (req:Request, res: Response ) => {
   
      try {
         
         let id=0;

         if (isNumeric(req.params.number))
              id = parseToInt(req.params.number);

         if(!id)
            throw new Error("Sin ID para consultar");

         const { card, gallery }  = await CardService.getCardContent(id);
         
         res.json({card:card, gallery:gallery });
         } catch (error) {
         console.error('Error fetching cards:', error);
         res.status(500).json({ error: 'No es posible consultar los datos' });
      }
}