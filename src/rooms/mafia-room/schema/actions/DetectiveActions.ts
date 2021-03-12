import {ArraySchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";
import {InvalidPhaseAction, RoomError} from "../../errors/MafiaRoomErrors";

class DetectiveActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DETECTOR_DETECT_ONE:
                this.detectAction(client, payload.detectPlayerId);
                break;
        }
    }

    detectAction(client: Client, detectedSessionId: string): void {
        if (!this.isPlayerExist(detectedSessionId) && this.isDetectingHimself(client.sessionId, detectedSessionId)) {
            throw new InvalidPhaseAction(RoomError.DETECTOR_DETECT_HIMSELF);
        } else {
            const playerIndex = this.players.map(player => player.getSessionId()).indexOf(detectedSessionId);
            const player = this.players[playerIndex];

            client.send('DETECTIVE_RESULT', {playerId: detectedSessionId, role: player.getRole()})
        }
    }

    isDetectingHimself(sessionId: string, detectedSessionId: string): boolean {
        return sessionId === detectedSessionId;
    }

    isPlayerExist(sessionId: string): boolean {
        return this.players.map(player => player.getSessionId()).includes(sessionId);
    }

}

export default DetectiveActions;