import {ArraySchema, Schema, type} from "@colyseus/schema";
import {MafiaRole} from "../../utils/MafiaRoleUtils";
import MafiaPhaseUtils, {MafiaPhaseName, MafiaPhaseTime} from '../../utils/MafiaPhaseUtils';
import MafiaGameState from "../MafiaGameState";
import MafiaSupportUtils from "../../utils/MafiaSupportUtils";
import MafiaPhaseActionUtils, {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import AbstractActions, {MafiaActionsName} from "../actions/AbstractActions";
import {Client} from "colyseus";
import {InvalidPhaseAction, RoomErrorMessages} from "../../errors/MafiaRoomErrors";
import ActionsFactory from "../actions/ActionsFactory";

abstract class AbstractPhase extends Schema {
    public readonly context: MafiaGameState;
    @type('uint8') public phaseTime: MafiaPhaseTime;
    @type('string') public phaseName: MafiaPhaseName;
    @type('string') public actionsName: MafiaActionsName;

    @type(['string']) public activeRoles: ArraySchema<MafiaRole>;
    @type(['uint8']) public activeActions: ArraySchema<MafiaPhaseAction>;
    @type(AbstractActions) public actions: AbstractActions;

    // TODO onBegin & onEnd
    public onBegin(): void {
    }

    public onEnd(): void {
    }

    public goToNextPhase(): void {
        let nextPhase: MafiaPhaseName = MafiaPhaseUtils.getNextPhase(this.phaseName);
        while (!MafiaPhaseUtils.isNeededPhase(nextPhase, this.context.getRolesCollection())) {
            nextPhase = MafiaPhaseUtils.getNextPhase(nextPhase);
        }

        this.context.setCurrentPhaseByName(nextPhase);
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        const player = this.context.getPlayerBySessionId(client.sessionId);
        if (!this.isValidAction(action)) {
            throw new InvalidPhaseAction(RoomErrorMessages.UNKNOWN_ACTION_NAME);
        } else if(!this.isValidRole(player.getRole())) {
            throw new InvalidPhaseAction(RoomErrorMessages.INVALID_ROLE_ACTION_CALL);
        } else {
            this.actions.doAction(client, action, payload);
        }
    }

    public initializeActiveActions(): void {
        this.activeActions = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaPhaseActionUtils.getActiveActionsByPhaseName(this.phaseName)
                .concat(MafiaPhaseActionUtils.ACTIVE_ACTIONS_ALL)
        );
    }

    public initializeActiveRoles(): void {
        this.activeRoles = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaPhaseUtils.getActiveRolesByPhaseName(this.phaseName)
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

    public refreshPhase(): void {
        this.initializeActiveActions();
        this.initializeActiveRoles();
        this.initializeActions();
    }

    public getPhaseTime(): MafiaPhaseTime {
        return this.phaseTime;
    }
}

export default AbstractPhase;