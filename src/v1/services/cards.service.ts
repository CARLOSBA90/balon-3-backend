import { Op } from 'sequelize';
import { Card } from '../models/card.model';
import { Fixture } from '../models/fixture.model';
import moment from 'moment';
import { parseToDate } from '../core/utils/dates';

export class CardService {
 static async getHomeContent(date: Date, limit: number, offset: number) {
    try {
      // Obtener el total de registros que cumplen con la condición
      const total = await Card.count({
        include: [
          {
            model: Fixture,
            where: {
              date: {
                [Op.gte]: date // Usar la fecha proporcionada
              }
            }
          }
        ]
      });

      // Obtener los registros paginados
      const cards = await Card.findAll({
        attributes: ['id','title', 'imageUrl'], 
        include: [
          {
            model: Fixture,
            where: {
              date: {
                [Op.gte]: date // Usar la fecha proporcionada
              }
            },
            attributes: ['date_formatted'],  
          }
        ],
        limit: limit,
        offset: offset,
        order: [
          [Fixture, 'date', 'ASC'] // Ordenar por fecha ascendente
        ]
      });

     return { cards , total };
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw new Error('Error fetching cards');
    }
  }


  static async getCardContent(id: number) {
    try {
        const card = await Card.findByPk(id);
    
        if(!card)
          throw new Error('Card not found');

      const fixtureId = card.get('fixtureId') as number;
      const fixture = await Fixture.findByPk(fixtureId);

        if (!fixture) 
          throw new Error('Fixture not found');
    
      let homeIdTeam = fixture.get('homeIdTeam') as number;
      let awayIdTeam = fixture.get('awayIdTeam') as number;

      const teamIds = new Set<number>([homeIdTeam, awayIdTeam]);

      const gallery = await Card.findAll({
        attributes: ['id', 'title', 'imageUrl'],
        include: [
          {
            model: Fixture,
            where: {
              [Op.or]: [
                { homeIdTeam: { [Op.in]: Array.from(teamIds) } },
                { awayIdTeam: { [Op.in]: Array.from(teamIds) } }
              ],
              [Op.and]: [
                {
                  id: { [Op.not]: fixtureId }
                }
              ],
            },
            attributes: ['date_formatted'],
          }
        ],
        order: [
          [Fixture, 'date', 'ASC']
        ],
        limit: 5 
      });

      return { card, gallery };
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw new Error('Error fetching cards');
    }
  }
}

