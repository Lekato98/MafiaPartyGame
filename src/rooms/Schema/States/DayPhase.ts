import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import DiscussPhase from "./DiscussPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class DayPhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDayState();
    }

    goToNextState() {
        const discussState = new DiscussPhase(this.context);
        this.context.setCurrentState(discussState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.DISCUSS_STATE;
    }

    refreshDayState(): void {
        this.stateName = StatesEnum.DAY_STATE;
        this.phaseTime = StatesPhaseTime.DAY_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        this.turn.push(MafiaRolesEnum.MODERATOR);
    }
}

export default DayPhase;