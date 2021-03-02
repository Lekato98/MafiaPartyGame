import State, {StatesEnum, StatesPhaseTime} from "./State";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import DiscussState from "./DiscussState";
import {ArraySchema} from "@colyseus/schema";

class DayState extends State {
    constructor() {
        super();
        this.refreshDayState();
    }

    action(): State {
        return new DiscussState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.DISCUSS_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshDayState(): void {
        this.stateName = StatesEnum.DAY_STATE;
        this.phaseTime = StatesPhaseTime.DAY_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        this.turn.push(MafiaRolesEnum.MODERATOR);
    }
}

export default DayState;