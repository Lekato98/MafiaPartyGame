function CREATED(ROOM_NAME: string): void {
    console.log(`~CREATED ROOM[${ROOM_NAME}]`);
}

function AUTHORIZED(ROOM_NAME: string): void {
    console.log(`~AUTHORIZED ROOM[${ROOM_NAME}]`);
}

function UNAUTHORIZED(ROOM_NAME: string): void {
    console.log(`~UNAUTHORIZED ROOM[${ROOM_NAME}]`);
}

function JOINED(ROOM_NAME: string): void {
    console.log(`~JOINED ROOM[${ROOM_NAME}]`);
}

function TRYING_TO_RECONNECT(ROOM_NAME: string): void {
    console.log(`~TRYING_TO_RECONNECT ROOM[${ROOM_NAME}]`);
}

function RECONNECTED(ROOM_NAME: string): void {
    console.log(`~RECONNECTED ROOM[${ROOM_NAME}]`);
}

function RESERVING(ROOM_NAME: string): void {
    console.log(`~RESERVING ROOM[${ROOM_NAME}]`);
}

function FAILED(ROOM_NAME: string): void {
    console.log(`~FAILED_TO_RECONNECT ROOM[${ROOM_NAME}]`);
}

function LEFT(ROOM_NAME: string): void {
    console.log(`~LEFT ROOM[${ROOM_NAME}]`);
}

function REMOVED(ROOM_NAME: string): void {
    console.log(`~REMOVED ROOM[${ROOM_NAME}]`);
}

export {
    CREATED,
    AUTHORIZED,
    UNAUTHORIZED,
    JOINED,
    TRYING_TO_RECONNECT,
    RECONNECTED,
    RESERVING,
    FAILED,
    LEFT,
    REMOVED,
};
