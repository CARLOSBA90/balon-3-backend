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
          // date: moment(data.fixture.date).utc().format('YYYY-MM-DD HH:mm:ss') ?? '',
            date: moment(data.fixture.date).format('YYYY-MM-DD HH:mm:ss') ?? '',
            date_formatted:  moment(data.fixture.date).format('DD-MM-YYYY')  ?? '',
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

    //    console.log(data);
 
        try {
        const { external_id, date, date_formatted, homeIdTeam, awayIdTeam, venueId } = data;
       
        let  fixture = await Fixture.create({
            external_id,
            date,
            date_formatted,
            homeIdTeam,
            awayIdTeam,
            venueId,
          });
    
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
                  <p class="mt-1 text-gray-500 text-sm"><b>FECHA</b> ${moment(date).format('YYYY-MM-DD HH:mm')}</p>
                  <p class="text-indigo-500 text-sm inline-flex items-center mt-4 mb-4"> ${venueName}, ${venueCity}</p>
                  <div class="flex justify-between items-center mb-4">
                    <div class="w-1/2 text-center">
                      <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">EQUIPO LOCAL</h2>
                      <img src="${homeLogo}" alt="${homeTeamName} logo" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div> 
                    <div class="w-1/2 text-center">
                      <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">EQUIPO VISITANTE</h2>
                      <img src="${awayLogo}" alt="${awayTeamName} logo" class="w-24 h-24 mx-auto rounded-full shadow-md">
                    </div>
                  </div>
                </div>
              `; 
                
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
            }else
                throw new Error("Unable to complete data");

            
        } catch (error:any) {
            //T0D0
            // SAVE LOG DATA IF FIXTURE CRASHED
            console.error("Unable to create card",error.message);
        }
    
      } 
    };
