import State, {StatesEnum, StatesPhaseTime} from "./State";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import NightState from "./NightState";
import {ArraySchema} from "@colyseus/schema";

class VoteState extends State {
    constructor() {
        super();
        this.refreshVoteState();
    }

    action(): State {
        return new NightState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.NIGHT_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshVoteState(): void {
        this.stateName = StatesEnum.VOTE_STATE;
        this.phaseTime = StatesPhaseTime.VOTE_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getUniqueGameRolesCollection();
        collection.map(item => this.turn.push(item));
    }
}


export default VoteState;