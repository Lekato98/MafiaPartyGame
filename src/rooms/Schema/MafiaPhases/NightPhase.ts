import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";

class NightPhase extends AbstractPhase {

    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshNightPhase();
    }

    refreshNightPhase() {
        this.phaseName = MafiaPhaseName.NIGHT_PHASE;
        this.phaseTime = MafiaPhaseTime.NIGHT_PHASE_TIME;
        this.setActiveActions();
        this.setActiveRoles();
    }
}

export default NightPhase;