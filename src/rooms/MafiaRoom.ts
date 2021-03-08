import * as http from 'http';
import {Client, Room} from 'colyseus';
import MafiaRoomState from "./Schema/MafiaRoomState";
import {RoomName} from "../colyseus/ColyseusServer";
import LogsUtils from "../utils/LogsUtils";

export enum MafiaRoomEnum {
    ERROR = 'ERROR',
    ACTION = 'ACTION',
    START = 'START',
}

class MafiaRoom extends Room {
    public state: MafiaRoomState;
    private ROOM_NAME: string;

    onCreate(options: any): void | Promise<any> {

        // configs
        this.ROOM_NAME = `${RoomName.MAFIA}#${this.roomId}`;
        this.maxClients = 30;

        // state
        this.setState(new MafiaRoomState());

        // events
        this.onMessage(MafiaRoomEnum.ACTION, (client, message) => console.log('some action', client.sessionId, message));
        this.onMessage(MafiaRoomEnum.START, (client) => {
            try {
                this.state.gameState.startGame(client)
            } catch (err) {
                client.send(MafiaRoomEnum.ERROR, err.message);
            }
        });

        LogsUtils.CREATED(this.ROOM_NAME);
    }

    onAuth(client: Client, clientOptions: any, request?: http.IncomingMessage): any {
        return 'token';
    }

    onJoin(client: Client, clientOptions?: any, auth?: any): void | Promise<any> {
        try {
            this.state.join(client, clientOptions);
            LogsUtils.JOINED(this.ROOM_NAME);
        } catch (e) {
            client.leave(1001, e.message);
        }
    }

    onLeave(client: Client, consented?: boolean): void | Promise<any> {
        this.state.leave(client);
        LogsUtils.LEFT(this.ROOM_NAME);
    }

    onDispose(): void | Promise<any> {
        LogsUtils.REMOVED(this.ROOM_NAME);
    }
}

export default MafiaRoom;