import { ArraySchema } from '@colyseus/schema';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaActionsName } from './AbstractActions';
import DetectorActions from './DetectorActions';
import DiscussActions from './DiscussActions';
import DoctorActions from './DoctorActions';
import VoteActions from './VoteActions';
import MafiaActions from './MafiaActions';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import ModeratorActions from './ModeratorActions';
import DefenseActions from './DefenseActions';

abstract class ActionsFactory {
    public static createActions(action: MafiaActionsName, players: ArraySchema<MafiaPlayer>) {
        switch (action) {
            case MafiaActionsName.DETECTOR_ACTIONS:
                return new DetectorActions(players);

            case MafiaActionsName.DISCUSS_ACTIONS:
                return new DiscussActions(players);

            case MafiaActionsName.DOCTOR_ACTIONS:
                return new DoctorActions(players);

            case MafiaActionsName.MAFIA_ACTIONS:
                return new MafiaActions(players);

            case MafiaActionsName.VOTE_ACTIONS:
                return new VoteActions(players);

            case MafiaActionsName.DEFENSE_ACTIONS:
                return new DefenseActions(players);

            case MafiaActionsName.MODERATOR_ACTIONS:
                return new ModeratorActions(players);

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.UNKNOWN_ACTION_NAME);
        }
    }
}

export default ActionsFactory;
