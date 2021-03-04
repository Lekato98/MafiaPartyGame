import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import DoctorPhase from "./DoctorPhase";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class DetectivePhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDetectiveState();
    }

    goToNextPhase(): void {
        const doctorPhase = new DoctorPhase(this.context);
        this.context.setCurrentPhase(doctorPhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.DOCTOR_PHASE;
    }

    refreshDetectiveState(): void {
        this.phaseName = PhaseEnum.DETECTIVE_PHASE;
        this.phaseTime = PhaseTime.DETECTIVE_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfDetectiveRole(1);
        collection.map(item => this.activeRolesForCurrentState.push(item));
    }
}

export default DetectivePhase;