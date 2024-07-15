import {Request, Response} from 'express';
import { Card } from '../models/card.model';

export const getCards = async (req:Request, res: Response ) => {

  /// Si cant== 0 y env = demo
  // Usar json 
  /*if(){

  }*/
  const listCards = await Card.findAll();

    res.json(listCards);

}