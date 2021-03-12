import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/AbstractActions";

class DiscussPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDiscussPhase();
    }

    refreshDiscussPhase() {
        this.phaseName = MafiaPhaseName.DISCUSS_PHASE;
        this.phaseTime = MafiaPhaseTime.DISCUSS_PHASE_TIME;
        this.actionsName = MafiaActionsName.DISCUSS_ACTIONS;
        this.refreshPhase();
    }
}


export default DiscussPhase;