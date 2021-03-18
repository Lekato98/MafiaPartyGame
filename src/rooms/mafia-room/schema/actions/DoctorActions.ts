import { ArraySchema } from '@colyseus/schema';
import AbstractActions, { AbstractActionResult } from './AbstractActions';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaRoleUtils from '../../utils/MafiaRoleUtils';

export class ProtectActionResult extends AbstractActionResult {
    constructor() {
        super();
        this.actionName = MafiaPhaseAction.DOCTOR_PROTECT_ONE;
        this.playerId = '';
    }
}

class DoctorActions extends AbstractActions {
    protectedPlayer: string;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.protectedPlayer = '';
    }

    public doAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DOCTOR_PROTECT_ONE:
                this.protectAction(player, payload.protectPlayerId);
                break;
            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public protectAction(player: MafiaPlayer, protectSessionId: string): void {
        if (!MafiaRoleUtils.isDoctor(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        } else if (!this.isPlayerExist(protectSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isDoctorProtectingHimself(player.getSessionId(), protectSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.DOCTOR_PROTECT_HIMSELF);
        } else {
            this.setProtectedPlayer(protectSessionId);
        }
    }

    public setProtectedPlayer(protectedPlayer: string): void {
        this.protectedPlayer = protectedPlayer;
    }

    public isDoctorProtectingHimself(sessionId: string, playerId: string): boolean {
        return sessionId === playerId;
    }

    public isPlayerExist(sessionId: string): boolean {
        return this.players.map(player => player.getSessionId()).includes(sessionId);
    }

    public getResult(): ArraySchema<AbstractActionResult> {
        const result = new ArraySchema<AbstractActionResult>();
        if (this.protectedPlayer !== '') {
            const protectResult = this.getProtectResult();
            result.push(protectResult);
        }

        return result;
    }

    public getProtectResult(): AbstractActionResult {
        const protectActionResult = new ProtectActionResult();
        protectActionResult.playerId = this.protectedPlayer;

        return protectActionResult;
    }
}

export default DoctorActions;
