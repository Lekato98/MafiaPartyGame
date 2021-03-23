import AbstractActions from './AbstractActions';
import { ArraySchema } from '@colyseus/schema';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import { IGuiltyActionPayload, IInnocentActionPayload } from './payloads/actionsPayload';
import { AbstractActionResult, ExecuteActionResult } from '../results/actionResults';
import MafiaGameState from '../MafiaGameState';

class DefenseActions extends AbstractActions {
    public readonly playerToKick: string;
    public votes: number;

    constructor(readonly context: MafiaGameState) {
        super();
        this.votes = 0;
        this.playerToKick = this.context.actionsResult.get(MafiaPhaseAction.KICK_VOTE).playerId;
    }

    public onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.INNOCENT_VOTE:
                this.innocentAction(player, payload);
                break;

            case MafiaPhaseAction.GUILTY_VOTE:
                this.guiltyAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_ALL:
                this.messageToAllAction(player, payload);
                break;

            case MafiaPhaseAction.MESSAGE_TO_DEAD:
                this.messageToDead(player, payload);
                break;

            default:
                throw new InvalidPhaseAction(RoomErrorMessage.INVALID_PHASE_ACTION);
        }
    }

    public guiltyAction(player: MafiaPlayer, payload: IGuiltyActionPayload): void {
        this.votes++;
    }

    public innocentAction(player: MafiaPlayer, payload: IInnocentActionPayload): void {
        this.votes--;
    }

    public getExecuteResult(): AbstractActionResult {
        const executeResult = new ExecuteActionResult();
        if(this.votes > 0) {
            executeResult.playerId = this.playerToKick;
        }

        return executeResult;
    }

    public getResults(): ArraySchema<AbstractActionResult> {
        const results= new ArraySchema<AbstractActionResult>();
        results.push(this.getExecuteResult());
        return results;
    }
}

export default DefenseActions;
