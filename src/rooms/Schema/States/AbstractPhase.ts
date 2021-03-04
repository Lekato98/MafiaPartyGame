import {ArraySchema, defineTypes, Schema} from "@colyseus/schema";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import MafiaGameState from "../MafiaGameState";
import PhaseFactory from "./PhasesFactory";

export enum PhaseEnum {
    NIGHT_PHASE = 'NIGHT',
    MAFIA_PHASE = 'MAFIA',
    DETECTIVE_PHASE = 'DETECTIVE',
    DOCTOR_PHASE = 'DOCTOR',
    DAY_PHASE = 'DAY',
    DISCUSS_PHASE = 'DISCUSS',
    VOTE_PHASE = 'VOTE',
}

export enum PhaseTime { // time in seconds
    NIGHT_PHASE_TIME = 3,
    MAFIA_PHASE_TIME = 6,
    DETECTIVE_PHASE_TIME = 6,
    DOCTOR_PHASE_TIME = 6,
    DAY_PHASE_TIME = 3,
    DISCUSS_PHASE_TIME = 6,
    VOTE_PHASE_TIME = 6,
}

abstract class AbstractPhase extends Schema {
    activeRolesForCurrentState: ArraySchema<MafiaRolesEnum>;
    phaseTime: PhaseTime;
    phaseName: PhaseEnum;
    context: MafiaGameState;

    getNextPhase(): PhaseEnum {
        return MafiaGameUtils.getNextPhase(this.phaseName);
    };

    goToNextPhase(): void {
        const nextPhase = this.getNextPhase();
        const newPhase = PhaseFactory.createPhase(nextPhase, this.context);
        this.context.setCurrentPhase(newPhase);
    };

    getPhaseName(): PhaseEnum {
        return this.phaseName;
    }

    getPhaseTime(): PhaseTime {
        return this.phaseTime + 1;
    }
}

defineTypes(AbstractPhase, {
    turn: ['string'],
    phaseTime: 'int8',
    stateName: 'string'
});

export default AbstractPhase;