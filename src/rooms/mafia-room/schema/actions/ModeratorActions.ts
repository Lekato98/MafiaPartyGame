import AbstractActions from './AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';
import MafiaGameState from '../MafiaGameState';

class ModeratorActions extends AbstractActions {
    constructor(readonly context: MafiaGameState) {
        super();
    }

    onAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
    }
}

export default ModeratorActions;
