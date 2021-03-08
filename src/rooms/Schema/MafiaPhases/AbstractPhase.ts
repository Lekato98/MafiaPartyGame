import {ArraySchema, Schema, type} from "@colyseus/schema";
import {MafiaRole} from "../../MafiaUtils/MafiaRoleUtils";
import MafiaPhaseUtils, {MafiaPhaseName, MafiaPhaseTime} from '../../MafiaUtils/MafiaPhaseUtils';
import MafiaGameState from "../MafiaGameState";
import MafiaSupportUtils from "../../MafiaUtils/MafiaSupportUtils";
import MafiaPhaseActionUtils, {MafiaPhaseAction} from "../../MafiaUtils/MafiaPhaseActionUtils";

abstract class AbstractPhase extends Schema {
    @type(['string']) activeRoles: ArraySchema<MafiaRole>;
    @type(['uint8']) activeActions: ArraySchema<MafiaPhaseAction>;
    @type('uint8') phaseTime: MafiaPhaseTime;
    @type('string') phaseName: MafiaPhaseName;
    context: MafiaGameState;

    goToNextPhase(): void {
        let nextPhase: MafiaPhaseName = MafiaPhaseUtils.getNextPhase(this.phaseName);
        while (!MafiaPhaseUtils.isNeededPhase(nextPhase, this.context.getRolesCollection())) {
            nextPhase = MafiaPhaseUtils.getNextPhase(nextPhase);
        }

        this.context.setCurrentPhaseByName(nextPhase);
    }

    setActiveActions(): void {
        this.activeActions = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaPhaseActionUtils.getActiveActionsByPhaseName(this.phaseName)
                .concat(MafiaPhaseActionUtils.ACTIVE_ACTIONS_ALL)
        );
    }

    setActiveRoles(): void {
        this.activeRoles = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaPhaseUtils.getActiveRolesByPhaseName(this.phaseName)
        );
    }

    getPhaseTime(): MafiaPhaseTime {
        return this.phaseTime;
    }
}

export default AbstractPhase;