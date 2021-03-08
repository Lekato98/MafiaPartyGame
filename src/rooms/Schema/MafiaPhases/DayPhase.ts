import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";

class DayPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDayPhase();
    }

    refreshDayPhase(): void {
        this.phaseName = MafiaPhaseName.DAY_PHASE;
        this.phaseTime = MafiaPhaseTime.DAY_PHASE_TIME;
        this.setActiveActions();
        this.setActiveRoles();
    }
}

export default DayPhase;