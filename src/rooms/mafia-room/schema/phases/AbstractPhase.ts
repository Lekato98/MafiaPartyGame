import { ArraySchema, Schema, type } from '@colyseus/schema';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import MafiaPhaseUtils, { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import MafiaGameState from '../MafiaGameState';
import MafiaPhaseActionUtils, { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import AbstractActions, { MafiaActionsName } from '../actions/AbstractActions';
import { Client } from 'colyseus';
import { InvalidPhaseAction, RoomErrorMessage } from '../../errors/MafiaRoomErrors';
import ActionsFactory from '../actions/ActionsFactory';
import { IActionName } from '../../MafiaRoom';
import ColyseusUtils from '../../../../colyseus/utils/ColyseusUtils';

abstract class AbstractPhase extends Schema {
    public readonly context: MafiaGameState;
    @type('uint8') public phaseTime: MafiaPhaseTime;
    @type('string') public phaseName: MafiaPhaseName;
    @type('string') public actionsName: MafiaActionsName;

    @type(['string']) public activeRoles: ArraySchema<MafiaRole>;
    @type(['uint8']) public activeActions: ArraySchema<MafiaPhaseAction>;
    @type(AbstractActions) public actions: AbstractActions;

    public onBegin(): void {
    }

    public onEnd(): void {
    }

    public moveToNextPhase(): void {
        let nextPhase: MafiaPhaseName = MafiaPhaseUtils.getNextPhase(this.phaseName);
        while (!MafiaPhaseUtils.isNeededPhase(nextPhase, this.context.getRolesCollection())) {
            nextPhase = MafiaPhaseUtils.getNextPhase(nextPhase);
        }

        this.context.setCurrentPhaseByName(nextPhase);
    }

    public onAction(client: Client, action: MafiaPhaseAction, payload: IActionName): void {
        const player = this.context.getPlayerBySessionId(client.sessionId);
        if (!this.isValidAction(action)) {
            throw new InvalidPhaseAction(RoomErrorMessage.UNKNOWN_ACTION_NAME);
        } else if (!this.isValidRole(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        } else {
            this.actions.onAction(player, action, payload);
        }
    }

    public initializeActiveActions(): void {
        this.activeActions = ColyseusUtils.convertArrayToArraySchema(
            MafiaPhaseActionUtils.getActiveActionsByPhaseName(this.phaseName)
                .concat(MafiaPhaseActionUtils.ACTIVE_ACTIONS_ALL),
        );
    }

    public initializeActiveRoles(): void {
        this.activeRoles = ColyseusUtils.convertArrayToArraySchema(
            MafiaPhaseUtils.getActiveRolesByPhaseName(this.phaseName),
        );
    }

    public initializeActions(): void {
        this.actions = ActionsFactory.createActions(this.actionsName, this.context.players);
    }

    public isValidAction(action: MafiaPhaseAction): boolean {
        return this.activeActions.includes(action);
    }

    public isValidRole(role: MafiaRole): boolean {
        return this.activeRoles.includes(role);
    }

    public getPhaseTime(): MafiaPhaseTime {
        return this.phaseTime;
    }

    public refreshPhase(): void {
        this.initializeActiveActions();
        this.initializeActiveRoles();
        this.initializeActions();
    }
}

export default AbstractPhase;
