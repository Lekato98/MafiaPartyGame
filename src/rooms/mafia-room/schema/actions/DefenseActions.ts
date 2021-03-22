import AbstractActions from './AbstractActions';
import { ArraySchema } from '@colyseus/schema';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { InvalidPhaseAction, RoomError, RoomErrorMessage } from '../../errors/MafiaRoomErrors';

class DefenseActions extends AbstractActions {
    public playerToKick: string;

    constructor(readonly player: ArraySchema<MafiaPlayer>) {
        super();
    }

    public onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.INNOCENT_VOTE:
                break; // todo

            case MafiaPhaseAction.GUILTY_VOTE:
                break; // todo

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

    public setExtra<Type>(extra: Type) {
        if(typeof extra === 'string') {
            this.setPlayerToKick(extra);
        } else {
            throw new RoomError(RoomErrorMessage.INVALID_DATA_TYPE);
        }
    }

    public setPlayerToKick(playerToKick: string): void {
        this.playerToKick = playerToKick;
    }
}

export default DefenseActions;
