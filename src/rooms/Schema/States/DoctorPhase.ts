import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import DayPhase from "./DayPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class DoctorPhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDoctorState();
    }

    goToNextState() {
        const dayState = new DayPhase(this.context);
        this.context.setCurrentState(dayState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.DAY_STATE;
    }

    refreshDoctorState(): void {
        this.stateName = StatesEnum.DOCTOR_STATE;
        this.phaseTime = StatesPhaseTime.DOCTOR_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfDoctorRole(1);
        collection.map(item => this.turn.push(item));
    }
}


export default DoctorPhase;