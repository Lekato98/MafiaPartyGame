import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { AbstractActionResult, MafiaActionsName } from '../actions/AbstractActions';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import { MafiaRoomMessage, MafiaRoomMessageType } from '../../MafiaRoom';
import { ArraySchema } from '@colyseus/schema';

class DoctorPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDoctorPhase();
    }

    public onBegin(): void {
        this.context.players.forEach((player: MafiaPlayer) => player.getRole() === MafiaRole.DOCTOR
            && player.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.DOCTOR_TO_PROTECT),
        ); // send message for doctor
    }

    public onEnd(): void {
        const results: ArraySchema<AbstractActionResult> = this.actions.getResult();
        this.context.phaseActionsResult.push(...results);
    }

    refreshDoctorPhase(): void {
        this.phaseName = MafiaPhaseName.DOCTOR_PHASE;
        this.phaseTime = MafiaPhaseTime.DOCTOR_PHASE_TIME;
        this.actionsName = MafiaActionsName.DOCTOR_ACTIONS;
        this.refreshPhase();
    }
}


export default DoctorPhase;
