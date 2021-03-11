import {ArraySchema, Schema, type} from "@colyseus/schema";
import {MafiaRole} from "../../utils/MafiaRoleUtils";
import MafiaPhaseUtils, {MafiaPhaseName, MafiaPhaseTime} from '../../utils/MafiaPhaseUtils';
import MafiaGameState from "../MafiaGameState";
import MafiaSupportUtils from "../../utils/MafiaSupportUtils";
import MafiaPhaseActionUtils, {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import MafiaPlayer from "../clients/MafiaPlayer";
import IActions from "../actions/IActions";

abstract class AbstractPhase extends Schema {
    protected context: MafiaGameState;
    protected actions: IActions;

    @type(['string']) protected activeRoles: ArraySchema<MafiaRole>;
    @type(['uint8']) protected activeActions: ArraySchema<MafiaPhaseAction>;
    @type('uint8') protected phaseTime: MafiaPhaseTime;
    @type('string') protected phaseName: MafiaPhaseName;

    // TODO onBegin & onEnd
    public goToNextPhase(): void {
        let nextPhase: MafiaPhaseName = MafiaPhaseUtils.getNextPhase(this.phaseName);
        while (!MafiaPhaseUtils.isNeededPhase(nextPhase, this.context.getRolesCollection())) {
            nextPhase = MafiaPhaseUtils.getNextPhase(nextPhase);
        }

        this.context.setCurrentPhaseByName(nextPhase);
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

    public isValidAction(action: MafiaPhaseAction): boolean {
        return this.activeActions.includes(action);
    }

    public isValidRole(role: MafiaRole): boolean {
        return this.activeRoles.includes(role);
    }

    public refreshPhase(): void {
        this.initializeActiveActions();
        this.initializeActiveRoles();
    }

    public getPhaseTime(): MafiaPhaseTime {
        return this.phaseTime;
    }
}

export default AbstractPhase;