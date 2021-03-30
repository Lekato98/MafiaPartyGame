import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
import { Client } from 'colyseus';
import { MafiaPlayer } from './clients/MafiaPlayer';
import { MafiaSpectator } from './clients/MafiaSpectator';
import MafiaGameState from './MafiaGameState';
import {
    InvalidClientType,
    RoomError,
    RoomErrorMessage,
} from '../errors/MafiaRoomErrors';
import { ClientJointType, IClientOptions } from '../MafiaRoom';

export enum MafiaRoomStateEnum {
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

    private clientJointType: MapSchema<string>; // sessionId/clientId -> jointType,  @type({map: 'string'})

    constructor() {
        super();
        this.refreshMafiaRoomState();
    }

    public join(client: Client, clientOptions: IClientOptions): void {
        if (this.isFull(clientOptions.jointType)) {
            throw new RoomError(RoomErrorMessage.ROOM_IS_FULL);
        } else {
            switch (clientOptions.jointType) {
                case ClientJointType.PLAYER:
                    if (this.gameState.isGameStarted()) {
                        throw new RoomError(RoomErrorMessage.GAME_ALREADY_STARTED);
                    } else {
                        this.players.push(new MafiaPlayer(client, clientOptions.username));
                        this.numberOfPlayers++;
                        this.gameState.fixGameLeader();
                    }
                    break;

                case ClientJointType.SPECTATOR:
                    this.spectators.push(new MafiaSpectator(client, clientOptions.username));
                    this.numberOfSpectators++;
                    break;
            }

            this.clientJointType.set(client.sessionId, clientOptions.jointType);
        }
    }

    public leave(client: Client): void {
        const clientJointType = this.clientJointType.get(client.sessionId);

        if (clientJointType === ClientJointType.PLAYER) {
            this.removeClient(this.players, client.sessionId);
            this.numberOfPlayers--;
        } else if (clientJointType === ClientJointType.SPECTATOR) {
            this.removeClient(this.spectators, client.sessionId);
            this.numberOfSpectators--;
        } else {
            throw new InvalidClientType(RoomErrorMessage.INVALID_CLIENT_TYPE);
        }

        this.gameState.fixGameLeader();
    }

    public removeClient(clientsList: ArraySchema, playerId: string): void {
        const indexToRemove = clientsList.findIndex(client => client.getId() === playerId);

        if (indexToRemove !== -1) {
            this.clientJointType.delete(playerId);
            clientsList.splice(indexToRemove, 1);
        } else {
            throw new RoomError(RoomErrorMessage.UNKNOWN_PLAYER);
        }

    }

    public isFull(clientType: string): boolean {
        if (clientType === ClientJointType.PLAYER) {
            return this.numberOfPlayers === this.maxNumberOfPlayers;
        } else if (clientType === ClientJointType.SPECTATOR) {
            return this.numberOfSpectators === this.maxNumberOfSpectators;
        } else {
            throw new InvalidClientType(RoomErrorMessage.INVALID_CLIENT_TYPE);
        }
    }

    refreshMafiaRoomState(): void {
        this.players = new ArraySchema<MafiaPlayer>();
        this.gameState = new MafiaGameState(this.players);
        this.spectators = new ArraySchema<MafiaSpectator>();
        this.clientJointType = new MapSchema<string>();
        this.numberOfPlayers = MafiaRoomStateEnum.INITIAL_NUMBER_OF_PLAYERS;
        this.numberOfSpectators = MafiaRoomStateEnum.INITIAL_NUMBER_OF_SPECTATORS;
    }
}

export default MafiaRoomState;
