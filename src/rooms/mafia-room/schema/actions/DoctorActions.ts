import {ArraySchema, type} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {InvalidPhaseAction, RoomErrorMessages} from "../../errors/MafiaRoomErrors";
import {Client} from "colyseus";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import MafiaPlayer from "../clients/MafiaPlayer";

class DoctorActions extends AbstractActions {
    protectedPlayer: string;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.protectedPlayer = '';
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DOCTOR_PROTECT_ONE:
                this.protectAction(client, payload.protectPlayerId);
                break;
            default:
                throw new InvalidPhaseAction(RoomErrorMessages.INVALID_PHASE_ACTION);
        }
    }

    public protectAction(client: Client, protectSessionId: string): void {
        if (!this.isPlayerExist(protectSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isDoctorProtectingHimself(client.sessionId, protectSessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.DOCTOR_PROTECT_HIMSELF);
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
}

export default DoctorActions;