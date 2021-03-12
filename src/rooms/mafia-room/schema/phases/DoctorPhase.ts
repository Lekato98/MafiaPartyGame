import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaActionsName} from "../actions/AbstractActions";

class DoctorPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDoctorPhase();
    }

    refreshDoctorPhase(): void {
        this.phaseName = MafiaPhaseName.DOCTOR_PHASE;
        this.phaseTime = MafiaPhaseTime.DOCTOR_PHASE_TIME;
        this.actionsName = MafiaActionsName.DOCTOR_ACTIONS;
        this.refreshPhase();
    }
}


export default DoctorPhase;