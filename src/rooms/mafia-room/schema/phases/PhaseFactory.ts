import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import NightPhase from "./NightPhase";
import MafiaPhase from "./MafiaPhase";
import DetectivePhase from "./DetectivePhase";
import DoctorPhase from "./DoctorPhase";
import DayPhase from "./DayPhase";
import DiscussPhase from "./DiscussPhase";
import VotePhase from "./VotePhase";
import {MafiaPhaseName} from "../../utils/MafiaPhaseUtils";
import {InvalidPhaseName, RoomErrorMessage} from "../../errors/MafiaRoomErrors";

class PhaseFactory {
    public static createPhase(phaseType: MafiaPhaseName, context: MafiaGameState): AbstractPhase {
        switch (phaseType) {
            case MafiaPhaseName.NIGHT_PHASE:
                return new NightPhase(context);

            case MafiaPhaseName.MAFIA_PHASE:
                return new MafiaPhase(context);

            case MafiaPhaseName.DETECTIVE_PHASE:
                return new DetectivePhase(context);

            case MafiaPhaseName.DOCTOR_PHASE:
                return new DoctorPhase(context);

            case MafiaPhaseName.DAY_PHASE:
                return new DayPhase(context);

            case MafiaPhaseName.DISCUSS_PHASE:
                return new DiscussPhase(context);

            case MafiaPhaseName.VOTE_PHASE:
                return new VotePhase(context);

            default:
                throw new InvalidPhaseName(RoomErrorMessage.UNKNOWN_PHASE_NAME);
        }
    }
}

export default PhaseFactory;
