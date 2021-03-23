import { ArraySchema, MapSchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaRoleUtils, { MafiaRole } from '../../utils/MafiaRoleUtils';
import { IDoctorProtectPayload } from './payloads/actionsPayload';
import { AbstractActionResult, ProtectActionResult } from '../results/actionResults';
import ColyseusUtils from '../../../../colyseus/utils/ColyseusUtils';
import MafiaGameState from '../MafiaGameState';

class DoctorActions extends AbstractActions {
    private protectVoteActionLimit: MapSchema<number>;
    private protectVotes: MapSchema<number>;
    public protectedPlayer: string;

    constructor(readonly context: MafiaGameState) {
        super();
        this.protectedPlayer = '';
        this.protectVotes = new MapSchema<number>();
        this.protectVoteActionLimit = new MapSchema<number>();
        this.context.players.forEach((player: MafiaPlayer) =>
            player.getRole() === MafiaRole.MAFIA
            && this.protectVoteActionLimit.set(player.getId(), 0), // 0 initial value
        );
    }

    public onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DOCTOR_PROTECT_ONE:
                this.protectAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_DEAD:
                this.messageToDead(player, payload);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public protectAction(player: MafiaPlayer, payload: IDoctorProtectPayload): void {
        if (!MafiaRoleUtils.isDoctor(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        } else if (!this.isPlayerExist(payload.protectPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isDoctorProtectingHimself(player.getId(), payload.protectPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.DOCTOR_PROTECT_HIMSELF);
        } else {
            this.setProtectedPlayer(payload.protectPlayerId);
        }
    }

    public setProtectedPlayer(protectedPlayer: string): void {
        this.protectedPlayer = protectedPlayer;
    }

    public isDoctorProtectingHimself(sessionId: string, playerId: string): boolean {
        return sessionId === playerId;
    }

    public getResults(): ArraySchema<AbstractActionResult> {
        const results = new ArraySchema<AbstractActionResult>();
        if (this.protectedPlayer !== '') {
            const protectResult = this.getProtectResult();
            results.push(protectResult);
        }

        return results;
    }

    public getProtectResult(): AbstractActionResult {
        const protectActionResult = new ProtectActionResult();
        protectActionResult.playerId = ColyseusUtils.getMaxOccurrenceInMapSchema(this.protectVotes).key;

        return protectActionResult;
    }
}

export default DoctorActions;
