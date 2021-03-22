import * as http from 'http';
import { Client, Room } from 'colyseus';
import MafiaRoomState from './schema/MafiaRoomState';
import { RoomName } from '../../colyseus/ColyseusServer';
import LogsUtils from '../../utils/LogsUtils';
import { MafiaPhaseAction } from './utils/MafiaPhaseActionUtils';

export enum MafiaRoomMessageType {
    ERROR = 'ERROR',
    ACTION = 'ACTION',
    START = 'START',
    MODERATOR = 'MODERATOR',
}

export enum MafiaRoomMessage {
    MAFIA_TO_KILL = 'Who do you want to kill?',
    DOCTOR_TO_PROTECT = 'Who do you want to protect?',
    DETECTOR_TO_DETECT = 'Who do you want to know about?',
    YOU_WERE_KILLED = 'Mafia killed you!',
    YOU_WERE_EXECUTED = 'Players decides to execute you! ',
}

export interface IActionName {
    actionName: MafiaPhaseAction,
}

export interface IClientOptions {
    username: string,
    jointType: string, // PLAYER, SPECTATOR
}

class MafiaRoom extends Room {
    public state: MafiaRoomState;
    private ROOM_NAME: string;

    onCreate(options: any): void | Promise<any> {
        // configs & options
        this.ROOM_NAME = `${ RoomName.MAFIA }#${ this.roomId }`;
        this.maxClients = 30;

        // state
        this.setState(new MafiaRoomState());

        // events
        this.onMessage(MafiaRoomMessageType.ACTION, (client: Client, payload: IActionName) => {
            try {
                this.state.gameState.onAction(client, payload);
            } catch (err) {
                client.send(MafiaRoomMessageType.ERROR, err.message);
            }
        });

        this.onMessage(MafiaRoomMessageType.START, (client: Client) => {
            try {
                this.state.gameState.startGame(client);
            } catch (err) {
                client.send(MafiaRoomMessageType.ERROR, err.message);
            }
        });

        LogsUtils.CREATED(this.ROOM_NAME);
    }

    onAuth(client: Client, clientOptions: IClientOptions, request?: http.IncomingMessage): any {
        return 'token';
    }

    onJoin(client: Client, clientOptions?: IClientOptions, auth?: any): void | Promise<any> {
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
