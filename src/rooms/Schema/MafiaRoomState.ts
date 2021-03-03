import {ArraySchema, defineTypes, MapSchema, Schema} from "@colyseus/schema";
import {Client} from "colyseus";
import {Player} from "./Player";
import {Spectator} from "./Spectator";
import MafiaGameState from "./MafiaGameState";
import {GameAlreadyStarted, InvalidClientType, MafiaRoomErrorsEnum, RoomIsFullError} from "../Errors/MafiaRoomErrors";

export enum MafiaRoomStateEnum {
    PLAYER = 'PLAYER',
    SPECTATOR = 'SPECTATOR',
    MAX_NUMBER_OF_PLAYERS = 16,
    MAX_NUMBER_OF_SPECTATORS = 14,
    MILLISECOND = 1000,
    INITIAL_NUMBER_OF_PLAYERS = 0,
    INITIAL_NUMBER_OF_SPECTATORS = 0,
    DEFAULT_GAME_LEADER = '',
}

class MafiaRoomState extends Schema {
    readonly maxNumberOfPlayers: number = MafiaRoomStateEnum.MAX_NUMBER_OF_PLAYERS;
    readonly maxNumberOfSpectators: number = MafiaRoomStateEnum.MAX_NUMBER_OF_SPECTATORS;

    public gameState: MafiaGameState;
    private players: ArraySchema<Player>;
    private spectators: ArraySchema<Spectator>;
    private numberOfPlayers: number;
    private numberOfSpectators: number;
    private clientJointType: MapSchema<string>; // key: sessionId -> value: jointType

    constructor() {
        super();
        this.refreshMafiaRoomState();
    }

    join(client: Client, clientOptions: any): void {
        if (this.isFull(clientOptions.jointType)) {
            throw new RoomIsFullError(MafiaRoomErrorsEnum.ROOM_IS_FULL);
        } else {
            switch (clientOptions.jointType) {
                case MafiaRoomStateEnum.PLAYER:
                    if (this.gameState.isGameStarted()) {
                        throw new GameAlreadyStarted(MafiaRoomErrorsEnum.GAME_ALREADY_STARTED);
                    } else {
                        this.players.push(new Player(client.sessionId, clientOptions.username));
                        this.numberOfPlayers++;
                    }
                    break;

                case MafiaRoomStateEnum.SPECTATOR:
                    this.spectators.push(new Spectator(client.sessionId, clientOptions.username));
                    this.numberOfSpectators++;
                    break;
            }

            this.gameState.fixGameLeader();
            this.clientJointType.set(client.sessionId, clientOptions.jointType);
        }
    }

    leave(client: Client): void {
        const clientJointType = this.clientJointType.get(client.sessionId);
        switch (clientJointType) {
            case MafiaRoomStateEnum.PLAYER:
                this.removeClient(this.players, client.sessionId);
                this.numberOfPlayers--;
                break;

            case MafiaRoomStateEnum.SPECTATOR:
                this.removeClient(this.spectators, client.sessionId);
                this.numberOfSpectators--;
                break;
        }

        this.gameState.fixGameLeader();
    }

    removeClient(clientsList: ArraySchema, sessionId: string): void {
        const IndexToRemove = clientsList.map(client => client.sessionId).indexOf(sessionId);
        this.clientJointType.delete(sessionId);
        clientsList.splice(IndexToRemove, 1);
    }


    isFull(clientType: string): boolean {
        if (clientType === MafiaRoomStateEnum.PLAYER) {
            return this.numberOfPlayers === this.maxNumberOfPlayers;
        } else if (clientType === MafiaRoomStateEnum.SPECTATOR) {
            return this.numberOfSpectators === this.maxNumberOfSpectators;
        } else {
            throw new InvalidClientType(MafiaRoomErrorsEnum.INVALID_CLIENT_TYPE);
        }
    }

    private refreshMafiaRoomState(): void {
        this.players = new ArraySchema<Player>();
        this.gameState = new MafiaGameState(this.players);
        this.spectators = new ArraySchema<Spectator>();
        this.clientJointType = new MapSchema<string>();
        this.numberOfPlayers = MafiaRoomStateEnum.INITIAL_NUMBER_OF_PLAYERS;
        this.numberOfSpectators = MafiaRoomStateEnum.INITIAL_NUMBER_OF_SPECTATORS;
    }
}

defineTypes(MafiaRoomState, {
    gameState: MafiaGameState,
    players: [Player],
    spectators: [Spectator],
    clientJointType: {map: 'string'},
    numberOfPlayers: 'int8',
    numberOfSpectators: 'int8',
    maxNumberOfPlayers: 'int8',
    maxNumberOfSpectators: 'int8',
});

export default MafiaRoomState;