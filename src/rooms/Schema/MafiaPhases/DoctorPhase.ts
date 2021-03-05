import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class DoctorPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDoctorState();
    }

    refreshDoctorState(): void {
        this.phaseName = MafiaPhasesNameEnum.DOCTOR_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.DOCTOR_PHASE_TIME;
        this.setActiveRoles();
    }
}


export default DoctorPhase;