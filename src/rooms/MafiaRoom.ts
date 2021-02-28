import * as http from 'http';
import {Client, Room} from 'colyseus';
import MafiaGame from "./Schema/MafiaGame";
import {RoomsNameEnum} from "../utils/colyseusServer";
import {CREATED, JOINED, LEFT, REMOVED} from "../utils/RoomLogs";


class MafiaRoom extends Room {
    private ROOM_NAME: string;
    public state: MafiaGame;

    onCreate(options: any): void | Promise<any> {
        this.ROOM_NAME = `${RoomsNameEnum.MAFIA}#${this.roomId}`;
        this.setState(new MafiaGame());
        CREATED(this.ROOM_NAME);
    }

    onAuth(client: Client, clientOptions: any, request?: http.IncomingMessage): any {
        return 'token';
    }

    onJoin(client: Client, clientOptions?: any, auth?: any): void | Promise<any> {
        this.state.join(client, clientOptions);
        JOINED(this.ROOM_NAME);
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