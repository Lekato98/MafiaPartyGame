import { ArraySchema, MapSchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction, MafiaPhasesActionLimit } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { MafiaRoomMessageType } from '../../MafiaRoom';
import MafiaRoleUtils from '../../utils/MafiaRoleUtils';

class DetectorActions extends AbstractActions {
    public detectActionLimit: MapSchema<number>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.players.forEach(player => MafiaRoleUtils.isDetector(player.getRole())
            && this.detectActionLimit.set(player.getSessionId(), 0));
    }

    public doAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DETECTOR_DETECT_ONE:
                this.detectAction(player, payload.detectPlayerId);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public detectAction(player: MafiaPlayer, detectedSessionId: string): void {
        if (!MafiaRoleUtils.isDetector(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        }else if (this.hasReachDetectActionLimit(player.getSessionId())) {
            throw new InvalidPhaseAction(RoomErrorMessage.HAS_REACH_ACTION_LIMITS);
        } else if (!this.isPlayerExist(detectedSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isDetectingHimself(player.getSessionId(), detectedSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.DETECTOR_DETECT_HIMSELF);
        } else {
            const player = this.players.find(player => player.getSessionId() === detectedSessionId);
            player.send(MafiaRoomMessageType.MODERATOR, {playerId: detectedSessionId, role: player.getRole()});
            // todo detect result message interface
        }
    }

    public isDetectingHimself(sessionId: string, detectedSessionId: string): boolean {
        return sessionId === detectedSessionId;
    }

    public isPlayerExist(sessionId: string): boolean {
        return this.players.map(player => player.getSessionId()).includes(sessionId);
    }

    public hasReachDetectActionLimit(sessionId: string): boolean {
        return this.detectActionLimit.get(sessionId) === MafiaPhasesActionLimit.DETECTOR_DETECT_ONE;
    }
}

export default DetectorActions;
