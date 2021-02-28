import AState from "./AState";
import DayState from "./DayState";

class DoctorState extends AState {
    action(): AState {
        return new DayState();
    }
}

export default DoctorState;