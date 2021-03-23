import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import { MafiaRoomMessage, MafiaRoomMessageType } from '../../MafiaRoom';

class MafiaPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshMafiaPhase();
    }

    public onBegin(): void {
        this.context.setCurrentActionByName(this.actionsName);
        this.context.players.forEach((player: MafiaPlayer) => player.getRole() === MafiaRole.MAFIA
            && player.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.MAFIA_TO_KILL),
        );
    }

    public onEnd(): void {
        this.context.action.transferResults();
    }

    refreshMafiaPhase(): void {
        this.name = MafiaPhaseName.MAFIA_PHASE;
        this.time = MafiaPhaseTime.MAFIA_PHASE;
        this.actionsName = MafiaActionsName.MAFIA_ACTIONS;
        this.refreshPhase();
    }
}

export default MafiaPhase;
