import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/IActions";

class DiscussPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDiscussPhase();
    }

    refreshDiscussPhase() {
        this.phaseName = MafiaPhaseName.DISCUSS_PHASE;
        this.phaseTime = MafiaPhaseTime.DISCUSS_PHASE_TIME;
        this.actions = ActionsFactory.createActions(MafiaActionsName.DISCUSS_ACTIONS, this.context.players);
        this.refreshPhase();
    }
}


export default DiscussPhase;