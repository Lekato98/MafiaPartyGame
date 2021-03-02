import State, {StatesEnum, StatesPhaseTime} from "./State";
import DetectiveState from "./DetectiveState";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";

class MafiaState extends State {
    constructor() {
        super();
        this.refreshMafiaState();
    }

    action(): State {
        return new DetectiveState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.DETECTIVE_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshMafiaState(): void {
        this.stateName = StatesEnum.MAFIA_STATE;
        this.phaseTime = StatesPhaseTime.MAFIA_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfMafiaRole(1);
        collection.map(item => this.turn.push(item));
    }
}

export default MafiaState;