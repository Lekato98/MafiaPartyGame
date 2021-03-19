import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';
import MafiaPlayer from '../clients/MafiaPlayer';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import { MafiaRoomMessage, MafiaRoomMessageType } from '../../MafiaRoom';

class DetectorPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDetectorPhase();
        this.onBegin();
    }

    public onBegin() {
        this.context.players.forEach((player: MafiaPlayer) => player.getRole() === MafiaRole.DETECTOR
            && player.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.DETECTOR_TO_DETECT),
        );
    }

    refreshDetectorPhase(): void {
        this.phaseName = MafiaPhaseName.DETECTOR_PHASE;
        this.phaseTime = MafiaPhaseTime.DETECTOR_PHASE;
        this.actionsName = MafiaActionsName.DETECTOR_ACTIONS;
        this.refreshPhase();
    }
}

export default DetectorPhase;
