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
    public nextPhase: MafiaPhaseName;

    @type('uint8') public time: MafiaPhaseTime;
    @type('string') public name: MafiaPhaseName;
    @type('string') public actionsName: MafiaActionsName;

    @type(['string']) public activeRoles: ArraySchema<MafiaRole>;
    @type(['string']) public activeActions: ArraySchema<MafiaPhaseAction>;
    @type(AbstractActions) public actions: AbstractActions;

    abstract onBegin(): void;

    abstract onEnd(): void;

    public onAction(client: Client, action: MafiaPhaseAction, payload: IActionName): void {
        const player = this.context.getPlayerById(client.sessionId);
        if (!this.isValidAction(action)) {
            throw new InvalidPhaseAction(RoomErrorMessage.UNKNOWN_ACTION_NAME);
        } else if (!this.isValidRole(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessage.INVALID_ROLE_ACTION_CALL);
        } else {
            this.actions.onAction(player, action, payload);
        }
    }

    public moveToNextPhase(): void {
        this.context.setCurrentPhaseByName(this.nextPhase);
    }

    public getNextPhaseByOrder(): MafiaPhaseName {
        return MafiaPhaseUtils.getNextPhase(this.name);
    }

    public getNextPhaseOptimal(): MafiaPhaseName {
        let nextPhase: MafiaPhaseName = MafiaPhaseUtils.getNextPhase(this.name);
        while (!MafiaPhaseUtils.isNeededPhase(nextPhase, this.context.getRolesCollection())) {
            nextPhase = MafiaPhaseUtils.getNextPhase(nextPhase);
        }

        return nextPhase;
    }

    public getPhaseTime(): MafiaPhaseTime {
        return this.time;
    }

    public setNextPhase(nextPhase: MafiaPhaseName): void {
        this.nextPhase = nextPhase;
    }

    public isValidAction(action: MafiaPhaseAction): boolean {
        return this.activeActions.includes(action);
    }

    public isValidRole(role: MafiaRole): boolean {
        return this.activeRoles.includes(role);
    }

    public initializeActiveActions(): void {
        this.activeActions = ColyseusUtils.convertArrayToArraySchema(
            MafiaPhaseActionUtils.getActiveActionsByPhaseName(this.name)
                .concat(MafiaPhaseActionUtils.ACTIVE_ACTIONS_ALL),
        );
    }

    public initializeActiveRoles(): void {
        this.activeRoles = ColyseusUtils.convertArrayToArraySchema(
            MafiaPhaseUtils.getActiveRolesByPhaseName(this.name),
        );
    }

    public initializeActions(): void {
        this.actions = ActionsFactory.createActions(this.actionsName, this.context.players);
    }

    public refreshPhase(): void {
        this.initializeActiveActions();
        this.initializeActiveRoles();
        this.initializeActions();
        this.setNextPhase(this.getNextPhaseOptimal());
    }
}

export default AbstractPhase;
