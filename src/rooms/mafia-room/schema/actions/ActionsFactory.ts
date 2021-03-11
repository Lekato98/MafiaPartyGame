import {ArraySchema} from "@colyseus/schema";
import MafiaPlayer from "../clients/MafiaPlayer";
import {MafiaActionsName} from "./IActions";
import DetectiveActions from "./DetectiveActions";
import DiscussActions from "./DiscussActions";
import DoctorActions from "./DoctorActions";
import VoteActions from "./VoteActions";
import MafiaActions from "./MafiaActions";
import {InvalidPhaseAction, RoomError} from "../../errors/MafiaRoomErrors";

abstract class ActionsFactory {
    public static createActions(action: MafiaActionsName, players: ArraySchema<MafiaPlayer>) {
        switch (action) {
            case MafiaActionsName.DETECTIVE_ACTIONS:
                return new DetectiveActions(players);

            case MafiaActionsName.DISCUSS_ACTIONS:
                return new DiscussActions(players);

            case MafiaActionsName.DOCTOR_ACTIONS:
                return new DoctorActions(players);

            case MafiaActionsName.MAFIA_ACTIONS:
                return new MafiaActions(players);

            case MafiaActionsName.VOTE_ACTIONS:
                return new VoteActions(players);

            default:
                throw new InvalidPhaseAction(RoomError.UNKNOWN_ACTION_NAME);
        }
    }
}

export default ActionsFactory;