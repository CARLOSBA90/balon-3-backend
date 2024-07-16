import { Op } from 'sequelize';
import { Card } from '../models/card.model';
import { Fixture } from '../models/fixture.model';
import moment from 'moment';

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
      const data = await Card.findAll({
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
            attributes: ['date'], 
          }
        ],
        limit: limit,
        offset: offset
      });

      const cards = data.map(card => {
        const fixture = card.get('fixture') as any;
        const fixtureDate = fixture ? fixture.date : null;
        console.log(fixtureDate);

        const formattedDate = fixtureDate ? moment(fixtureDate).format('DD-MM-YYYY') : null;
        console.log(formattedDate);
        return {
          ...card.get({ plain: true }), // Obtener los datos planos del card
          fixtureDate: formattedDate // Agregar la fecha formateada
        };
      });

      

      return { cards, total };
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw new Error('Error fetching cards');
    }
  }
}
