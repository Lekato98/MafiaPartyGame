import * as http from 'http';
import {Client, Room} from 'colyseus';
import MafiaRoomState from "./Schema/MafiaRoomState";
import {RoomsNameEnum} from "../utils/colyseusServer";
import {CREATED, JOINED, LEFT, REMOVED} from "../utils/RoomLogs";

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
        this.ROOM_NAME = `${RoomsNameEnum.MAFIA}#${this.roomId}`;
        this.maxClients = 30;

        // state
        this.setState(new MafiaRoomState());

        // events
        this.onMessage(MafiaRoomEnum.ACTION, (client, message) => this.state.gameState.action());
        this.onMessage(MafiaRoomEnum.START, (client, message) => {
            try {
                this.state.gameState.startGame(client)
            } catch (err) {
                client.send(MafiaRoomEnum.ERROR, err.message);
            }
        });

        CREATED(this.ROOM_NAME);
    }

    onAuth(client: Client, clientOptions: any, request?: http.IncomingMessage): any {
        return 'token';
    }

    onJoin(client: Client, clientOptions?: any, auth?: any): void | Promise<any> {
        try {
            this.state.join(client, clientOptions);
            JOINED(this.ROOM_NAME);
        } catch (e) {
            client.leave(1001, e.message);
        }
    }

    onLeave(client: Client, consented?: boolean): void | Promise<any> {
        this.state.leave(client);
        LEFT(this.ROOM_NAME);
    }

    onDispose(): void | Promise<any> {
        REMOVED(this.ROOM_NAME);
    }
}

export default MafiaRoom;