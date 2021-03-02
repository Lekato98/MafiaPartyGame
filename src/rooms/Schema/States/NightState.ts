import State, {StatesEnum, StatesPhaseTime} from "./State";
import MafiaState from "./MafiaState";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";

class NightState extends State {
    constructor() {
        super();
        this.refreshNightState();
    }

    action(): State {
        return new MafiaState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.MAFIA_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshNightState() {
        this.stateName = StatesEnum.NIGHT_STATE;
        this.phaseTime = StatesPhaseTime.NIGHT_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        this.turn.push(MafiaRolesEnum.MODERATOR);
    }
}

export default NightState;