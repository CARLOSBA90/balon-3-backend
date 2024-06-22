import { Card } from "../models/card.model";
import { Fixture } from "../models/fixture.model";
import { Team } from "../models/team.model";
import { Timezone } from "../models/timezone.model";
import { Venue } from "../models/venue.model";
import { checkFixturesData } from "./fixtures.service";
import { checkTeamsData } from "./team.service";
import { checkTimezonesData } from "./timezone.service";


export const checkServerStatus = async () => {

    try {
        await Timezone.sync();
        await Team.sync();
        await Venue.sync();
        await Fixture.sync();
        await Card.sync();
 
        checkServerData();

    } catch (error:any) {
        console.error("Error checking server status: ",error.message);
    }
}
  
//Experimental
const checkServerData = async() =>{
    checkTimezonesData();
    checkTeamsData();
    checkFixturesData();
}