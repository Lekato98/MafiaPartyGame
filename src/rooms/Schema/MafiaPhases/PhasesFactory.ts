import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import NightPhase from "./NightPhase";
import MafiaPhase from "./MafiaPhase";
import DetectivePhase from "./DetectivePhase";
import DoctorPhase from "./DoctorPhase";
import DayPhase from "./DayPhase";
import DiscussPhase from "./DiscussPhase";
import VotePhase from "./VotePhase";
import {MafiaPhasesNameEnum} from "../../MafiaUtils/MafiaPhasesUtils";

class PhaseFactory {
    public static createPhase(phaseType: MafiaPhasesNameEnum, context: MafiaGameState): AbstractPhase {
        switch (phaseType) {
            case MafiaPhasesNameEnum.NIGHT_PHASE:
                return new NightPhase(context);

            case MafiaPhasesNameEnum.MAFIA_PHASE:
                return new MafiaPhase(context);

            case MafiaPhasesNameEnum.DETECTIVE_PHASE:
                return new DetectivePhase(context);

            case MafiaPhasesNameEnum.DOCTOR_PHASE:
                return new DoctorPhase(context);

            case MafiaPhasesNameEnum.DAY_PHASE:
                return new DayPhase(context);

            case MafiaPhasesNameEnum.DISCUSS_PHASE:
                return new DiscussPhase(context);

            case MafiaPhasesNameEnum.VOTE_PHASE:
                return new VotePhase(context);
        }
    }
}

export default PhaseFactory;