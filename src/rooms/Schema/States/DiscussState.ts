import State, {StatesEnum, StatesPhaseTime} from "./State";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import VoteState from "./VoteState";

class DiscussState extends State {
    constructor() {
        super();
        this.refreshDiscussState();
    }

    action(): State {
        return new VoteState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.VOTE_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshDiscussState() {
        this.stateName = StatesEnum.DISCUSS_STATE;
        this.phaseTime = StatesPhaseTime.DISCUSS_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getUniqueGameRolesCollection();
        collection.map(item => this.turn.push(item));
    }
}


export default DiscussState;