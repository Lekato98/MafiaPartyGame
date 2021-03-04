import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import DetectivePhase from "./DetectivePhase";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class MafiaPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshMafiaState();
    }

    goToNextPhase(): void {
        const detectivePhase = new DetectivePhase(this.context);
        this.context.setCurrentPhase(detectivePhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.DETECTIVE_PHASE;
    }

    refreshMafiaState(): void {
        this.phaseName = PhaseEnum.MAFIA_PHASE;
        this.phaseTime = PhaseTime.MAFIA_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfMafiaRole(1);
        collection.map(item => this.activeRolesForCurrentState.push(item));
    }
}

export default MafiaPhase;