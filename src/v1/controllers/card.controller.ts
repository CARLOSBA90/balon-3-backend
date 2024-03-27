import {Request, Response} from 'express';
import { Card } from '../models/card.model';

export const getCards = async (req:Request, res: Response ) => {
  const listCards = await Card.findAll();

    res.json(listCards);

}