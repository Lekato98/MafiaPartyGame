import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/IActions";

class VotePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshVotePhase();
    }

    refreshVotePhase(): void {
        this.phaseName = MafiaPhaseName.VOTE_PHASE;
        this.phaseTime = MafiaPhaseTime.VOTE_PHASE_TIME;
        this.actions = ActionsFactory.createActions(MafiaActionsName.VOTE_ACTIONS, this.context.players);
        this.refreshPhase();
    }
}


export default VotePhase;