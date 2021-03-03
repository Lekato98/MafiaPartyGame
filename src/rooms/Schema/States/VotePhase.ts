import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import NightPhase from "./NightPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class VotePhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshVoteState();
    }

    goToNextState() {
        const nightState = new NightPhase(this.context);
        this.context.setCurrentState(nightState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.NIGHT_STATE;
    }

    refreshVoteState(): void {
        this.stateName = StatesEnum.VOTE_STATE;
        this.phaseTime = StatesPhaseTime.VOTE_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getUniqueGameRolesCollection();
        collection.map(item => this.turn.push(item));
    }
}


export default VotePhase;