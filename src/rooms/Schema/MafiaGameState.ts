import {ArraySchema, defineTypes, Schema} from "@colyseus/schema";
import AbstractPhase from "./MafiaPhases/AbstractPhase";
import NightPhase from "./MafiaPhases/NightPhase";
import {Client} from "colyseus";
import MafiaRolesUtils, {MafiaRolesEnum} from "../MafiaUtils/MafiaRolesUtils";
import Player from "./Player";
import {MafiaRoomEnum} from "../MafiaRoom";
import {MafiaRoomErrorsEnum} from "../Errors/MafiaRoomErrors";
import {MafiaRoomStateEnum} from "./MafiaRoomState";
import MafiaSupportUtils from "../MafiaUtils/MafiaSupportUtils";
import {MafiaPhasesNameEnum} from "../MafiaUtils/MafiaPhasesUtils";
import PhasesFactory from "./MafiaPhases/PhasesFactory";

class MafiaGameState extends Schema {

    // NIGHT -> MAFIA -> DET -> DOC -> DAY -> DISC -> VOTE -> NIGHT
    private currentPhase: AbstractPhase;
    private rolesCollection: ArraySchema<MafiaRolesEnum>;
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
            this.buildGameRoles();
            this.setGameStarted(true);
            this.gameLifeCycle();
        }
    }

    gameLifeCycle(): void | Promise<any> {
        const phaseTime: number = this.currentPhase.getPhaseTime() * MafiaRoomStateEnum.MILLISECOND;

        setTimeout(() => {
            this.currentPhase.goToNextPhase();
            this.gameLifeCycle();
        }, phaseTime);
    }

    setCurrentPhaseByName(newPhaseName: MafiaPhasesNameEnum): void {
        this.currentPhase = PhasesFactory.createPhase(newPhaseName, this);
    }

    setRolesCollection(rolesCollection: ArraySchema<MafiaRolesEnum>): void {
        this.rolesCollection = rolesCollection;
    }

    setPlayersRole(rolesCollection: ArraySchema<MafiaRolesEnum>): void {
        rolesCollection.map((role, index) => this.players[index].setRole(role));
    }

    setGameLeader(gameLeader: string): void {
        this.gameLeader = gameLeader;
    }

    setGameStarted(gameStarted: boolean): void {
        this.gameStarted = gameStarted;
    }

    getRolesCollection(): ArraySchema<MafiaRolesEnum> {
        return this.rolesCollection;
    }

    isGameStarted(): boolean {
        return this.gameStarted;
    }

    isGameLeader(client: Client): boolean {
        return client.sessionId === this.gameLeader;
    }

    fixGameLeader(): void {
        if (this.players.length) {
            this.setGameLeader(this.players[0].getSessionId());
        } else {
            this.setGameLeader('');
        }
    }

    buildGameRoles(): void {
        const numberOfPlayers: number = this.players.length;
        const gameRolesCollection: ArraySchema<MafiaRolesEnum> = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaRolesUtils.createShuffledGameRolesCollection(numberOfPlayers)
        );
        this.setRolesCollection(gameRolesCollection);
        this.setPlayersRole(this.rolesCollection);
    }

    refreshMafiaGameState(): void {
        this.currentPhase = new NightPhase(this);
        this.gameStarted = false;
        this.gameLeader = MafiaRoomStateEnum.DEFAULT_GAME_LEADER;
    }
}

defineTypes(MafiaGameState, {
    currentPhase: AbstractPhase,
    rolesCollection: ['string'],
    gameStarted: 'boolean',
    gameLeader: 'string',
});

export default MafiaGameState;