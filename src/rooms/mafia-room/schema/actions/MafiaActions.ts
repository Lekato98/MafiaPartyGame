import {ArraySchema, MapSchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction, MafiaPhasesActionLimit} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";
import {InvalidPhaseAction, RoomErrorMessages} from "../../errors/MafiaRoomErrors";
import {MafiaRole} from "../../utils/MafiaRoleUtils";

class MafiaActions extends AbstractActions {
    private killVoteActionLimit: MapSchema<MafiaPhasesActionLimit>;
    private killVotes: ArraySchema<string>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.killVotes = new ArraySchema<string>();
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

            default:
                throw new InvalidPhaseAction(RoomErrorMessages.INVALID_PHASE_ACTION);
        }
    }

    public messageToMafia(client: Client, message: string): void {
        if (this.isMafia(client.sessionId)) {
            this.players.forEach(player =>
                player.getRole() === MafiaRole.MAFIA
                && player.send(MafiaPhaseAction.MESSAGE_TO_MAFIA, message)
            );
        } else {
            throw new InvalidPhaseAction(RoomErrorMessages.INVALID_ROLE_ACTION_CALL);
        }

    }

    public killVoteAction(client: Client, voteKillPlayerId: string): void {
        if (!this.isPlayerExist(voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.hasReachKillVoteLimits(client.sessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.HAS_REACH_ACTION_LIMITS)
        } else if (this.isKillHimself(client.sessionId, voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.MAFIA_KILL_HIMSELF);
        } else {
            this.killVotes.push(voteKillPlayerId);
            const currentKillVoteActionLimit = this.killVoteActionLimit.get(client.sessionId);
            this.killVoteActionLimit.set(client.sessionId, currentKillVoteActionLimit + 1);
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
        return this.players.map(player => player.getSessionId()).includes(sessionId);
    }
}

export default MafiaActions;