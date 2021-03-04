import AbstractPhase, {PhaseEnum} from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import NightPhase from "./NightPhase";
import MafiaPhase from "./MafiaPhase";
import DetectivePhase from "./DetectivePhase";
import DoctorPhase from "./DoctorPhase";
import DayPhase from "./DayPhase";
import DiscussPhase from "./DiscussPhase";
import VotePhase from "./VotePhase";

class PhaseFactory {
    public static createPhase(phaseType: PhaseEnum, context: MafiaGameState): AbstractPhase {
        switch (phaseType) {
            case PhaseEnum.NIGHT_PHASE:
                return new NightPhase(context);

            case PhaseEnum.MAFIA_PHASE:
                return new MafiaPhase(context);

            case PhaseEnum.DETECTIVE_PHASE:
                return new DetectivePhase(context);

            case PhaseEnum.DOCTOR_PHASE:
                return new DoctorPhase(context);

            case PhaseEnum.DAY_PHASE:
                return new DayPhase(context);

            case PhaseEnum.DISCUSS_PHASE:
                return new DiscussPhase(context);

            case PhaseEnum.VOTE_PHASE:
                return new VotePhase(context);
        }
    }
}

export default PhaseFactory;