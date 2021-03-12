import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/AbstractActions";

class DayPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDayPhase();
    }

    refreshDayPhase(): void {
        this.phaseName = MafiaPhaseName.DAY_PHASE;
        this.phaseTime = MafiaPhaseTime.DAY_PHASE_TIME;
        this.actionsName = MafiaActionsName.MODERATOR_ACTIONS;
        this.refreshPhase();
    }
}

export default DayPhase;