import {Request, Response} from 'express';
import * as fs from 'fs';
import path from 'path'; 
import { Team } from '../models/team.model';
import { TeamInterface } from '../core/interfaces/team.interface';
import { VenueInterface } from '../core/interfaces/venue.interface';
import { Venue } from '../models/venue.model';

export const getTeams = async () => {

  checkQuantityData();
  //const listTeams = await Team.findAll({ include: Venue }); 

  const teams = await Team.findAll({
    include: [
        {
            model: Venue,
            required: true // Esto asegura que solo se devuelvan equipos que tengan una sede asociada
        }
    ]
  });
  
  console.log(teams); 
}


const checkQuantityData = async () => {
    const count = await Team.count();

    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
}


const fillFromJson= async () => {
    const filePath = path.resolve(__dirname, '../mocks/teams.json'); // Ruta completa al archivo timezone.json
    try {
      const jsonData = await fs.promises.readFile(filePath, 'utf8');
      const data: any = JSON.parse(jsonData); 

      if(data && data[0].response){
        const teams=data[0].response;
        teams.forEach(async (data:any) => { 
            const team:TeamInterface = data.team;

            insertTeam(team)
                .then(teamId => {

                    const venue:VenueInterface = data.venue;

                    if(teamId && venue){
                         venue.teamId = teamId;
                        return  insertVenue(venue);
                    }
                })
                .then(() => {})
                .catch(error => {
                    console.error("Error al insertar equipo o sede:", error.message);
                });

        } );
      }
    }catch(error:any){
      console.error("Error en procesamiento de datos: ",error.message);
    }
}

const fillFromAPI= async () => {
    console.log("Cargar desde API"); 
}

const insertTeam = async (team:TeamInterface) => {
      return new Promise<number>((resolve, reject) => {
        const dateFounded: Date = new Date(team.founded ?? 1900, 0, 1);

        Team.create({
            external_id: team.id,
            name: team.name,
            code: team.code,
            country: team.country,
            founded: dateFounded,
            national: team.national,
            logo: team.logo
        }).then(newTeamRegister => {
            const teamId = (newTeamRegister as any).id;
            resolve(teamId);
        }).catch(error => {
            reject(error);
        });

    });

}

const insertVenue = async (venue:VenueInterface) => {
 return  await Venue.create({
    external_id: venue.id,
    name: venue.name,
    address: venue.address,
    city: venue.city,
    capacity: venue.capacity,
    surface: venue.surface,
    image: venue.image,
    teamId: venue.teamId
    });
}