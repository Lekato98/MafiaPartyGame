import { ArraySchema } from '@colyseus/schema';
import AbstractActions from './AbstractActions';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import MafiaPlayer from '../clients/MafiaPlayer';

class ModeratorActions extends AbstractActions {
    constructor(readonly players: ArraySchema<MafiaPlayer>) {
        super();
    }

    doAction(player: MafiaPlayer, action: MafiaPhaseAction, payload: any): void {
    }
}

export default ModeratorActions;
