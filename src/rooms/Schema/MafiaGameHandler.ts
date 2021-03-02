import {defineTypes, Schema} from "@colyseus/schema";
import State, {StatesEnum} from "./States/State";
import DayState from "./States/DayState";
import DiscussState from "./States/DiscussState";
import DoctorState from "./States/DoctorState";
import MafiaState from "./States/MafiaState";
import NightState from "./States/NightState";
import VoteState from "./States/VoteState";
import DetectiveState from "./States/DetectiveState";

class MafiaGameHandler extends Schema {

    // NIGHT -> MAFIA -> DET -> DOC -> DAY -> DISC -> VOTE -> NIGHT
    private currentState: State;
    private gameStarted: boolean;

    constructor() {
        super();
        this.refreshMafiaGameHandler();
    }

    startGame(): void {
        this.gameStarted = true;
        this.startGameLifeCycle();
    }

    startGameLifeCycle(): void | Promise<any> {
        setTimeout(() => {
            this.goToNextState();
            this.startGameLifeCycle();
        }, this.currentState.getPhaseTime() * 1000);
    }

    public action(): void {
        this.goToNextState();
    }

    goToNextState() {
        switch (this.currentState.getNextState()) {
            case StatesEnum.NIGHT_STATE:
                this.currentState = new NightState();
                break;

            case StatesEnum.MAFIA_STATE:
                this.currentState = new MafiaState();
                break;

            case StatesEnum.DETECTIVE_STATE:
                this.currentState = new DetectiveState();
                break;

            case StatesEnum.DOCTOR_STATE:
                this.currentState = new DoctorState();
                break;

            case StatesEnum.DAY_STATE:
                this.currentState = new DayState();
                break;

            case StatesEnum.DISCUSS_STATE:
                this.currentState = new DiscussState();
                break;

            case StatesEnum.VOTE_STATE:
                this.currentState = new VoteState();
                break;
        }
    }

    isGameStarted(): boolean {
        return this.gameStarted;
    }

    refreshMafiaGameHandler(): void {
        this.currentState = new NightState();
        this.gameStarted = false;
    }
}

defineTypes(MafiaGameHandler, {
    currentState: State,
    gameStarted: 'boolean',
});

export default MafiaGameHandler;