import AbstractPhase from './AbstractPhase';
import MafiaGameState from '../MafiaGameState';
import { MafiaPhaseName, MafiaPhaseTime } from '../../utils/MafiaPhaseUtils';
import { MafiaActionsName } from '../actions/AbstractActions';

class DiscussPhase extends AbstractPhase {
    constructor(readonly context: MafiaGameState) {
        super();
        this.refreshDiscussPhase();
    }

    public onBegin(): void {
    }

    public onEnd(): void {
    }

    refreshDiscussPhase() {
        this.name = MafiaPhaseName.DISCUSS_PHASE;
        this.time = MafiaPhaseTime.DISCUSS_PHASE;
        this.actionsName = MafiaActionsName.DISCUSS_ACTIONS;
        this.refreshPhase();
    }
}


export default DiscussPhase;
