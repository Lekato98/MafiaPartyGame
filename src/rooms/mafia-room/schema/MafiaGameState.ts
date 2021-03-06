import {ArraySchema, Schema, type} from "@colyseus/schema";
import {Client} from "colyseus";
import AbstractPhase from "./phases/AbstractPhase";
import NightPhase from "./phases/NightPhase";
import MafiaRoleUtils, {MafiaRole} from "../utils/MafiaRoleUtils";
import MafiaPlayer from "./clients/MafiaPlayer";
import {MafiaRoomMessageType} from "../MafiaRoom";
import {RoomError, RoomErrorMessages} from "../errors/MafiaRoomErrors";
import {MafiaRoomStateEnum} from "./MafiaRoomState";
import MafiaSupportUtils from "../utils/MafiaSupportUtils";
import {MafiaPhaseName} from "../utils/MafiaPhaseUtils";
import PhasesFactory from "./phases/PhaseFactory";

class MafiaGameState extends Schema {
    @type(AbstractPhase) public phase: AbstractPhase;
    @type('string') public gameLeader: string;
    @type('boolean') public gameStarted: boolean;
    public rolesCollection: ArraySchema<MafiaRole>;
    public phaseTimeout:  NodeJS.Timeout;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.refreshMafiaGameState();
    }

    public startGame(client: Client): void {
        if (this.isGameStarted()) {
            client.send(MafiaRoomMessageType.ERROR, RoomErrorMessages.GAME_ALREADY_STARTED);
        } else if (!this.isGameLeader(client)) {
            client.send(MafiaRoomMessageType.ERROR, RoomErrorMessages.NOT_GAME_LEADER);
        } else {
            this.buildGameRoles();
            this.setGameStarted(true);
            this.phasesLifeCycle();
        }
    }

    public phasesLifeCycle(): void {
        const phaseTime: number = this.phase.getPhaseTime() * MafiaRoomStateEnum.MILLISECOND;
        this.phaseTimeout = setTimeout(() => {
            this.phase.goToNextPhase();
            this.phasesLifeCycle();
        }, phaseTime);
    }

    public setCurrentPhaseByName(newPhaseName: MafiaPhaseName): void {
        this.phase = PhasesFactory.createPhase(newPhaseName, this);
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

    public getPlayerBySessionId(sessionId: string): MafiaPlayer {
        const playerIndex: number = this.players.map(player => player.getSessionId()).indexOf(sessionId);
        if (playerIndex === -1) {
            throw new RoomError(RoomErrorMessages.UNKNOWN_PLAYER);
        } else {
            return this.players[playerIndex];
        }
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
        this.phase = new NightPhase(this);
        this.gameStarted = false;
        this.gameLeader = MafiaRoomStateEnum.DEFAULT_GAME_LEADER;
    }
}

export default MafiaGameState;