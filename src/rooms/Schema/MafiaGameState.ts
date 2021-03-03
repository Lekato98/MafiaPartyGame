import {ArraySchema, defineTypes, Schema} from "@colyseus/schema";
import AbstractPhases from "./States/AbstractPhases";
import NightPhase from "./States/NightPhase";
import {Client} from "colyseus";
import MafiaGameUtils, {MafiaRolesEnum} from "../Utils/MafiaGameUtils";
import Player from "./Player";
import {MafiaRoomEnum} from "../MafiaRoom";
import {MafiaRoomErrorsEnum} from "../Errors/MafiaRoomErrors";
import {MafiaRoomStateEnum} from "./MafiaRoomState";

class MafiaGameState extends Schema {

    // NIGHT -> MAFIA -> DET -> DOC -> DAY -> DISC -> VOTE -> NIGHT
    private currentPhase: AbstractPhases;
    private rolesCollection: ArraySchema<MafiaRolesEnum>; // will be used to (reconnect, disconnect, bots)
    private players: ArraySchema<Player>;
    private gameLeader: string;
    private gameStarted: boolean;

    constructor(players: ArraySchema<Player>) {
        super();
        this.players = players;
        this.refreshMafiaGameState();
    }

    startGame(client: Client): void {
        if (this.isGameStarted()) {
            client.send(MafiaRoomEnum.ERROR, MafiaRoomErrorsEnum.GAME_ALREADY_STARTED);
        } else if (!this.isGameLeader(client)) {
            client.send(MafiaRoomEnum.ERROR, MafiaRoomErrorsEnum.NOT_GAME_LEADER);
        } else {
            const numberOfPlayers: number = this.players.length;
            const gameRolesCollection: ArraySchema<MafiaRolesEnum> =
                MafiaGameUtils.toArraySchema(MafiaGameUtils.createGameRolesCollection(numberOfPlayers, true));
            this.setPlayersRole(gameRolesCollection);
            this.setRolesCollection(gameRolesCollection);
            this.setGameStarted(true);
            this.startGameLifeCycle();
        }
    }

    startGameLifeCycle(): void | Promise<any> {
        const phaseTime = this.currentPhase.getPhaseTime() * MafiaRoomStateEnum.MILLISECOND;
        setTimeout(() => {
            this.currentPhase.goToNextState();
            this.startGameLifeCycle();
        }, phaseTime);
    }

    action(): void {
        this.currentPhase.goToNextState();
    }

    setCurrentState(newState: AbstractPhases) {
        this.currentPhase = newState;
    }

    setRolesCollection(rolesCollection: ArraySchema<MafiaRolesEnum>): void {
        this.rolesCollection = rolesCollection;
    }

    setPlayersRole(rolesCollection: ArraySchema<MafiaRolesEnum>) {
        rolesCollection.map((role, index) => this.players[index].setRole(role));
    }

    setGameLeader(gameLeader: string): void {
        this.gameLeader = gameLeader;
    }

    setGameStarted(gameStarted: boolean) {
        this.gameStarted = gameStarted;
    }

    isGameStarted(): boolean {
        return this.gameStarted;
    }

    isGameLeader(client: Client): boolean {
        return client.sessionId === this.gameLeader;
    }

    fixGameLeader() {
        if (this.players.length) {
            this.setGameLeader(this.players[0].getSessionId());
        } else {
            this.setGameLeader('');
        }
    }

    refreshMafiaGameState(): void {
        this.currentPhase = new NightPhase(this);
        this.gameStarted = false;
        this.gameLeader = MafiaRoomStateEnum.DEFAULT_GAME_LEADER;
    }
}

defineTypes(MafiaGameState, {
    currentState: AbstractPhases,
    rolesCollection: ['string'],
    gameStarted: 'boolean',
    gameLeader: 'string',
});

export default MafiaGameState;