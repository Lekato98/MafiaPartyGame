import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";

class DetectivePhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDetectivePhase();
    }

    refreshDetectivePhase(): void {
        this.phaseName = MafiaPhaseName.DETECTIVE_PHASE;
        this.phaseTime = MafiaPhaseTime.DETECTIVE_PHASE_TIME;
        this.setActiveActions();
        this.setActiveRoles();
    }
}

export default DetectivePhase;