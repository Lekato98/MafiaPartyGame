import { Schema } from '@colyseus/schema';
import { MafiaPhaseAction } from '../../utils/MafiaPhaseActionUtils';
import { MafiaRole } from '../../utils/MafiaRoleUtils';

export abstract class AbstractActionResult extends Schema {
    public actionName: MafiaPhaseAction;
    public playerId: string;
}

export class ProtectActionResult extends AbstractActionResult {
    public readonly actionName: MafiaPhaseAction;

    constructor() {
        super();
        this.actionName = MafiaPhaseAction.DOCTOR_PROTECT_ONE;
        this.playerId = '';
    }
}

export class VoteKillActionResult extends AbstractActionResult {
    public readonly actionName: MafiaPhaseAction;

    constructor() {
        super();
        this.actionName = MafiaPhaseAction.MAFIA_KILL_VOTE;
        this.playerId = '';
    }
}

export class VoteKickActionResult extends AbstractActionResult {
    public readonly actionName: MafiaPhaseAction;

    constructor() {
        super();
        this.actionName = MafiaPhaseAction.KICK_VOTE;
        this.playerId = '';
    }
}

export class DetectActionResult {
    constructor(public readonly playerId: string, public readonly role: MafiaRole) {
    }
}
