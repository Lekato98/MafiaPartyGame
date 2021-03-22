import AbstractPhase from './AbstractPhase';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { AbstractActionResult } from '../results/actionResults';
import { RoomError, RoomErrorMessage } from '../../errors/MafiaRoomErrors';

class DefensePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDefensePhase();
    }

    public onBegin(): void {
        const voteKickResult: AbstractActionResult = this.context.phaseActionsResult.find(result =>
            result.actionName === MafiaPhaseAction.KICK_VOTE
        );

        if(voteKickResult) {
            this.actions.setExtra<string>(voteKickResult.playerId);
        } else {
            this.context.nextPhase();
            throw new RoomError(RoomErrorMessage.DEFENSE_PHASE_WITHOUT_PLAYER_TO_KICK);
        }
    }

    public onEnd() {
    }

    private refreshDefensePhase() {
        this.name = MafiaPhaseName.DEFENSE_PHASE;
        this.time = MafiaPhaseTime.DEFENSE_PHASE;
        this.actionsName = MafiaActionsName.DEFENSE_ACTIONS;
        this.refreshPhase();
    }
}

export default DefensePhase;
