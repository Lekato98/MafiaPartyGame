import { Schema } from '@colyseus/schema';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import supports = CSS.supports;

export abstract class AbstractActionResult extends Schema {
    public actionName: MafiaPhaseAction;
    public playerId: string;
}

export class ProtectActionResult extends AbstractActionResult {
    constructor() {
        super();
        this.actionName = MafiaPhaseAction.DOCTOR_PROTECT_ONE;
        this.playerId = '';
    }
}

export class VoteKillActionResult extends AbstractActionResult {
    constructor() {
        super();
        this.actionName = MafiaPhaseAction.MAFIA_KILL_VOTE;
        this.playerId = '';
    }
}

export class DetectActionResult {
    constructor(public readonly playerId: string, public readonly role: MafiaRole) {
    }
}
