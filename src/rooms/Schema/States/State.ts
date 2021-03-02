import {ArraySchema, defineTypes, Schema} from "@colyseus/schema";
import {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";

export enum StatesEnum {
    NIGHT_STATE = 'NIGHT',
    MAFIA_STATE = 'MAFIA',
    DETECTIVE_STATE = 'DETECTIVE',
    DOCTOR_STATE = 'DOCTOR',
    DAY_STATE = 'DAY',
    DISCUSS_STATE = 'DISCUSS',
    VOTE_STATE = 'VOTE',
}

export enum StatesPhaseTime { // time in seconds
    NIGHT_PHASE_TIME = 3,
    MAFIA_PHASE_TIME = 6,
    DETECTIVE_PHASE_TIME =6,
    DOCTOR_PHASE_TIME = 6,
    DAY_PHASE_TIME = 3,
    DISCUSS_PHASE_TIME = 6,
    VOTE_PHASE_TIME = 6,
}

abstract class State extends Schema{
    turn: ArraySchema<MafiaRolesEnum>;
    phaseTime: StatesPhaseTime;
    stateName: StatesEnum;

    abstract action(): State;
    abstract getNextState(): StatesEnum;
    abstract getState(): StatesEnum;
    getPhaseTime(): StatesPhaseTime {
        return this.phaseTime + 1;
    }
}

defineTypes(State, {
    turn: ['string'],
    phaseTime: 'int8',
    stateName: 'string'
});

export default State;