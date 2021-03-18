import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaActionsName} from "../actions/AbstractActions";
import MafiaPlayer from "../clients/MafiaPlayer";
import {MafiaRole} from "../../utils/MafiaRoleUtils";
import {MafiaRoomMessage, MafiaRoomMessageType} from "../../MafiaRoom";

class MafiaPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshMafiaPhase();
    }

    public onBegin() {
        this.context.players.forEach((player: MafiaPlayer) => player.getRole() === MafiaRole.MAFIA
            && player.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.MAFIA_TO_KILL)
        );
    }

    public onEnd(): void {
        const results: Array<any> = this.actions.getResult();
        this.context.phaseActions.push(...results);
    }

    refreshMafiaPhase(): void {
        this.phaseName = MafiaPhaseName.MAFIA_PHASE;
        this.phaseTime = MafiaPhaseTime.MAFIA_PHASE_TIME;
        this.actionsName = MafiaActionsName.MAFIA_ACTIONS;
        this.refreshPhase();
    }
}

export default MafiaPhase;