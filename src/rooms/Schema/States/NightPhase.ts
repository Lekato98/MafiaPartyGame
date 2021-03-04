import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import MafiaPhase from "./MafiaPhase";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class NightPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshNightState();
    }

    goToNextPhase(): void {
        const mafiaPhase = new MafiaPhase(this.context);
        this.context.setCurrentPhase(mafiaPhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.MAFIA_PHASE;
    }

    refreshNightState() {
        this.phaseName = PhaseEnum.NIGHT_PHASE;
        this.phaseTime = PhaseTime.NIGHT_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        this.activeRolesForCurrentState.push(MafiaRolesEnum.MODERATOR);
    }
}

export default NightPhase;