import {Client} from "colyseus";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaPlayer from "../clients/MafiaPlayer";

export enum MafiaActionsName {
    DOCTOR_ACTIONS,
    DETECTIVE_ACTIONS,
    MAFIA_ACTIONS,
    VOTE_ACTIONS,
    DISCUSS_ACTIONS
}

interface IActions {
    players: ArraySchema<MafiaPlayer>;

    doAction(client: Client, action: MafiaPhaseAction, payload: any): void;
}

export default IActions;