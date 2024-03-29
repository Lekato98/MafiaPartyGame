import { ArraySchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';

class DiscussActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    public onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.MESSAGE_TO_ALL:
                this.messageToAllAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_DEAD:
                this.messageToDead(player, payload);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }
}

export default DiscussActions;
