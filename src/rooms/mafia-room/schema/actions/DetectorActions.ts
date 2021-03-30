import { MapSchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction, MafiaPhasesActionLimit } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { MafiaRoomMessageType } from '../../MafiaRoom';
import MafiaRoleUtils from '../../utils/MafiaRoleUtils';
import { IDetectPayload } from './payloads/actionsPayload';
import { DetectActionResult } from '../results/actionResults';
import MafiaGameState from '../MafiaGameState';

class DetectorActions extends AbstractActions {
    public detectActionLimit: MapSchema<number>;

    constructor(readonly context: MafiaGameState) {
        super();
        this.context.players.forEach(player => MafiaRoleUtils.isDetector(player.getRole())
            && this.detectActionLimit.set(player.getId(), 0));
    }

    public onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DETECTOR_DETECT_ONE:
                this.detectAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_DEAD:
                this.messageToDead(player, payload);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public detectAction(player: MafiaPlayer, payload: IDetectPayload): void {
        if (!MafiaRoleUtils.isDetector(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        }else if (this.hasReachDetectActionLimit(player.getId())) {
            throw new InvalidPhaseAction(RoomErrorMessage.HAS_REACH_ACTION_LIMITS);
        } else if (!this.isPlayerExist(payload.detectPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isDetectingHimself(player.getId(), payload.detectPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.DETECTOR_DETECT_HIMSELF);
        } else {
            const detectedPlayer: MafiaPlayer = this.context.players.find(player =>
                player.getId() === payload.detectPlayerId
            );
            const detectResult = new DetectActionResult(payload.detectPlayerId, detectedPlayer.getRole());
            player.send(MafiaRoomMessageType.MODERATOR, detectResult);
        }
    }

    public isDetectingHimself(playerId: string, detectedPlayerId: string): boolean {
        return playerId === detectedPlayerId;
    }

    public hasReachDetectActionLimit(playerId: string): boolean {
        return this.detectActionLimit.get(playerId) === MafiaPhasesActionLimit.DETECTOR_DETECT_ONE;
    }
}

export default DetectorActions;
