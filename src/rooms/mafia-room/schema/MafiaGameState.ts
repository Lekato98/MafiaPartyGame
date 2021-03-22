import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Client } from 'colyseus';
import AbstractPhase from './phases/AbstractPhase';
import MafiaRoleUtils, { MafiaRole } from '../utils/MafiaRoleUtils';
import MafiaPlayer from './clients/MafiaPlayer';
import { IActionName, MafiaRoomMessageType } from '../MafiaRoom';
import { RoomError, RoomErrorMessage } from '../errors/MafiaRoomErrors';
import { MafiaRoomStateEnum } from './MafiaRoomState';
import { MafiaPhaseName } from '../utils/MafiaPhaseUtils';
import PhasesFactory from './phases/PhaseFactory';
import { AbstractActionResult } from './results/actionResults';
import ColyseusUtils from '../../../colyseus/utils/ColyseusUtils';
import DayPhase from './phases/DayPhase';

class MafiaGameState extends Schema {
    @type(AbstractPhase) public phase: AbstractPhase;
    @type('string') public gameLeader: string;
    @type('boolean') public gameStarted: boolean;
    @type('boolean') public gameOver: boolean;
    @type([AbstractActionResult]) public phaseActionsResult: ArraySchema<AbstractActionResult>;

    public rolesCollection: ArraySchema<MafiaRole>;
    public phaseTimeout: NodeJS.Timeout;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.refreshMafiaGameState();
    }

    public startGame(client: Client): void {
        if (this.isGameStarted()) {
            client.send(MafiaRoomMessageType.ERROR, RoomErrorMessage.GAME_ALREADY_STARTED);
        } else if (!this.isGameLeader(client)) {
            client.send(MafiaRoomMessageType.ERROR, RoomErrorMessage.NOT_GAME_LEADER);
        } else {
            this.buildGameRoles();
            this.setGameStarted(true);
            this.startPhase();
        }
    }

    public startPhase(): void {
        this.phase.onBegin();
        this.phaseLifeCycle();
    }

    public phaseLifeCycle(): void {
        const phaseTime: number = this.phase.getPhaseTime() * MafiaRoomStateEnum.MILLISECOND;
        this.phaseTimeout = setTimeout(() => this.nextPhase(), phaseTime);
    }

    public nextPhase(): void {
        this.endPhase();
        if (this.isEndGame()) {
            this.endGame();
        } else {
            this.phase.moveToNextPhase();
            this.startPhase();
        }
    }

    public stopPhaseLifeCycle(): void {
        clearTimeout(this.phaseTimeout);
    }

    public endPhase(): void {
        this.stopPhaseLifeCycle();
        this.phase.onEnd();
    }

    public fixGameLeader(): void {
        if (this.players.length) {
            this.setGameLeader(this.players[0].getId());
        } else {
            this.setGameLeader(MafiaRoomStateEnum.DEFAULT_GAME_LEADER);
        }
    }

    public buildGameRoles(): void {
        const numberOfPlayers: number = this.players.length;
        const gameRolesCollection: ArraySchema<MafiaRole> = ColyseusUtils.convertArrayToArraySchema(
            MafiaRoleUtils.createShuffledGameRolesCollection(numberOfPlayers),
        );
        this.setRolesCollection(gameRolesCollection);
        this.setPlayersRole(this.rolesCollection);
    }

    public endGame(): void {
        this.stopPhaseLifeCycle();
        this.gameOver = true;
    }

    public onAction(client: Client, payload: IActionName): void {
        this.phase.onAction(client, payload.actionName, payload);
    }

    public replaceOneRoleInRolesCollection(roleToReplace: MafiaRole, newRole: MafiaRole): void {
        const indexOfRole = this.rolesCollection.indexOf(roleToReplace);
        if(indexOfRole !== -1) {
            this.rolesCollection.setAt(indexOfRole, newRole);
        } else {
            throw new RoomError(RoomErrorMessage.INVALID_REPLACE_UNAVAILABLE_ROLE);
        }
    }

    public isEndGame(): boolean {
        const numberOfMafia = this.players.filter(player => MafiaRoleUtils.isMafia(player.getRole())).length;
        const numberOfVillagers = this.players.filter(player => MafiaRoleUtils.isVillager(player.getRole())).length;
        return numberOfMafia >= numberOfVillagers;
    }

    public isGameStarted(): boolean {
        return this.gameStarted;
    }

    public isGameLeader(client: Client): boolean {
        return client.sessionId === this.gameLeader;
    }

    public setCurrentPhaseByName(newPhaseName: MafiaPhaseName): void {
        this.phase = PhasesFactory.createPhase(newPhaseName, this);
    }

    public setRolesCollection(rolesCollection: ArraySchema<MafiaRole>): void {
        this.rolesCollection = rolesCollection;
    }

    public setPlayersRole(rolesCollection: ArraySchema<MafiaRole>): void {
        rolesCollection.forEach((role, index) => this.players[index].setRole(role));
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

    public getPlayerById(playerId: string): MafiaPlayer {
        const player: MafiaPlayer = this.players.find(
            player => player.getId() === playerId,
        );

        if (player) {
            return player;
        } else {
            throw new RoomError(RoomErrorMessage.UNKNOWN_PLAYER);
        }
    }

    public refreshMafiaGameState(): void {
        this.gameStarted = false;
        this.gameOver = false;
        this.rolesCollection = new ArraySchema<MafiaRole>();
        this.gameLeader = MafiaRoomStateEnum.DEFAULT_GAME_LEADER;
        this.phase = new DayPhase(this);
        this.phaseActionsResult = new ArraySchema<AbstractActionResult>();
    }
}

export default MafiaGameState;
