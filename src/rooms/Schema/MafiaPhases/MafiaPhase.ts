import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class MafiaPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshMafiaState();
    }

    refreshMafiaState(): void {
        this.phaseName = MafiaPhasesNameEnum.MAFIA_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.MAFIA_PHASE_TIME;
        this.setActiveRoles();
    }
}

export default MafiaPhase;