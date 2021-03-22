import { MafiaPhaseName } from './MafiaPhaseUtils';
import { InvalidPhaseName, RoomErrorMessage } from '../errors/MafiaRoomErrors';

export enum MafiaPhaseAction {
    KICK_VOTE = 'KICK_VOTE',
    MESSAGE_TO_ALL= 'MESSAGE_ALL',
    MESSAGE_TO_MAFIA= 'MESSAGE_MAFIA',
    MESSAGE_TO_DEAD= 'MESSAGE_DEAD',
    MAFIA_KILL_VOTE= 'KILL_VOTE',
    DOCTOR_PROTECT_ONE= 'PROTECT_ONE',
    DETECTOR_DETECT_ONE= 'DETECT_ONE',
    INNOCENT_VOTE= 'INNOCENT_VOTE',
    GUILTY_VOTE= 'GUILTY_VOTE',
    EXECUTE_PLAYER= 'EXECUTE_PLAYER',
}

// -1 for infinity
export enum MafiaPhasesActionLimit {
    KICK_VOTE = 1,
    MESSAGE_TO_ALL = -1,
    MESSAGE_TO_MAFIA = -1,
    MESSAGE_TO_DEAD = -1,
    MAFIA_KILL_VOTE = 1,
    DOCTOR_PROTECT_ONE = 1,
    DETECTOR_DETECT_ONE = 1,
    EXECUTE_VOTE = 1,
}

class MafiaPhaseActionUtils {
    public static readonly ACTIVE_ACTIONS_DAY: Array<MafiaPhaseAction> = [];
    public static readonly ACTIVE_ACTIONS_NIGHT: Array<MafiaPhaseAction> = [];

    public static readonly ACTIVE_ACTIONS_ALL: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.MESSAGE_TO_DEAD,
    ];

    public static readonly ACTIVE_ACTIONS_MAFIA: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.MESSAGE_TO_MAFIA,
        MafiaPhaseAction.MAFIA_KILL_VOTE,
    ];

    public static readonly ACTIVE_ACTIONS_DETECTOR: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.DETECTOR_DETECT_ONE,
    ];

    public static readonly ACTIVE_ACTIONS_DOCTOR: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.DOCTOR_PROTECT_ONE,
    ];

    public static readonly ACTIVE_ACTIONS_DISCUSS: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.MESSAGE_TO_ALL,
    ];

    public static readonly ACTIVE_ACTIONS_VOTE: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.MESSAGE_TO_ALL,
        MafiaPhaseAction.KICK_VOTE,
    ];

    public static readonly ACTIVE_ACTIONS_DEFENSE: Array<MafiaPhaseAction> = [
        MafiaPhaseAction.MESSAGE_TO_ALL,
        MafiaPhaseAction.GUILTY_VOTE,
        MafiaPhaseAction.INNOCENT_VOTE,
    ];

    public static getActiveActionsByPhaseName(phaseName: MafiaPhaseName): Array<MafiaPhaseAction> {
        switch (phaseName) {
            case MafiaPhaseName.NIGHT_PHASE:
                return this.ACTIVE_ACTIONS_NIGHT;

            case MafiaPhaseName.MAFIA_PHASE:
                return this.ACTIVE_ACTIONS_MAFIA;

            case MafiaPhaseName.DETECTOR_PHASE:
                return this.ACTIVE_ACTIONS_DETECTOR;

            case MafiaPhaseName.DOCTOR_PHASE:
                return this.ACTIVE_ACTIONS_DOCTOR;

            case MafiaPhaseName.DAY_PHASE:
                return this.ACTIVE_ACTIONS_DAY;

            case MafiaPhaseName.DISCUSS_PHASE:
                return this.ACTIVE_ACTIONS_DISCUSS;

            case MafiaPhaseName.VOTE_PHASE:
                return this.ACTIVE_ACTIONS_VOTE;

            case MafiaPhaseName.DEFENSE_PHASE:
                return this.ACTIVE_ACTIONS_DEFENSE;

            default:
                throw new InvalidPhaseName(RoomErrorMessage.UNKNOWN_PHASE_NAME);
        }
    }
}

export default MafiaPhaseActionUtils;
