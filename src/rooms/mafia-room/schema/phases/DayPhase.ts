import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { AbstractActionResult } from '../results/actionResults';
import { MafiaRoomMessage } from '../../MafiaRoom';

class DayPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDayPhase();
    }

    public onBegin(): void {
        const playerToKill: AbstractActionResult = this.context.phaseActionsResult.get(MafiaPhaseAction.MAFIA_KILL_VOTE);
        const playerToProtect: AbstractActionResult = this.context.phaseActionsResult.get(MafiaPhaseAction.DOCTOR_PROTECT_ONE);

        if(playerToKill && playerToProtect) {
            const killId = playerToKill.playerId;
            const protectId = playerToProtect.playerId;
            if(killId !== protectId && killId !== '') {
                this.context.killOneById(playerToKill.playerId, MafiaRoomMessage.YOU_WERE_KILLED);
            } else if(killId !== '') {
                this.context.killOneById(playerToKill.playerId, MafiaRoomMessage.YOU_WERE_KILLED);
            }
        } else if(playerToKill) {
            if(playerToKill.playerId !== '') {
                this.context.killOneById(playerToKill.playerId, MafiaRoomMessage.YOU_WERE_KILLED);
            }
        }
    }

    public onEnd(): void {
        this.context.phaseActionsResult.clear();
    }

    refreshDayPhase(): void {
        this.name = MafiaPhaseName.DAY_PHASE;
        this.time = MafiaPhaseTime.DAY_PHASE;
        this.actionsName = MafiaActionsName.MODERATOR_ACTIONS;
        this.refreshPhase();
    }
}

export default DayPhase;
