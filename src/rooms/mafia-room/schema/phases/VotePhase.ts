import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { ArraySchema } from '@colyseus/schema';
import { AbstractActionResult } from '../results/actionResults';

class VotePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshVotePhase();
    }

    public onBegin(): void {
    }

    public onEnd(): void {
        const results: ArraySchema<AbstractActionResult> = this.actions.getResult();
        results.forEach(result => this.context.phaseActionsResult.set(result.actionName, result));

        const playerToKick: boolean = this.context.phaseActionsResult.has(MafiaPhaseAction.KICK_VOTE);

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
