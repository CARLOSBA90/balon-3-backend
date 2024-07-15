import { Card } from "../models/card.model";
import { Fixture } from "../models/fixture.model";
import { Team } from "../models/team.model";
import { Timezone } from "../models/timezone.model";
import { User } from "../models/user.model";
import { Venue } from "../models/venue.model";


export const checkServerStatus = async () => {

    try {
        await Card.sync();
        await User.sync();
        await Timezone.sync();
        await Team.sync();
        await Venue.sync();
        await Fixture.sync();
    } catch (error) {
        
    }


}