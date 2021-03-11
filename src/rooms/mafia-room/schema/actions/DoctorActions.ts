import {ArraySchema, Schema} from "@colyseus/schema";
import IActions from "./IActions";
import {InvalidPhaseAction, RoomError} from "../../errors/MafiaRoomErrors";
import {Client} from "colyseus";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import MafiaPlayer from "../clients/MafiaPlayer";

class DoctorActions extends Schema implements IActions {
    private protectedPlayer: string;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.protectedPlayer = '';
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DOCTOR_PROTECT_ONE:
                this.protectAction(client, payload.player);
                break;
            default:
                throw new InvalidPhaseAction(RoomError.INVALID_PHASE_ACTION);
        }
    }

    public protectAction(client: Client, playerId: string): void {
        if (this.isDoctorProtectingHimself(client, playerId)) {
            throw new InvalidPhaseAction(RoomError.DOCTOR_PROTECT_HIMSELF);
        } else {
            this.setProtectedPlayer(playerId);
        }
    }

    public setProtectedPlayer(protectedPlayer: string): void {
        this.protectedPlayer = protectedPlayer;
    }

    public isDoctorProtectingHimself(client: Client, playerId: string): boolean {
        return client.sessionId === playerId;
    }
}

export default DoctorActions;