import AState from "./AState";
import DetectiveState from "./DetectiveState";

class MafiaState extends AState {
    action(): AState {
        return new DetectiveState();
    }
}

export default MafiaState;