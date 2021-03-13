import {ArraySchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";
import {InvalidPhaseAction, RoomErrorMessages} from "../../errors/MafiaRoomErrors";

class DiscussActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.MESSAGE_TO_ALL:
                this.messageToAllAction(client, payload.message);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessages.INVALID_PHASE_ACTION);
        }
    }

    public messageToAllAction(client: Client, message: string) {
        this.players.forEach(player => player.send(MafiaPhaseAction.MESSAGE_TO_ALL, message));
    }
}

export default DiscussActions;