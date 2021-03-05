import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class NightPhase extends AbstractPhase {

    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshNightState();
    }

    refreshNightState() {
        this.phaseName = MafiaPhasesNameEnum.NIGHT_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.NIGHT_PHASE_TIME;
        this.setActiveRoles();
    }
}

export default NightPhase;