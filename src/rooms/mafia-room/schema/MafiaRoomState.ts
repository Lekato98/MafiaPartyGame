import {ArraySchema, MapSchema, Schema, type} from "@colyseus/schema";
import {Client} from "colyseus";
import {MafiaPlayer} from "./clients/MafiaPlayer";
import {MafiaSpectator} from "./clients/MafiaSpectator";
import MafiaGameState from "./MafiaGameState";
import {GameAlreadyStarted, InvalidClientType, RoomError, RoomIsFull} from "../errors/MafiaRoomErrors";

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
    @type('uint8') readonly maxNumberOfPlayers: number = MafiaRoomStateEnum.MAX_NUMBER_OF_PLAYERS;
    @type('uint8') readonly maxNumberOfSpectators: number = MafiaRoomStateEnum.MAX_NUMBER_OF_SPECTATORS;

    @type(MafiaGameState) public gameState: MafiaGameState;
    @type([MafiaPlayer]) private players: ArraySchema<MafiaPlayer>;
    @type([MafiaSpectator]) private spectators: ArraySchema<MafiaSpectator>;
    @type('uint8') private numberOfPlayers: number;
    @type('uint8') private numberOfSpectators: number;
    @type({map: 'string'}) private clientJointType: MapSchema<string>; // sessionId -> jointType

    constructor() {
        super();
        this.refreshMafiaRoomState();
    }

    public join(client: Client, clientOptions: any): void {
        if (this.isFull(clientOptions.jointType)) {
            throw new RoomIsFull(RoomError.ROOM_IS_FULL);
        } else {
            switch (clientOptions.jointType) {
                case MafiaRoomStateEnum.PLAYER:
                    if (this.gameState.isGameStarted()) {
                        throw new GameAlreadyStarted(RoomError.GAME_ALREADY_STARTED);
                    } else {
                        this.players.push(new MafiaPlayer(client.sessionId, clientOptions.username));
                        this.numberOfPlayers++;
                        this.gameState.fixGameLeader();
                    }
                    break;

                case MafiaRoomStateEnum.SPECTATOR:
                    this.spectators.push(new MafiaSpectator(client.sessionId, clientOptions.username));
                    this.numberOfSpectators++;
                    break;
            }

            this.clientJointType.set(client.sessionId, clientOptions.jointType);
        }
    }

    public leave(client: Client): void {
        const clientJointType = this.clientJointType.get(client.sessionId);

        if (clientJointType === MafiaRoomStateEnum.PLAYER) {
            this.removeClient(this.players, client.sessionId);
            this.numberOfPlayers--;
        } else if (clientJointType === MafiaRoomStateEnum.SPECTATOR) {
            this.removeClient(this.spectators, client.sessionId);
            this.numberOfSpectators--;
        } else {
            throw new InvalidClientType(RoomError.INVALID_CLIENT_TYPE);
        }

        this.gameState.fixGameLeader();
    }

    public removeClient(clientsList: ArraySchema, sessionId: string): void {
        const IndexToRemove = clientsList.map(client => client.sessionId).indexOf(sessionId);
        this.clientJointType.delete(sessionId);
        clientsList.splice(IndexToRemove, 1);
    }


    public isFull(clientType: string): boolean {
        if (clientType === MafiaRoomStateEnum.PLAYER) {
            return this.numberOfPlayers === this.maxNumberOfPlayers;
        } else if (clientType === MafiaRoomStateEnum.SPECTATOR) {
            return this.numberOfSpectators === this.maxNumberOfSpectators;
        } else {
            throw new InvalidClientType(RoomError.INVALID_CLIENT_TYPE);
        }
    }

    public refreshMafiaRoomState(): void {
        this.players = new ArraySchema<MafiaPlayer>();
        this.gameState = new MafiaGameState(this.players);
        this.spectators = new ArraySchema<MafiaSpectator>();
        this.clientJointType = new MapSchema<string>();
        this.numberOfPlayers = MafiaRoomStateEnum.INITIAL_NUMBER_OF_PLAYERS;
        this.numberOfSpectators = MafiaRoomStateEnum.INITIAL_NUMBER_OF_SPECTATORS;
    }
}

export default MafiaRoomState;