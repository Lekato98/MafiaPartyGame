import {ArraySchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";
import {InvalidPhaseAction, RoomErrorMessage} from "../../errors/MafiaRoomErrors";

class DetectiveActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DETECTOR_DETECT_ONE:
                this.detectAction(client, payload.detectPlayerId);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public detectAction(client: Client, detectedSessionId: string): void {
        if (!this.isPlayerExist(detectedSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if(this.isDetectingHimself(client.sessionId, detectedSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.DETECTOR_DETECT_HIMSELF);
        } else {
            const playerIndex = this.players.map(player => player.getSessionId()).indexOf(detectedSessionId);
            const player = this.players[playerIndex];

            client.send('DETECTIVE_RESULT', {playerId: detectedSessionId, role: player.getRole()})
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
