enum MafiaRoomErrorsNameEnum {
    ROOM_IS_FULL_ERROR = 'RoomIsFullError',
    INVALID_NUMBER_OF_PLAYERS_ERROR = 'InvalidNumberOfPlayersError',
    INVALID_CLIENT_TYPE_ERROR = 'InvalidClientTypeError',
}

enum MafiaRoomErrorsEnum {
    ROOM_IS_FULL = 'ROOM IS FULL',
    INVALID_NUMBER_OF_PLAYERS = 'INVALID NUMBER OF PLAYERS',
    INVALID_CLIENT_TYPE = 'INVALID CLIENT TYPE',
}

class RoomIsFullError extends Error {
    readonly code: number;
    readonly name: string;
    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, RoomIsFullError.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.ROOM_IS_FULL_ERROR;
    }
}

class InvalidNumberOfPlayersError extends Error {
    readonly code: number;
    readonly name: string;
    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidNumberOfPlayersError.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.INVALID_NUMBER_OF_PLAYERS_ERROR;
    }
}

class InvalidClientType extends Error {
    readonly code: number;
    readonly name: string;
    constructor(message?: string, code?: number) {
        super(message);
        Object.setPrototypeOf(this, InvalidNumberOfPlayersError.prototype);

        this.code = code;
        this.name = MafiaRoomErrorsNameEnum.INVALID_CLIENT_TYPE_ERROR;
    }
}
