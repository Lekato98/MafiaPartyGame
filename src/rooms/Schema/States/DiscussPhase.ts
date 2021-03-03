import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import VotePhase from "./VotePhase";
import MafiaGameState from "../MafiaGameState";

class DiscussPhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDiscussState();
    }

    goToNextState() {
        const voteState = new VotePhase(this.context);
        this.context.setCurrentState(voteState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.VOTE_STATE;
    }

    refreshDiscussState() {
        this.stateName = StatesEnum.DISCUSS_STATE;
        this.phaseTime = StatesPhaseTime.DISCUSS_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getUniqueGameRolesCollection();
        collection.map(item => this.turn.push(item));
    }
}


export default DiscussPhase;