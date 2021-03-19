import { ArraySchema, MapSchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction, MafiaPhasesActionLimit } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import MafiaRoleUtils, { MafiaRole } from '../../utils/MafiaRoleUtils';
import { AbstractActionResult, VoteKillActionResult } from '../results/actionResults';
import { IKillVotePayload, IMessageMafiaPayload } from '../payloads/actionsPayload';
import ColyseusUtils from '../../../../colyseus/utils/ColyseusUtils';

class MafiaActions extends AbstractActions {
    private killVoteActionLimit: MapSchema<number>;
    private killVotes: MapSchema<number>;

    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
        this.killVotes = new MapSchema<number>();
        this.killVoteActionLimit = new MapSchema<number>();
        this.players.forEach((mafiaRolePlayer: MafiaPlayer) =>
            mafiaRolePlayer.getRole() === MafiaRole.MAFIA
            && this.killVoteActionLimit.set(mafiaRolePlayer.getSessionId(), 0), // 0 initial value
        );
    }

    public doAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.MAFIA_KILL_VOTE:
                this.killVoteAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_MAFIA:
                this.messageToMafia(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_DEAD:
                this.messageToDead(player, payload);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public messageToMafia(player: MafiaPlayer, payload: IMessageMafiaPayload): void {
        if (MafiaRoleUtils.isMafia(player.getRole())) {
            this.players.forEach(player =>
                player.getRole() === MafiaRole.MAFIA
                && player.send(MafiaPhaseAction.MESSAGE_TO_MAFIA, payload.message),
            );
        } else {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        }

    }

    public killVoteAction(player: MafiaPlayer, payload: IKillVotePayload): void {
        if (!MafiaRoleUtils.isMafia(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        } else if (this.hasReachKillVoteLimit(player.getSessionId())) {
            throw new InvalidPhaseAction(RoomErrorMessage.HAS_REACH_ACTION_LIMITS);
        } else if (!this.isPlayerExist(payload.voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.ACTION_ON_UNKNOWN_PLAYER);
        } else if (this.isKillMafia(payload.voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.MAFIA_KILL_MAFIA);
        } else if (this.isKillHimself(player.getSessionId(), payload.voteKillPlayerId)) {
            throw new InvalidPhaseAction(RoomErrorMessage.MAFIA_KILL_HIMSELF);
        } else {
            const preValue: number = this.killVotes.get(payload.voteKillPlayerId) || 0;
            this.killVotes.set(payload.voteKillPlayerId, preValue + 1);
            const prevKillVoteActionLimit = this.killVoteActionLimit.get(player.getSessionId());
            this.killVoteActionLimit.set(player.getSessionId(), prevKillVoteActionLimit + 1);
        }
    }

    public isKillHimself(sessionId: string, voteKillPlayerId: string): boolean {
        return sessionId === voteKillPlayerId;
    }

    public hasReachKillVoteLimit(sessionId: string): boolean {
        return this.killVoteActionLimit.get(sessionId) === MafiaPhasesActionLimit.MAFIA_KILL_VOTE;
    }

    public isPlayerExist(sessionId: string): boolean {
        return this.players.findIndex(player => player.getSessionId() === sessionId) !== -1;
    }

    public getResult(): ArraySchema<AbstractActionResult> {
        const result = new ArraySchema<AbstractActionResult>();
        const voteKillResult = this.getVoteKillResult();
        result.push(voteKillResult);

        return result;
    }

    public getVoteKillResult(): VoteKillActionResult {
        const voteKillResult = new VoteKillActionResult();
        voteKillResult.playerId = ColyseusUtils.getMaxOccurrenceInMapSchema(this.killVotes);

        return voteKillResult;
    }

    public isKillMafia(voteKillPlayerId: string): boolean {
        const voteKillPlayerRole = this.players.find(player => player.getSessionId() === voteKillPlayerId).getRole();
        return MafiaRoleUtils.isMafia(voteKillPlayerRole);
    }
}

export default MafiaActions;
