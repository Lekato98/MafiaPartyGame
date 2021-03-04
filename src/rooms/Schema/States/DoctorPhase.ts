import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import DayPhase from "./DayPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class DoctorPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDoctorState();
    }

    goToNextPhase(): void {
        const dayPhase = new DayPhase(this.context);
        this.context.setCurrentPhase(dayPhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.DAY_PHASE;
    }

    refreshDoctorState(): void {
        this.phaseName = PhaseEnum.DOCTOR_PHASE;
        this.phaseTime = PhaseTime.DOCTOR_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getCollectionOfDoctorRole(1);
        collection.map(item => this.activeRolesForCurrentState.push(item));
    }
}


export default DoctorPhase;