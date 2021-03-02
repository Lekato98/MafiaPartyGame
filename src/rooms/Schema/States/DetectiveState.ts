import State, {StatesEnum, StatesPhaseTime} from "./State";
import DoctorState from "./DoctorState";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";

class DetectiveState extends State {
    constructor() {
        super();
        this.refreshDetectiveState();
    }

    action(): State {
        return new DoctorState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.DOCTOR_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshDetectiveState(): void {
        this.stateName = StatesEnum.DETECTIVE_STATE;
        this.phaseTime = StatesPhaseTime.DETECTIVE_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfDetectiveRole(1);
        collection.map(item => this.turn.push(item));
    }
}

export default DetectiveState;