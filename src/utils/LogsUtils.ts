abstract class LogsUtils {
    public static CREATED(ROOM_NAME: string): void {
        console.log(`~CREATED ROOM[${ROOM_NAME}]`);
    }

    public static AUTHORIZED(ROOM_NAME: string): void {
        console.log(`~AUTHORIZED ROOM[${ROOM_NAME}]`);
    }

    public static UNAUTHORIZED(ROOM_NAME: string): void {
        console.log(`~UNAUTHORIZED ROOM[${ROOM_NAME}]`);
    }

    public static JOINED(ROOM_NAME: string): void {
        console.log(`~JOINED ROOM[${ROOM_NAME}]`);
    }

    public static TRYING_TO_RECONNECT(ROOM_NAME: string): void {
        console.log(`~TRYING_TO_RECONNECT ROOM[${ROOM_NAME}]`);
    }

    public static RECONNECTED(ROOM_NAME: string): void {
        console.log(`~RECONNECTED ROOM[${ROOM_NAME}]`);
    }

    public static RESERVING(ROOM_NAME: string): void {
        console.log(`~RESERVING ROOM[${ROOM_NAME}]`);
    }

    public static FAILED(ROOM_NAME: string): void {
        console.log(`~FAILED_TO_RECONNECT ROOM[${ROOM_NAME}]`);
    }

    public static LEFT(ROOM_NAME: string): void {
        console.log(`~LEFT ROOM[${ROOM_NAME}]`);
    }

    public static REMOVED(ROOM_NAME: string): void {
        console.log(`~REMOVED ROOM[${ROOM_NAME}]`);
    }
}

export default LogsUtils;
