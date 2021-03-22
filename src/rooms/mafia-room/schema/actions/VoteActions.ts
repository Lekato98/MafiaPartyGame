import { ArraySchema, MapSchema, type } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction, MafiaPhasesActionLimit } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaRoleUtils from '../../utils/MafiaRoleUtils';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { IVoteActionPayload } from '../payloads/actionsPayload';
import { AbstractActionResult, VoteKickActionResult } from '../results/actionResults';
import ColyseusUtils from '../../../../colyseus/utils/ColyseusUtils';

class VoteActions extends AbstractActions {
    public kickVoteActionLimit: MapSchema<number>;
    @type({map: 'uint8'}) public kickVotes: MapSchema<number>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.kickVoteActionLimit = new MapSchema<number>();
        this.kickVotes = new MapSchema<number>();

        this.players.forEach((player: MafiaPlayer) =>
            MafiaRoleUtils.isAlivePlayer(player.getRole())
            && this.kickVoteActionLimit.set(player.getId(), 0)
            && this.kickVotes.set(player.getId(), 0)
        );
    }

    public onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
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
        } else if (this.hasReachKickVoteLimits(player.getId())) {
            throw new InvalidPhaseAction(RoomErrorMessage.HAS_REACH_ACTION_LIMITS);
        } else {
            const kickVoteLimit = this.kickVoteActionLimit.get(player.getId());
            this.kickVoteActionLimit.set(player.getId(), kickVoteLimit + 1);
            const prevVote = this.kickVotes.get(payload.playerId);
            this.kickVotes.set(payload.playerId, prevVote + 1);
        }
    }

    public hasReachKickVoteLimits(sessionId: string): boolean {
        return this.kickVoteActionLimit.get(sessionId) === MafiaPhasesActionLimit.KICK_VOTE;
    }

    public getVoteResult(): AbstractActionResult {
        const voteResult = new VoteKickActionResult();
        const maxOccurrence = ColyseusUtils.getMaxOccurrenceInMapSchema(this.kickVotes);
        if(maxOccurrence.maxFreq === 1) {
            voteResult.playerId = maxOccurrence.key;
        }

        return voteResult;
    }

    public getResult(): ArraySchema<AbstractActionResult> {
        const result = new ArraySchema<AbstractActionResult>();
        const voteResult = this.getVoteResult();

        if(voteResult.playerId !== '') {
            result.push(this.getVoteResult());
        }

        return result;
    }
}

export default VoteActions;
