import AbstractPhase, {PhaseEnum, PhaseTime} from "./AbstractPhase";
import {ArraySchema} from "@colyseus/schema";
import MafiaGameUtils, {MafiaRolesEnum} from "../../Utils/MafiaGameUtils";
import VotePhase from "./VotePhase";
import MafiaGameState from "../MafiaGameState";

class DiscussPhase extends AbstractPhase {
    constructor(context: MafiaGameState) {
        super();
        this.context = context;
        this.refreshDiscussState();
    }

    goToNextPhase(): void {
        const votePhase = new VotePhase(this.context);
        this.context.setCurrentPhase(votePhase);
    }

    getNextPhase(): PhaseEnum {
        return PhaseEnum.VOTE_PHASE;
    }

    refreshDiscussState() {
        this.phaseName = PhaseEnum.DISCUSS_PHASE;
        this.phaseTime = PhaseTime.DISCUSS_PHASE_TIME;
        this.activeRolesForCurrentState = new ArraySchema<MafiaRolesEnum>();
        const collection = MafiaGameUtils.getUniqueGameRolesCollection();
        collection.map(item => this.activeRolesForCurrentState.push(item));
    }
}


export default DiscussPhase;