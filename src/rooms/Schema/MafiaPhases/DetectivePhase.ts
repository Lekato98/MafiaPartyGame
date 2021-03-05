import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class DetectivePhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDetectiveState();
    }

    refreshDetectiveState(): void {
        this.phaseName = MafiaPhasesNameEnum.DETECTIVE_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.DETECTIVE_PHASE_TIME;
        this.setActiveRoles();
    }
}

export default DetectivePhase;