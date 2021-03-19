export enum RoomErrorName {
    INVALID_NUMBER_OF_PLAYERS = 'InvalidNumberOfPlayers',
    INVALID_CLIENT_TYPE = 'InvalidClientType',
    INVALID_PHASE_NAME = 'InvalidPhaseName',
    INVALID_PHASE_ACTION = 'InvalidPhaseAction',
    ROOM_ERROR = 'RoomError',
}

export enum RoomErrorMessage {
    ROOM_IS_FULL = 'ROOM IS FULL',
    INVALID_NUMBER_OF_PLAYERS = 'INVALID NUMBER OF PLAYERS',
    INVALID_CLIENT_TYPE = 'INVALID CLIENT TYPE',
    GAME_ALREADY_STARTED = 'GAME ALREADY STARTED',
    NOT_GAME_LEADER = 'ONLY GAME LEADER CAN START THE GAME!',
    UNKNOWN_PHASE_NAME = 'UNKNOWN PHASE NAME ',
    UNKNOWN_ACTION_NAME = 'UNKNOWN ACTION NAME',
    INVALID_PHASE_ACTION = 'ACTION IS NOT INCLUDED IN THIS PHASE OR ITS INVALID',
    DOCTOR_PROTECT_HIMSELF = 'DOCTOR TRYING TO PROTECT HIMSELF',
    DETECTOR_DETECT_HIMSELF = 'DETECTOR TRYING TO DETECT HIMSELF',
    MAFIA_KILL_HIMSELF = 'MAFIA TRYING TO KILL HIMSELF',
    MAFIA_KILL_MAFIA = 'MAFIA TRYING TO KILL MAFIA',
    HAS_REACH_ACTION_LIMITS = 'HAS REACH ACTION LIMITS',
    INVALID_ROLE_ACTION_CALL = 'ROLE IS INVALID TO CALL CURRENT ACTION',
    UNKNOWN_PLAYER = 'UNKNOWN PLAYER',
    ACTION_ON_UNKNOWN_PLAYER = 'TRYING TO DO SOMETHING TO UNKNOWN PLAYER',
    INVALID_REPLACE_UNAVAILABLE_ROLE = 'TRYING TO REPLACE UNAVAILABLE ROLE',
}

export class RoomError extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, RoomError.prototype);

        this.code = code;
        this.name = RoomErrorName.ROOM_ERROR;
    }
}

export class InvalidNumberOfPlayers extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidNumberOfPlayers.prototype);

        this.code = code;
        this.name = RoomErrorName.INVALID_NUMBER_OF_PLAYERS;
    }
}

export class InvalidClientType extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidNumberOfPlayers.prototype);

        this.code = code;
        this.name = RoomErrorName.INVALID_CLIENT_TYPE;
    }
}

export class InvalidPhaseName extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidPhaseName.prototype);

        this.code = code;
        this.name = RoomErrorName.INVALID_PHASE_NAME;
    }
}

export class InvalidPhaseAction extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidPhaseName.prototype);

        this.code = code;
        this.name = RoomErrorName.INVALID_PHASE_ACTION;
    }
}
