import {ArraySchema, defineTypes, MapSchema, Schema} from "@colyseus/schema";
import {Client} from "colyseus";
import {Player} from "./Player";
import {Spectator} from "./Spectator";
import MafiaGameHandler from "./MafiaGameHandler";
import {
    GameAlreadyStarted,
    InvalidClientType,
    MafiaRoomErrorsEnum,
    RoomIsFullError
} from "../Errors/MafiaRoomErrors";
import MafiaGameUtils from "../Utils/MafiaGameUtils";
import {MafiaRoomEnum} from "../MafiaRoom";

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
    public gameHandler: MafiaGameHandler;

    constructor() {
        super();
        this.refreshGameState();
    }

    public startGame(client: Client): void {
        try {
            if (this.gameHandler.isGameStarted()) {
                throw new GameAlreadyStarted(MafiaRoomErrorsEnum.GAME_ALREADY_STARTED);
            }

            const gameRolesCollection = MafiaGameUtils.createGameRolesCollection(this.numberOfPlayers, true);
            gameRolesCollection.map((role, index) => this.players[index].setRole(role));
            this.gameHandler.startGame();
        } catch (e) {
            client.send(MafiaRoomEnum.ERROR, e.message);
        }
    }

    public join(client: Client, clientOptions: any): void {
        if (this.isFull(clientOptions.jointType)) {
            throw new RoomIsFullError(MafiaRoomErrorsEnum.ROOM_IS_FULL);
        } else {
            switch (clientOptions.jointType) {
                case GameStateEnum.PLAYER:
                    if (this.gameHandler.isGameStarted()) {
                        throw new GameAlreadyStarted(MafiaRoomErrorsEnum.GAME_ALREADY_STARTED);
                    } else {
                        this.players.push(new Player(client.sessionId, clientOptions.username));
                        this.numberOfPlayers++;
                    }
                    break;

                case GameStateEnum.SPECTATOR:
                    this.spectators.push(new Spectator(client.sessionId, clientOptions.username));
                    this.numberOfSpectators++;
                    break;
            }

            this.clientJointType.set(client.sessionId, clientOptions.jointType);
        }
    }

    public leave(client: Client): void {
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

    private removeClient(clientsList: ArraySchema, sessionId: string): void {
        const IndexToRemove = clientsList.map(client => client.sessionId).indexOf(sessionId);
        this.clientJointType.delete(sessionId);
        clientsList.splice(IndexToRemove, 1);
    }

    public action(): void {
        this.gameHandler.action();
    }

    public isFull(clientType: string): boolean {
        if (clientType === GameStateEnum.PLAYER) {
            return this.numberOfPlayers === this.maxNumberOfPlayers;
        } else if (clientType === GameStateEnum.SPECTATOR) {
            return this.numberOfSpectators === this.maxNumberOfSpectators;
        } else {
            throw new InvalidClientType(MafiaRoomErrorsEnum.INVALID_CLIENT_TYPE);
        }
    }

    public refreshGameState(): void {
        this.gameHandler = new MafiaGameHandler();
        this.players = new ArraySchema<Player>();
        this.spectators = new ArraySchema<Spectator>();
        this.clientJointType = new MapSchema<string>();
        this.numberOfPlayers = 0;
        this.numberOfSpectators = 0;
    }
}

defineTypes(MafiaGame, {
    gameHandler: MafiaGameHandler,
    players: [Player],
    spectators: [Spectator],
    clientJointType: {map: 'string'},
    numberOfPlayers: 'int8',
    numberOfSpectators: 'int8',
    maxNumberOfPlayers: 'int8',
    maxNumberOfSpectators: 'int8',
});

export default MafiaGame;