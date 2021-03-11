import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";

class NightPhase extends AbstractPhase {

    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshNightPhase();
    }

    refreshNightPhase() {
        this.phaseName = MafiaPhaseName.NIGHT_PHASE;
        this.phaseTime = MafiaPhaseTime.NIGHT_PHASE_TIME;
        this.refreshPhase();
    }
}

export default NightPhase;