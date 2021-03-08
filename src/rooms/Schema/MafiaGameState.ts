import {ArraySchema, Schema, type} from "@colyseus/schema";
import {Client} from "colyseus";
import AbstractPhase from "./MafiaPhases/AbstractPhase";
import NightPhase from "./MafiaPhases/NightPhase";
import MafiaRoleUtils, {MafiaRole} from "../MafiaUtils/MafiaRoleUtils";
import Player from "./Player";
import {MafiaRoomEnum} from "../MafiaRoom";
import {RoomError} from "../Errors/MafiaRoomErrors";
import {MafiaRoomStateEnum} from "./MafiaRoomState";
import MafiaSupportUtils from "../MafiaUtils/MafiaSupportUtils";
import {MafiaPhaseName} from "../MafiaUtils/MafiaPhaseUtils";
import PhasesFactory from "./MafiaPhases/PhaseFactory";

class MafiaGameState extends Schema {
    // NIGHT -> MAFIA -> DET -> DOC -> DAY -> DISC -> VOTE -> NIGHT
    @type(AbstractPhase) private currentPhase: AbstractPhase;
    @type(['string']) private rolesCollection: ArraySchema<MafiaRole>;
    @type('string') private gameLeader: string;
    @type('boolean') private gameStarted: boolean;
    private players: ArraySchema<Player>;

    constructor(players: ArraySchema<Player>) {
        super();
        this.players = players;
        this.refreshMafiaGameState();
    }

    public startGame(client: Client): void {
        if (this.isGameStarted()) {
            client.send(MafiaRoomEnum.ERROR, RoomError.GAME_ALREADY_STARTED);
        } else if (!this.isGameLeader(client)) {
            client.send(MafiaRoomEnum.ERROR, RoomError.NOT_GAME_LEADER);
        } else {
            this.buildGameRoles();
            this.setGameStarted(true);
            this.gameLifeCycle();
        }
    }

    public gameLifeCycle(): void | Promise<any> {
        const phaseTime: number = this.currentPhase.getPhaseTime() * MafiaRoomStateEnum.MILLISECOND;

        setTimeout(() => {
            this.currentPhase.goToNextPhase();
            this.gameLifeCycle();
        }, phaseTime);
    }

    public setCurrentPhaseByName(newPhaseName: MafiaPhaseName): void {
        this.currentPhase = PhasesFactory.createPhase(newPhaseName, this);
    }

    public setRolesCollection(rolesCollection: ArraySchema<MafiaRole>): void {
        this.rolesCollection = rolesCollection;
    }

    public setPlayersRole(rolesCollection: ArraySchema<MafiaRole>): void {
        rolesCollection.map((role, index) => this.players[index].setRole(role));
    }

    public setGameLeader(gameLeader: string): void {
        this.gameLeader = gameLeader;
    }

    public setGameStarted(gameStarted: boolean): void {
        this.gameStarted = gameStarted;
    }

    public getRolesCollection(): ArraySchema<MafiaRole> {
        return this.rolesCollection;
    }

    public isGameStarted(): boolean {
        return this.gameStarted;
    }

    public isGameLeader(client: Client): boolean {
        return client.sessionId === this.gameLeader;
    }

    public fixGameLeader(): void {
        if (this.players.length) {
            this.setGameLeader(this.players[0].getSessionId());
        } else {
            this.setGameLeader('');
        }
    }

    public buildGameRoles(): void {
        const numberOfPlayers: number = this.players.length;
        const gameRolesCollection: ArraySchema<MafiaRole> = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaRoleUtils.createShuffledGameRolesCollection(numberOfPlayers)
        );
        this.setRolesCollection(gameRolesCollection);
        this.setPlayersRole(this.rolesCollection);
    }

    public refreshMafiaGameState(): void {
        this.currentPhase = new NightPhase(this);
        this.gameStarted = false;
        this.gameLeader = MafiaRoomStateEnum.DEFAULT_GAME_LEADER;
    }
}

export default MafiaGameState;