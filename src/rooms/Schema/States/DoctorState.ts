import State, {StatesEnum, StatesPhaseTime} from "./State";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import DayState from "./DayState";
import {ArraySchema} from "@colyseus/schema";

class DoctorState extends State {
    constructor() {
        super();
        this.refreshDoctorState();
    }

    action(): State {
        return new DayState();
    }

    getNextState(): StatesEnum {
        return StatesEnum.DAY_STATE;
    }

    getState(): StatesEnum {
        return this.stateName;
    }

    refreshDoctorState(): void {
        this.stateName = StatesEnum.DOCTOR_STATE;
        this.phaseTime = StatesPhaseTime.DOCTOR_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfDoctorRole(1);
        collection.map(item => this.turn.push(item));
    }
}


export default DoctorState;