import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';

class VotePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshVotePhase();
    }

    public onBegin(): void {
        this.context.setCurrentActionByName(this.actionsName);
    }

    public onEnd(): void {
        this.context.action.transferResults();
        const playerToKick: boolean = this.context.actionsResult.has(MafiaPhaseAction.KICK_VOTE);

        if (playerToKick) {
            this.setNextPhase(this.getNextPhaseByOrder());
        }
    }

    refreshVotePhase(): void {
        this.name = MafiaPhaseName.VOTE_PHASE;
        this.time = MafiaPhaseTime.VOTE_PHASE;
        this.actionsName = MafiaActionsName.VOTE_ACTIONS;
        this.refreshPhase();
    }
}


export default VotePhase;
