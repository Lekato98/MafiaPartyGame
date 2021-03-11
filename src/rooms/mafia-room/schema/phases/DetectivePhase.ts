import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/IActions";

class DetectivePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDetectivePhase();
    }

    refreshDetectivePhase(): void {
        this.phaseName = MafiaPhaseName.DETECTIVE_PHASE;
        this.phaseTime = MafiaPhaseTime.DETECTIVE_PHASE_TIME;
        this.actions = ActionsFactory.createActions(MafiaActionsName.DETECTIVE_ACTIONS, this.context.players);
        this.refreshPhase();
    }
}

export default DetectivePhase;