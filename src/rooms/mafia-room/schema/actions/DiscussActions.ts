import { ArraySchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';

class DiscussActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    public doAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.MESSAGE_TO_ALL:
                this.messageToAllAction(player, payload.message);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public messageToAllAction(player: MafiaPlayer, message: string) {
        this.players.forEach(player => player.send(MafiaPhaseAction.MESSAGE_TO_ALL, message));
    }
}

export default DiscussActions;
