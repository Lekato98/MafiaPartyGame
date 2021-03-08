import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";

class VotePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshVotePhase();
    }

    refreshVotePhase(): void {
        this.phaseName = MafiaPhaseName.VOTE_PHASE;
        this.phaseTime = MafiaPhaseTime.VOTE_PHASE_TIME;
        this.setActiveActions();
        this.setActiveRoles();
    }
}


export default VotePhase;