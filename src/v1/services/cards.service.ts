import { Op } from 'sequelize';
import { Card } from '../models/card.model';
import { Fixture } from '../models/fixture.model';

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
            order: [
              ['date', 'ASC']
            ],
            attributes: []
          }
        ],
        limit: limit,
        offset: offset
      });

      return { cards, total };
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw new Error('Error fetching cards');
    }
  }
}
