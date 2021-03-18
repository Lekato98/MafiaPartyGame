import AbstractPhase from "./AbstractPhase";
import MafiaGameState from "../MafiaGameState";
import {MafiaPhaseName, MafiaPhaseTime} from "../../utils/MafiaPhaseUtils";
import {MafiaActionsName} from "../actions/AbstractActions";
import {MafiaPhaseAction} from "../../utils/MafiaPhaseActionUtils";
import {MafiaRole} from "../../utils/MafiaRoleUtils";
import { MafiaRoomMessage, MafiaRoomMessageType } from '../../MafiaRoom';

class DayPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDayPhase();
    }

    public onBegin(): void {
        let playerToKill = '';
        let playerToProtect = '';
        this.context.phaseActions.forEach(payload => {
            switch (payload.action) {
                case MafiaPhaseAction.MAFIA_KILL_VOTE:
                    playerToKill = payload.playerId;
                    break;

                case MafiaPhaseAction.DOCTOR_PROTECT_ONE:
                    playerToProtect = payload.playerId;
                    break;
            }
        });

        if (playerToKill !== playerToProtect && playerToKill !== '') {
            const players = this.context.players.map(player => player.getSessionId());
            const killedPlayerIndex = players.indexOf(playerToKill);
            const killedPlayer = this.context.players[killedPlayerIndex];
            killedPlayer.send(MafiaRoomMessageType.MODERATOR, MafiaRoomMessage.YOU_WERE_KILLED);
            killedPlayer.setRole(MafiaRole.DEAD);
        }
    }

    refreshDayPhase(): void {
        this.phaseName = MafiaPhaseName.DAY_PHASE;
        this.phaseTime = MafiaPhaseTime.DAY_PHASE_TIME;
        this.actionsName = MafiaActionsName.MODERATOR_ACTIONS;
        this.refreshPhase();
    }
}

export default DayPhase;
