export enum RoomErrorName {
    ROOM_IS_FULL = 'RoomIsFull',
    INVALID_NUMBER_OF_PLAYERS = 'InvalidNumberOfPlayers',
    INVALID_CLIENT_TYPE = 'InvalidClientType',
    GAME_ALREADY_STARTED = 'GameAlreadyStarted',
    INVALID_PHASE_NAME = 'InvalidPhaseName',
    INVALID_PHASE_ACTION = 'InvalidPhaseAction',
}

export enum RoomError {
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
}

export class RoomIsFull extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, RoomIsFull.prototype);

        this.code = code;
        this.name = RoomErrorName.ROOM_IS_FULL;
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

export class GameAlreadyStarted extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, GameAlreadyStarted.prototype);

        this.code = code;
        this.name = RoomErrorName.GAME_ALREADY_STARTED;
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