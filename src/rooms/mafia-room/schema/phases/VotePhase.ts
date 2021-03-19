import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';

class VotePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshVotePhase();
    }

    refreshVotePhase(): void {
        this.phaseName = MafiaPhaseName.VOTE_PHASE;
        this.phaseTime = MafiaPhaseTime.VOTE_PHASE;
        this.actionsName = MafiaActionsName.VOTE_ACTIONS;
        this.refreshPhase();
    }
}


export default VotePhase;
