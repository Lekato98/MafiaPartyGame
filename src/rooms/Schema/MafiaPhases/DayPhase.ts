import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import PhaseFactory from "./PhasesFactory";
import MafiaPhasesUtils, {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class DayPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDayState();
    }

    refreshDayState(): void {
        this.phaseName = MafiaPhasesNameEnum.DAY_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.DAY_PHASE_TIME;
        this.setActiveRoles();
    }
}

export default DayPhase;