import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import { MafiaRoomMessage, MafiaRoomMessageType } from '../../MafiaRoom';
import { ArraySchema } from '@colyseus/schema';
import { AbstractActionResult } from '../results/actionResults';

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
        results.forEach(result => this.context.phaseActionsResult.set(result.actionName, result));
    }

    refreshDoctorPhase(): void {
        this.name = MafiaPhaseName.DOCTOR_PHASE;
        this.time = MafiaPhaseTime.DOCTOR_PHASE;
        this.actionsName = MafiaActionsName.DOCTOR_ACTIONS;
        this.refreshPhase();
    }
}


export default DoctorPhase;
