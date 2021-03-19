import { ArraySchema, MapSchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction, MafiaPhasesActionLimit } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaRoleUtils, { MafiaRole } from '../../utils/MafiaRoleUtils';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { IVoteActionPayload } from '../payloads/actionsPayload';

class VoteActions extends AbstractActions {
    private kickVoteActionLimit: MapSchema<number>;
    private kickVotes: ArraySchema<string>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.kickVoteActionLimit = new MapSchema<number>();
        this.kickVotes = new ArraySchema<string>();

        this.players.forEach((player: MafiaPlayer) => player.getRole() !== MafiaRole.DEAD
            && this.kickVoteActionLimit.set(player.getSessionId(), 0),
        );
    }

    public doAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.KICK_VOTE:
                this.voteAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_DEAD:
                this.messageToDead(player, payload);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public voteAction(player: MafiaPlayer, payload: IVoteActionPayload): void {
        if (!MafiaRoleUtils.isAlivePlayer(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        } else if (!this.isPlayerExist(payload.playerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.hasReachKickVoteLimits(player.getSessionId())) {
            throw new InvalidPhaseAction(RoomErrorMessage.HAS_REACH_ACTION_LIMITS);
        } else {
            const kickVoteLimit = this.kickVoteActionLimit.get(player.getSessionId());
            this.kickVoteActionLimit.set(player.getSessionId(), kickVoteLimit + 1);
            this.kickVotes.push(payload.playerId);
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
