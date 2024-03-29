import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import NightPhase from './NightPhase';
import MafiaPhase from './MafiaPhase';
import DetectorPhase from './DetectorPhase';
import DoctorPhase from './DoctorPhase';
import DayPhase from './DayPhase';
import DiscussPhase from './DiscussPhase';
import VotePhase from './VotePhase';
import { MafiaPhaseName } from '../../utils/MafiaPhaseUtils';
import { InvalidPhaseName, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import DefensePhase from './DefensePhase';

class PhaseFactory {
    public static createPhase(phaseType: MafiaPhaseName, context: MafiaGameState): AbstractPhase {
        switch (phaseType) {
            case MafiaPhaseName.NIGHT_PHASE:
                return new NightPhase(context);

            case MafiaPhaseName.MAFIA_PHASE:
                return new MafiaPhase(context);

            case MafiaPhaseName.DETECTOR_PHASE:
                return new DetectorPhase(context);

            case MafiaPhaseName.DOCTOR_PHASE:
                return new DoctorPhase(context);

            case MafiaPhaseName.DAY_PHASE:
                return new DayPhase(context);

            case MafiaPhaseName.DISCUSS_PHASE:
                return new DiscussPhase(context);

            case MafiaPhaseName.VOTE_PHASE:
                return new VotePhase(context);

            case MafiaPhaseName.DEFENSE_PHASE:
                return new DefensePhase(context);

            default:
                throw new InvalidPhaseName(RoomErrorMessage.UNKNOWN_PHASE_NAME);
        }
    }
}

export default PhaseFactory;
