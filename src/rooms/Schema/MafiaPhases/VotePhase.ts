import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class VotePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshVoteState();
    }

    refreshVoteState(): void {
        this.phaseName = MafiaPhasesNameEnum.VOTE_PHASE;
        this.phaseTime = MafiaPhasesTimeEnum.VOTE_PHASE_TIME;
        this.setActiveRoles();
    }
}


export default VotePhase;