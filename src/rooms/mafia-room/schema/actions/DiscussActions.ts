import {ArraySchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";

class DiscussActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
    }

}

export default DiscussActions;