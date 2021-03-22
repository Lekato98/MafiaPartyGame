import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import { MafiaRoomMessage, MafiaRoomMessageType } from '../../MafiaRoom';
import { ArraySchema } from '@colyseus/schema';
import { AbstractActionResult } from '../results/actionResults';

class MafiaPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshMafiaPhase();
    }

    public onBegin(): void {
        this.context.players.forEach((player: MafiaPlayer) => player.getRole() === MafiaRole.MAFIA
            && player.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.MAFIA_TO_KILL),
        );
    }

    public onEnd(): void {
        const results: ArraySchema<AbstractActionResult> = this.actions.getResult();
        results.forEach(result => this.context.phaseActionsResult.set(result.actionName, result));
    }

    refreshMafiaPhase(): void {
        this.name = MafiaPhaseName.MAFIA_PHASE;
        this.time = MafiaPhaseTime.MAFIA_PHASE;
        this.actionsName = MafiaActionsName.MAFIA_ACTIONS;
        this.refreshPhase();
    }
}

export default MafiaPhase;
