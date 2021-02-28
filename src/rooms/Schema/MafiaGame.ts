import {ArraySchema, defineTypes, MapSchema, Schema} from "@colyseus/schema";
import {Client} from "colyseus";
import {Player} from "./Player";
import {Spectator} from "./Spectator";
import MafiaGameHandler from "./MafiaGameHandler";

export enum GameStateEnum {
    PLAYER = 'PLAYER',
    SPECTATOR = 'SPECTATOR',
    MAX_NUMBER_OF_PLAYERS = 16,
    MAX_NUMBER_OF_SPECTATORS = 14,
}

class MafiaGame extends Schema {
    readonly maxNumberOfPlayers: number = GameStateEnum.MAX_NUMBER_OF_PLAYERS;
    readonly maxNumberOfSpectators: number = GameStateEnum.MAX_NUMBER_OF_SPECTATORS;

    private players: ArraySchema<Player>;
    private spectators: ArraySchema<Spectator>;
    private clientJointType: MapSchema<string>;
    private numberOfPlayers: number;
    private numberOfSpectators: number;
    private gameHandler: MafiaGameHandler;

    constructor() {
        super();
        this.refreshGameState();
    }

    public join(client: Client, clientOptions: any): void {
        if (this.isFull(clientOptions.jointType)) {
            throw new RoomIsFullError(MafiaRoomErrorsEnum.ROOM_IS_FULL);
        } else {
            switch (clientOptions.jointType) {
                case GameStateEnum.PLAYER:
                    this.players.push(new Player(client.sessionId, clientOptions.username));
                    this.numberOfPlayers++;
                    break;

                case GameStateEnum.SPECTATOR:
                    this.spectators.push(new Spectator(client.sessionId, clientOptions.username));
                    this.numberOfSpectators++;
                    break;
            }

            this.clientJointType.set(client.sessionId, clientOptions.jointType);
        }
    }

    public leave(client: Client) {
        const clientJointType = this.clientJointType.get(client.sessionId);
        switch (clientJointType) {
            case GameStateEnum.PLAYER:
                this.removeClient(this.players, client.sessionId);
                this.numberOfPlayers--;
                break;

            case GameStateEnum.SPECTATOR:
                this.removeClient(this.spectators, client.sessionId);
                this.numberOfSpectators--;
                break;
        }
    }

    public removeClient(clientsList: ArraySchema, sessionId: string): void {
        const IndexToRemove = clientsList.map(client => client.sessionId).indexOf(sessionId);
        this.clientJointType.delete(sessionId);
        clientsList.splice(IndexToRemove, 1);
    }

    public isFull(clientType: string) {
        if (clientType === GameStateEnum.PLAYER) {
            return this.numberOfPlayers === this.maxNumberOfPlayers;
        } else if (clientType === GameStateEnum.SPECTATOR) {
            return this.numberOfSpectators === this.maxNumberOfSpectators;
        } else {
            throw new InvalidClientType(MafiaRoomErrorsEnum.INVALID_CLIENT_TYPE);
        }
    }

    public refreshGameState() {
        this.gameHandler = new MafiaGameHandler();
        this.players = new ArraySchema<Player>();
        this.spectators = new ArraySchema<Spectator>();
        this.clientJointType = new MapSchema<string>();
        this.numberOfPlayers = 0;
        this.numberOfSpectators = 0;
    }
}

defineTypes(MafiaGame, {
    gameStateHandler: MafiaGameHandler,
    players: [Player],
    spectators: [Spectator],
    clientJointType: {map: 'string'},
    numberOfPlayers: 'int8',
    numberOfSpectators: 'int8',
    maxNumberOfPlayers: 'int8',
    maxNumberOfSpectators: 'int8',
});

export default MafiaGame;