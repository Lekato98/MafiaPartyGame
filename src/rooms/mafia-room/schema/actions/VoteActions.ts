import {ArraySchema, Schema} from "@colyseus/schema";
import IActions from "./IActions";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";

class VoteActions extends Schema implements IActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
    }

}

export default VoteActions;