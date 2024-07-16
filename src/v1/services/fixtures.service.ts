import * as fs from 'fs';
import path from 'path'; 
import moment from 'moment-timezone';
import { Fixture } from '../models/fixture.model';
import { FixtureInterface } from '../core/interfaces/fixture.interface';
import { Team } from '../models/team.model';
import { Venue } from '../models/venue.model';
import { Card } from '../models/card.model';


export const checkFixturesData = async () => {
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

           // insertFixtures(fixtures);
            insertCards(fixtures);
            
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
            // Convierte la fecha a UTC antes de guardarla(Solo para este caso en especifico)
            // El JSON viene en formato (UTC-3), casting a UTC // despues borrar esto
            date: moment(data.fixture.date).utc().format('YYYY-MM-DD HH:mm:ss') ?? '',
            homeIdTeam,
            awayIdTeam,
            venueId
        };
    });

    return fixtures;
}

const insertFixtures = async (fixtures: FixtureInterface[]): Promise<void> => {
    // T0D0 check if n Fixture already exists - handling exception
    try {
        await Fixture.bulkCreate(fixtures as any); 
    } catch (error:any) {
        console.error("Error while inserts fixtures",error.message);
    }
 
};

const insertCards = async (fixtures: FixtureInterface[]): Promise<void> => {

    for (const data of fixtures) {
        try {
        const { external_id, date, homeIdTeam, awayIdTeam, venueId } = data;
        let fixture = await Fixture.findOne({ where: { external_id } });
    
        if (!fixture) {
          fixture = await Fixture.create({
            external_id,
            date,
            homeIdTeam,
            awayIdTeam,
            venueId,
          });
        }
    
        const homeTeam = await Team.findByPk(homeIdTeam);
        const awayTeam = await Team.findByPk(awayIdTeam);
        const venue = await Venue.findByPk(venueId);
        let fixtureId = fixture.get('id') as number;

        if(homeTeam && awayTeam && venue && fixtureId){

                const homeTeamName = homeTeam.get('name') as String;
                const homeLogo = homeTeam.get('logo') as String;

                const awayTeamName = awayTeam.get('name') as String;
                const awayLogo = awayTeam.get('logo') as String;

                const venueName = venue.get('name') as String;
                const venueCity =  venue.get('city') as String;
                const venueImage = venue.get('image') as String;
 
                const title = `${homeTeamName} VS ${awayTeamName}`;
                const content = ` 
                <div class="p-4 bg-white rounded shadow-md">
                  <p class="text-lg font-semibold mb-2"><strong>Fecha:</strong> ${moment(date).format('YYYY-MM-DD HH:mm:ss')}</p>
                  <p class="text-lg font-semibold mb-2"><strong>Equipos:</strong> <span class="text-blue-500">${homeTeamName}</span> VS <span class="text-red-500">${awayTeamName}</span></p>
                  <p class="text-lg font-semibold mb-2"><strong>Estadio:</strong> ${venueName}, ${venueCity}</p>
                  <div class="flex justify-between items-center mb-4">
                    <div class="w-1/3 text-center">
                      <p class="text-lg font-semibold mb-2">Locales</p>
                      <img src="${homeLogo}" alt="${homeTeamName} logo" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div> 
                    <div class="w-1/3 text-center">
                      <p class="text-lg font-semibold mb-2">Visitantes</p>
                      <img src="${awayLogo}" alt="${awayTeamName} logo" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div>
                    <div class="w-1/3 text-center">
                      <p class="text-lg font-semibold mb-2">Estadio</p>
                      <img src="${venueImage}" alt="${venueName}" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div>
                  </div>
                </div>
              `;
                
                //const imageUrls = [venueImage, homeLogo, awayLogo];
                //const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
 
                const imageUrl = venueImage;

                await Card.create({
                title,
                content,
                imageUrl,
                views: 0,
                active: true,
                category: null,
                fixtureId: fixtureId
                });
            }else{
                ///T0D0 
                // SAVE LOG, WHEN CARD WAS NOT CREATED
                console.error("Unable to complete data");
            }

            
        } catch (error:any) {
            //T0D0
            // SAVE LOG DATA IF FIXTURE CRASHED
            console.error("Unable to create card",error.message);
        }
        
      }
    };
