import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {Client} from "colyseus";
import ActionsFactory from "../actions/ActionsFactory";
import {MafiaActionsName} from "../actions/IActions";

class DoctorPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDoctorPhase();
    }

    public doAction(client: Client, action: MafiaPhaseAction, payload: any): void {
        this.actions.doAction(client, action, payload);
    }

    refreshDoctorPhase(): void {
        this.phaseName = MafiaPhaseName.DOCTOR_PHASE;
        this.phaseTime = MafiaPhaseTime.DOCTOR_PHASE_TIME;
        this.actions = ActionsFactory.createActions(MafiaActionsName.DOCTOR_ACTIONS, this.context.players);
        this.refreshPhase();
    }
}


export default DoctorPhase;