import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";

class DiscussPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDiscussPhase();
    }

    refreshDiscussPhase() {
        this.phaseName = MafiaPhaseName.DISCUSS_PHASE;
        this.phaseTime = MafiaPhaseTime.DISCUSS_PHASE_TIME;
        this.setActiveActions();
        this.setActiveRoles();
    }
}


export default DiscussPhase;