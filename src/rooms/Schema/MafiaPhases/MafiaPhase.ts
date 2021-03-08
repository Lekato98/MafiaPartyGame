import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";

class MafiaPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshMafiaPhase();
    }

    refreshMafiaPhase(): void {
        this.phaseName = MafiaPhaseName.MAFIA_PHASE;
        this.phaseTime = MafiaPhaseTime.MAFIA_PHASE_TIME;
        this.setActiveActions();
        this.setActiveRoles();
    }
}

export default MafiaPhase;