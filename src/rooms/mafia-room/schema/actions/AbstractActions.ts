import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { ArraySchema, Schema, type } from '@colyseus/schema';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaRoleUtils from '../../utils/MafiaRoleUtils';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { IActionName } from '../../MafiaRoom';
import { IMessageToAllPayload, IMessageToDeadAction } from './payloads/actionsPayload';
import { AbstractActionResult } from '../results/actionResults';
import MafiaGameState from '../MafiaGameState';

export enum MafiaActionsName {
    DOCTOR_ACTIONS = 'DOCTOR_ACTIONS',
    DETECTOR_ACTIONS = 'DETECTOR_ACTIONS',
    MAFIA_ACTIONS = 'MAFIA_ACTIONS',
    VOTE_ACTIONS = 'VOTE_ACTIONS',
    DISCUSS_ACTIONS = 'DISCUSS_ACTIONS',
    MODERATOR_ACTIONS = 'MODERATOR_ACTIONS',
    DEFENSE_ACTIONS = 'DEFENSE_ACTIONS',
}

abstract class AbstractActions extends Schema {
    @type('string') readonly emptyString: string = 'empty';
    context: MafiaGameState;

    abstract onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: IActionName): void;

    public messageToAllAction(player: MafiaPlayer, payload: IMessageToAllPayload) {
        this.context.players.forEach(player => player.send(MafiaPhaseAction.MESSAGE_TO_ALL, payload.message));
    }

    public messageToDead(player: MafiaPlayer, payload: IMessageToDeadAction) {
        if (MafiaRoleUtils.isDead(player.getRole())) {
            this.context.players.forEach(player => MafiaRoleUtils.isDead(player.getRole())
                && player.send(MafiaPhaseAction.MESSAGE_TO_DEAD, payload.message));
        } else {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        }
    }

    public isPlayerExist(sessionId: string): boolean {
        return this.context.players.findIndex(player => player.getId() === sessionId) !== -1;
    }

    public getResults(): ArraySchema<AbstractActionResult> {
        return new ArraySchema<AbstractActionResult>();
    }

    public transferResults(): void {
        const results = this.getResults();
        results.forEach(result => this.context.actionsResult.set(result.actionName, result));
    }
}

export default AbstractActions;
