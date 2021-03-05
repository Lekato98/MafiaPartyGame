import {ArraySchema, defineTypes, Schema} from "@colyseus/schema";
import {MafiaRolesEnum} from "../../MafiaUtils/MafiaRolesUtils";
import MafiaPhasesUtils, {MafiaPhasesNameEnum, MafiaPhasesTimeEnum} from '../../MafiaUtils/MafiaPhasesUtils';
import MafiaGameState from "../MafiaGameState";
import MafiaSupportUtils from "../../MafiaUtils/MafiaSupportUtils";

abstract class AbstractPhase extends Schema {
    activeRoles: ArraySchema<MafiaRolesEnum>;
    phaseTime: MafiaPhasesTimeEnum;
    phaseName: MafiaPhasesNameEnum;
    context: MafiaGameState;

    goToNextPhase(): void {
        let nextPhase: MafiaPhasesNameEnum = MafiaPhasesUtils.getNextPhase(this.phaseName);
        while(!MafiaPhasesUtils.isNeededPhase(nextPhase, this.context.getRolesCollection())) {
            nextPhase = MafiaPhasesUtils.getNextPhase(nextPhase);
        }

        this.context.setCurrentPhaseByName(nextPhase);
    }

    setActiveRoles() {
        this.activeRoles = MafiaSupportUtils.convertArrayToArraySchema(
            MafiaPhasesUtils.getActiveRolesByPhaseName(this.phaseName)
        );
    }

    getPhaseTime(): MafiaPhasesTimeEnum {
        return this.phaseTime;
    }
}

defineTypes(AbstractPhase, {
    activeRoles: ['string'],
    phaseTime: 'int8',
    phaseName: 'string'
});

export default AbstractPhase;