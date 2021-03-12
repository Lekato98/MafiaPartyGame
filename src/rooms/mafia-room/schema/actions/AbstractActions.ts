import {Client} from "colyseus";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {ArraySchema, Schema, type} from "@colyseus/schema";
import MafiaPlayer from "../clients/MafiaPlayer";

export enum MafiaActionsName {
    DOCTOR_ACTIONS = 'DOCTOR_ACTIONS',
    DETECTIVE_ACTIONS = 'DETECTIVE_ACTIONS',
    MAFIA_ACTIONS = 'MAFIA_ACTIONS',
    VOTE_ACTIONS = 'VOTE_ACTIONS',
    DISCUSS_ACTIONS = 'DISCUSS_ACTIONS',
    MODERATOR_ACTIONS = 'MODERATOR_ACTIONS',
}

abstract class AbstractActions extends Schema {
    @type('string') readonly emptyString: string = 'empty';
    players: ArraySchema<MafiaPlayer>;

    abstract doAction(client: Client, action: MafiaPhaseAction, payload: any): void;
}

export default AbstractActions;