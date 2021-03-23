import AbstractPhase from './AbstractPhase';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { AbstractActionResult } from '../results/actionResults';
import { RoomError, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { MafiaRoomMessage } from '../../MafiaRoom';

class DefensePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDefensePhase();
    }

    public onBegin(): void {
        this.context.setCurrentActionByName(this.actionsName);
        const voteKickResult: AbstractActionResult = this.context.actionsResult.get(MafiaPhaseAction.KICK_VOTE);
        if (!voteKickResult) {
            this.context.nextPhase();
            throw new RoomError(RoomErrorMessage.DEFENSE_PHASE_WITHOUT_PLAYER_TO_KICK);
        }
    }

    public onEnd(): void {
        this.context.action.transferResults();
        const executePlayer = this.context.actionsResult.get(MafiaPhaseAction.EXECUTE_PLAYER);

        if (executePlayer) {
            this.context.killOneById(executePlayer.playerId, MafiaRoomMessage.YOU_WERE_EXECUTED);
        }
    }

    private refreshDefensePhase() {
        this.name = MafiaPhaseName.DEFENSE_PHASE;
        this.time = MafiaPhaseTime.DEFENSE_PHASE;
        this.actionsName = MafiaActionsName.DEFENSE_ACTIONS;
        this.refreshPhase();
    }
}

export default DefensePhase;
