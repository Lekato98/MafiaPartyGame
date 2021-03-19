import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { ArraySchema, Schema, type } from '@colyseus/schema';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaRoleUtils from '../../utils/MafiaRoleUtils';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { IActionName } from '../../MafiaRoom';
import { IMessageToDeadAction } from '../payloads/actionsPayload';
import { AbstractActionResult } from '../results/actionResults';

export enum MafiaActionsName {
    DOCTOR_ACTIONS = 'DOCTOR_ACTIONS',
    DETECTOR_ACTIONS = 'DETECTOR_ACTIONS',
    MAFIA_ACTIONS = 'MAFIA_ACTIONS',
    VOTE_ACTIONS = 'VOTE_ACTIONS',
    DISCUSS_ACTIONS = 'DISCUSS_ACTIONS',
    MODERATOR_ACTIONS = 'MODERATOR_ACTIONS',
}

abstract class AbstractActions extends Schema {
    @type('string') readonly emptyString: string = 'empty';
    players: ArraySchema<MafiaPlayer>;

    abstract onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: IActionName): void;

    public messageToDead(player: MafiaPlayer, payload: IMessageToDeadAction) {
        if (MafiaRoleUtils.isDead(player.getRole())) {
            this.players.forEach(player => MafiaRoleUtils.isDead(player.getRole())
                && player.send(MafiaPhaseAction.MESSAGE_TO_DEAD, payload.message));
        } else {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        }
    }

    public getResult(): ArraySchema<AbstractActionResult> {
        return new ArraySchema<AbstractActionResult>();
    }
}

export default AbstractActions;
