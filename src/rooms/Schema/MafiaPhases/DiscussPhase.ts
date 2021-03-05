import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class DiscussPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDiscussState();
    }

    refreshDiscussState() {
        this.phaseName = MafiaPhasesNameEnum.DISCUSS_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.DISCUSS_PHASE_TIME;
        this.setActiveRoles();
    }
}


export default DiscussPhase;