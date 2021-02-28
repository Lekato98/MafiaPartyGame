import {Schema} from "@colyseus/schema";
import AState from "./States/AState";
import DayState from "./States/DayState";

class MafiaGameHandler extends Schema {

    // maybe use State Design pattern
    // daySate -> vote kick + open chat -> nightState
    // nightState -> MafiaState -> DetectiveState -> DoctorState -> dayState -> dayState
    private currentState: AState; // Abstract Class State

    constructor() {
        super();
        this.refreshMafiaGameHandler();
    }

    refreshMafiaGameHandler() {
        this.currentState = new DayState();
    }
}

export default MafiaGameHandler;