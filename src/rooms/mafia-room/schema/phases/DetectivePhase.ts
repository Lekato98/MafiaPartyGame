import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaActionsName} from "../actions/AbstractActions";

class DetectivePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDetectivePhase();
    }

    refreshDetectivePhase(): void {
        this.phaseName = MafiaPhaseName.DETECTIVE_PHASE;
        this.phaseTime = MafiaPhaseTime.DETECTIVE_PHASE_TIME;
        this.actionsName = MafiaActionsName.DETECTIVE_ACTIONS;
        this.refreshPhase();
    }
}

export default DetectivePhase;