export enum MafiaRoomErrorsNameEnum {
    ROOM_IS_FULL_ERROR = 'RoomIsFullError',
    INVALID_NUMBER_OF_PLAYERS_ERROR = 'InvalidNumberOfPlayersError',
    INVALID_CLIENT_TYPE_ERROR = 'InvalidClientTypeError',
    GAME_ALREADY_STARTED = 'GameAlreadyStarted',
}

export enum MafiaRoomErrorsEnum {
    ROOM_IS_FULL = 'ROOM IS FULL',
    INVALID_NUMBER_OF_PLAYERS = 'INVALID NUMBER OF PLAYERS', // @TODO move to MafiaErrorsEnum
    INVALID_CLIENT_TYPE = 'INVALID CLIENT TYPE',
    GAME_ALREADY_STARTED = 'GAME ALREADY STARTED', // @TODO move to MafiaErrorsEnum
    NOT_GAME_LEADER = 'ONLY GAME LEADER CAN START THE GAME!', // @TODO move to MafiaErrorsEnum
}

export enum MafiaErrorsNameEnum {
    INVALID_PHASE_NAME = 'InvalidPhaseName',
}

export enum MafiaErrorsEnum {
    UNKNOWN_PHASE_NAME = 'UNKNOWN PHASE NAME ',
}

export class RoomIsFullError extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, RoomIsFullError.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.ROOM_IS_FULL_ERROR;
    }
}

export class InvalidNumberOfPlayersError extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidNumberOfPlayersError.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.INVALID_NUMBER_OF_PLAYERS_ERROR;
    }
}

export class InvalidClientType extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidNumberOfPlayersError.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.INVALID_CLIENT_TYPE_ERROR;
    }
}

export class GameAlreadyStarted extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, GameAlreadyStarted.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.GAME_ALREADY_STARTED;
    }
}

export class InvalidPhaseName extends Error {
    readonly code: number;
    readonly name: string;

    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidPhaseName.prototype);

        this.code = code;
        this.name = MafiaErrorsNameEnum.INVALID_PHASE_NAME;
    }
}