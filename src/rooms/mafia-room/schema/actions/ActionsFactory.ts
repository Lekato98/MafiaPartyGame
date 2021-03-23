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
import MafiaGameState from '../MafiaGameState';

abstract class ActionsFactory {
    public static createActions(action: MafiaActionsName, context: MafiaGameState) {
        switch (action) {
            case MafiaActionsName.DETECTOR_ACTIONS:
                return new DetectorActions(context);

            case MafiaActionsName.DISCUSS_ACTIONS:
                return new DiscussActions(context);

            case MafiaActionsName.DOCTOR_ACTIONS:
                return new DoctorActions(context);

            case MafiaActionsName.MAFIA_ACTIONS:
                return new MafiaActions(context);

            case MafiaActionsName.VOTE_ACTIONS:
                return new VoteActions(context);

            case MafiaActionsName.DEFENSE_ACTIONS:
                return new DefenseActions(context);

            case MafiaActionsName.MODERATOR_ACTIONS:
                return new ModeratorActions(context);

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.UNKNOWN_ACTION_NAME);
        }
    }
}

export default ActionsFactory;
