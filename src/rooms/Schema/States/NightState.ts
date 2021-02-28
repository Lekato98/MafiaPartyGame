import AState from "./AState";
import MafiaState from "./MafiaState";

class NightState extends AState {
    action(): AState {
        return new MafiaState();
    }
}

export default NightState;