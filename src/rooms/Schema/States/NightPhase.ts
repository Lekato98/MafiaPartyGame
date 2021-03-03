import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import MafiaPhase from "./MafiaPhase";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class NightPhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshNightState();
    }

    goToNextState() {
        const mafiaState = new MafiaPhase(this.context);
        this.context.setCurrentState(mafiaState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.MAFIA_STATE;
    }

    refreshNightState() {
        this.stateName = StatesEnum.NIGHT_STATE;
        this.phaseTime = StatesPhaseTime.NIGHT_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        this.turn.push(MafiaRolesEnum.MODERATOR);
    }
}

export default NightPhase;