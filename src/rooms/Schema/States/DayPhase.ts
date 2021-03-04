import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import DiscussPhase from "./DiscussPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class DayPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDayState();
    }

    goToNextPhase(): void {
        const discussPhase = new DiscussPhase(this.context);
        this.context.setCurrentPhase(discussPhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.DISCUSS_PHASE;
    }

    refreshDayState(): void {
        this.phaseName = PhaseEnum.DAY_PHASE;
        this.phaseTime = PhaseTime.DAY_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        this.activeRolesForCurrentState.push(MafiaRolesEnum.MODERATOR);
    }
}

export default DayPhase;