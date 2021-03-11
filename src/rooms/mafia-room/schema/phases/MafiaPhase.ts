import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/IActions";

class MafiaPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshMafiaPhase();
    }

    refreshMafiaPhase(): void {
        this.phaseName = MafiaPhaseName.MAFIA_PHASE;
        this.phaseTime = MafiaPhaseTime.MAFIA_PHASE_TIME;
        this.actions = ActionsFactory.createActions(MafiaActionsName.MAFIA_ACTIONS, this.context.players);
        this.refreshPhase();
    }
}

export default MafiaPhase;