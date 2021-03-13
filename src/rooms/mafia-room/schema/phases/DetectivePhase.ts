import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaActionsName} from "../actions/AbstractActions";
import MafiaPlayer from "../clients/MafiaPlayer";
import {MafiaRole} from "../../utils/MafiaRoleUtils";
import {MafiaRoomMessage, MafiaRoomMessageType} from "../../MafiaRoom";

class DetectivePhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDetectivePhase();
        this.onBegin();
    }

    public onBegin() {
        this.context.players.forEach((player: MafiaPlayer) => player.getRole() === MafiaRole.DETECTIVE
            && player.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.DETECTOR_TO_DETECT)
        );
    }

    refreshDetectivePhase(): void {
        this.phaseName = MafiaPhaseName.DETECTIVE_PHASE;
        this.phaseTime = MafiaPhaseTime.DETECTIVE_PHASE_TIME;
        this.actionsName = MafiaActionsName.DETECTIVE_ACTIONS;
        this.refreshPhase();
    }
}

export default DetectivePhase;