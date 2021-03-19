import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';

class NightPhase extends AbstractPhase {

    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshNightPhase();
    }

    public onBegin(): void {
        this.context.phaseActionsResult.clear();
    }

    refreshNightPhase() {
        this.phaseName = MafiaPhaseName.NIGHT_PHASE;
        this.phaseTime = MafiaPhaseTime.NIGHT_PHASE;
        this.actionsName = MafiaActionsName.MODERATOR_ACTIONS;
        this.refreshPhase();
    }
}

export default NightPhase;
