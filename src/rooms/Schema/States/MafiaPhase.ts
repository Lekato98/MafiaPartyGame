import AbstractPhases, {StatesEnum, StatesPhaseTime} from "./AbstractPhases";
import DetectivePhase from "./DetectivePhase";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class MafiaPhase extends AbstractPhases {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshMafiaState();
    }

    goToNextState() {
        const detectiveState = new DetectivePhase(this.context);
        this.context.setCurrentState(detectiveState);
    }

    getNextState(): StatesEnum {
        return StatesEnum.DETECTIVE_STATE;
    }

    refreshMafiaState(): void {
        this.stateName = StatesEnum.MAFIA_STATE;
        this.phaseTime = StatesPhaseTime.MAFIA_PHASE_TIME;
        this.turn = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfMafiaRole(1);
        collection.map(item => this.turn.push(item));
    }
}

export default MafiaPhase;