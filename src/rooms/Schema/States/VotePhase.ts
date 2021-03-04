import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import NightPhase from "./NightPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameState from "../MafiaGameState";

class VotePhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshVoteState();
    }

    goToNextPhase(): void {
        const nightPhase = new NightPhase(this.context);
        this.context.setCurrentPhase(nightPhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.NIGHT_PHASE;
    }

    refreshVoteState(): void {
        this.phaseName = PhaseEnum.VOTE_PHASE;
        this.phaseTime = PhaseTime.VOTE_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getUniqueGameRolesCollection();
        collection.map(item => this.activeRolesForCurrentState.push(item));
    }
}


export default VotePhase;