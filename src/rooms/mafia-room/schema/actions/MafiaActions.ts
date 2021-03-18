import {ArraySchema, MapSchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction, MafiaPhasesActionLimit} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";
import {InvalidPhaseAction, RoomErrorMessage} from "../../errors/MafiaRoomErrors";
import {MafiaRole} from "../../utils/MafiaRoleUtils";

class MafiaActions extends AbstractActions {
    private killVoteActionLimit: MapSchema<MafiaPhasesActionLimit>;
    private killVotes: MapSchema<number>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.killVotes = new MapSchema<number>();
        this.killVoteActionLimit = new MapSchema<MafiaPhasesActionLimit>();
        this.players
            .forEach((mafiaRolePlayer: MafiaPlayer) =>
                mafiaRolePlayer.getRole() === MafiaRole.MAFIA
                && this.killVoteActionLimit.set(mafiaRolePlayer.getSessionId(), 0) // 0 initial value
            );
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.MAFIA_KILL_VOTE:
                this.killVoteAction(client, payload.voteKillPlayerId);
                break;

            case MafiaPhaseAction.MESSAGE_TO_MAFIA:
                this.messageToMafia(client, payload.message);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public messageToMafia(client: Client, message: string): void {
        if (this.isMafia(client.sessionId)) {
            this.players.forEach(player =>
                player.getRole() === MafiaRole.MAFIA
                && player.send(MafiaPhaseAction.MESSAGE_TO_MAFIA, message)
            );
        } else {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        }

    }

    public killVoteAction(client: Client, voteKillPlayerId: string): void {
        if (!this.isPlayerExist(voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.hasReachKillVoteLimits(client.sessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.HAS_REACH_ACTION_LIMITS)
        } else if (this.isKillHimself(client.sessionId, voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.MAFIA_KILL_HIMSELF);
        } else if(this.isMafia(voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.MAFIA_KILL_MAFIA);
        } else {
            const preValue: number = this.killVotes.get(voteKillPlayerId) || 0;
            this.killVotes.set(voteKillPlayerId, preValue + 1)
            const prevKillVoteActionLimit = this.killVoteActionLimit.get(client.sessionId);
            this.killVoteActionLimit.set(client.sessionId, prevKillVoteActionLimit + 1);
        }
    }

    public isKillHimself(sessionId: string, voteKillPlayerId: string) {
        return sessionId === voteKillPlayerId;
    }

    public hasReachKillVoteLimits(sessionId: string): boolean {
        return this.killVoteActionLimit.get(sessionId) === MafiaPhasesActionLimit.MAFIA_KILL_VOTE;
    }

    public isPlayerExist(sessionId: string): boolean {
        return this.players.map(player => player.getSessionId()).includes(sessionId);
    }

    public isMafia(sessionId: string): boolean {
        return this.players.filter(player => player.getSessionId() === sessionId)[0].getRole() === MafiaRole.MAFIA;
    }

    public getResult(): Array<any> | ArraySchema<any> {
        const result = new ArraySchema();
        if(this.killVotes.size) {
            const voteKillResult = this.getVoteKillResult();
            result.push(voteKillResult);
        }
        return result;
    }

    public getVoteKillResult() {
        if(this.killVotes.size) {
            const playersId = [...this.killVotes.keys()];
            let maxOccurrence = 0, playerId = '';
            playersId.forEach(id => {
                const occurrence = this.killVotes.get(id);
                if(occurrence > maxOccurrence) {
                    maxOccurrence = occurrence;
                    playerId = id;
                }
            });

            return {
                action: MafiaPhaseAction.MAFIA_KILL_VOTE,
                playerId
            }

        } else {
            return {};
        }
    }
}

export default MafiaActions;
