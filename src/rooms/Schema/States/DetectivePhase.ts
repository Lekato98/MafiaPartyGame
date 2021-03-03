import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import DoctorPhase from "./DoctorPhase";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class DetectivePhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDetectiveState();
    }

    goToNextState() {
        const doctorState = new DoctorPhase(this.context);
        this.context.setCurrentState(doctorState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.DOCTOR_STATE;
    }

    refreshDetectiveState(): void {
        this.stateName = StatesEnum.DETECTIVE_STATE;
        this.phaseTime = StatesPhaseTime.DETECTIVE_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfDetectiveRole(1);
        collection.map(item => this.turn.push(item));
    }
}

export default DetectivePhase;