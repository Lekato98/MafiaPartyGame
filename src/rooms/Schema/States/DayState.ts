import AState from "./AState";
import NightState from "./NightState";

class DayState extends AState {
    action(): AState {
        return new NightState();
    }
}

export default DayState;