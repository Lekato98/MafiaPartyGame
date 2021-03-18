import { ArraySchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { MafiaRoomMessageType } from '../../MafiaRoom';

class DetectiveActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
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
        if (!this.isPlayerExist(detectedSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isDetectingHimself(player.getSessionId(), detectedSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.DETECTOR_DETECT_HIMSELF);
        } else {
            const player = this.players.find(player => player.getSessionId() === detectedSessionId);
            player.send(MafiaRoomMessageType.MODERATOR, {playerId: detectedSessionId, role: player.getRole()});
        }
    }

    public isDetectingHimself(sessionId: string, detectedSessionId: string): boolean {
        return sessionId === detectedSessionId;
    }

    public isPlayerExist(sessionId: string): boolean {
        return this.players.map(player => player.getSessionId()).includes(sessionId);
    }
}

export default DetectiveActions;
