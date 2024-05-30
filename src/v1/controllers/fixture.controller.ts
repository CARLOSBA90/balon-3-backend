import {Request, Response} from 'express';
import * as fs from 'fs';
import path from 'path'; 
import { Fixture } from '../models/fixture.model';
import { FixtureInterface } from '../core/interfaces/fixture.interface';
import { Team } from '../models/team.model';
import { Venue } from '../models/venue.model';

export const getFixtures = async (req: Request, res: Response): Promise<void> => {
    try {
        const listFixtures = await Fixture.findAll({
            include: [
                {
                    model: Team,
                    as: 'HomeTeam',
                    attributes: ['id', 'name']
                },
                {
                    model: Team,
                    as: 'AwayTeam',
                    attributes: ['id', 'name']
                },
                {
                    model: Venue,
                    attributes: ['id', 'name']
                }
            ]
        });

        res.json(listFixtures);
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        res.status(500).json({ error: 'An error occurred while fetching fixtures' });
    }
};


const checkQuantityData = async () => {
    const count = await Fixture.count();

    if (count === 0 && process.env.MODE === 'DEMO')
        fillFromJson();
    
    if (count === 0 && process.env.MODE === 'PRODUCTION')
        fillFromAPI();
}


const fillFromJson= async () => {
    const filePath = path.resolve(__dirname, '../mocks/fixture.json'); 

    try {
        const jsonData = await fs.promises.readFile(filePath, 'utf8');
        const data: any = JSON.parse(jsonData); 

        if(data && data[0].response){

            const response=data[0].response;

            const fixtures: FixtureInterface[] = await extractFixtures(response);

            insertFixtures(fixtures);
            
            }
        }catch(error:any){
            console.error("Error en procesamiento de datos: ",error.message);
    }
       
   
}

const fillFromAPI= async () => {
    console.log("Cargar desde API"); 
}


const extractFixtures = async (response:any): Promise<FixtureInterface[]> => {

    // Debe ser de una liga especifica para un procesamiento optimo 
    const teams = await Team.findAll();
    const venues = await Venue.findAll();

    // Mapeo interno
        const teamMap = new Map<number, number>();
        teams.forEach((team: any) => {
            teamMap.set(team.external_id, team.id);
        });
    
        const venueMap = new Map<number, number>();
        venues.forEach((venue: any) => {
            venueMap.set(venue.external_id, venue.id);
        });


    const fixtures: FixtureInterface[] = response.map((data: any) => {
        const homeIdTeam = teamMap.get(data.teams.home.id) ?? 0;
        const awayIdTeam = teamMap.get(data.teams.away.id) ?? 0;
        const venueId = venueMap.get(data.fixture.venue.id) ?? 0;

        return {
            external_id: data.fixture.id ?? 0,
            date: data.fixture.date ?? '',
            homeIdTeam,
            awayIdTeam,
            venueId
        };
    });

    return fixtures;
}

const insertFixtures = async (fixtures: FixtureInterface[]): Promise<void> => {
    await Fixture.bulkCreate(fixtures as any); 
};