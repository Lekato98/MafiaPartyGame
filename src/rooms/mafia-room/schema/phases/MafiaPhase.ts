import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaActionsName} from "../actions/AbstractActions";

class MafiaPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshMafiaPhase();
    }

    refreshMafiaPhase(): void {
        this.phaseName = MafiaPhaseName.MAFIA_PHASE;
        this.phaseTime = MafiaPhaseTime.MAFIA_PHASE_TIME;
        this.actionsName = MafiaActionsName.MAFIA_ACTIONS;
        this.refreshPhase();
    }
}

export default MafiaPhase;