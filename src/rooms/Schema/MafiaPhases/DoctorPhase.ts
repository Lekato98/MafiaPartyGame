import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../MafiaUtils/MafiaPhaseUtils";
import {MafiaPhaseAction} from "../../MafiaUtils/MafiaPhaseActionUtils";
import {InvalidPhaseAction, RoomError} from "../../Errors/MafiaRoomErrors";

class DoctorPhase extends AbstractPhase {
    private protectedPlayer: string;

    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDoctorPhase();
    }

    public doAction(action: MafiaPhaseAction, payload: any): void {
        switch (action) {
            case MafiaPhaseAction.DOCTOR_PROTECT_ONE:
                this.protectAction(payload.player);
                break;
            default:
                throw new InvalidPhaseAction(RoomError.INVALID_PHASE_ACTION);
        }
    }

    public protectAction(playerId: string) {
        this.setProtectedPlayer(playerId);
    }

    public setProtectedPlayer(protectedPlayer: string): void {
        this.protectedPlayer = protectedPlayer;
    }

    refreshDoctorPhase(): void {
        this.phaseName = MafiaPhaseName.DOCTOR_PHASE;
        this.phaseTime = MafiaPhaseTime.DOCTOR_PHASE_TIME;
        this.protectedPlayer = '';
        this.setActiveActions();
        this.setActiveRoles();
    }
}


export default DoctorPhase;