import {ArraySchema, MapSchema} from "@colyseus/schema";
import AbstractActions from "./AbstractActions";
import {MafiaPhaseAction, MafiaPhasesActionLimit} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import MafiaPlayer from "../clients/MafiaPlayer";
import {MafiaRole} from "../../utils/MafiaRoleUtils";
import {InvalidPhaseAction, RoomErrorMessages} from "../../errors/MafiaRoomErrors";

class VoteActions extends AbstractActions {
    private kickVoteActionLimit: MapSchema<MafiaPhasesActionLimit>;
    private kickVotes: ArraySchema<string>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.kickVoteActionLimit = new MapSchema<MafiaPhasesActionLimit>();
        this.kickVotes = new ArraySchema<string>();

        this.players.forEach((player: MafiaPlayer) => player.getRole() !== MafiaRole.DEAD
            && this.kickVoteActionLimit.set(player.getSessionId(), 0)
        );
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.KICK_VOTE:
                this.voteAction(client, payload.playerId);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessages.INVALID_PHASE_ACTION);
        }
    }

    public voteAction(client: Client, playerId: string): void {
        if(!this.isPlayerExist(playerId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.ACTION_ON_UNKNOWN_PLAYER);
        }else if (this.hasReachKickVoteLimits(client.sessionId)) {
            throw new InvalidPhaseAction(RoomErrorMessages.HAS_REACH_ACTION_LIMITS)
        } else {
            const kickVoteLimit = this.kickVoteActionLimit.get(client.sessionId);
            this.kickVoteActionLimit.set(client.sessionId, kickVoteLimit + 1);
            this.kickVotes.push(playerId);
        }
    }

    public hasReachKickVoteLimits(sessionId: string): boolean {
        return this.kickVoteActionLimit.get(sessionId) === MafiaPhasesActionLimit.KICK_VOTE;
    }

    public isPlayerExist(sessionId: string) {
        return this.players.filter(player => player.getSessionId() === sessionId).length;
    }
}

export default VoteActions;