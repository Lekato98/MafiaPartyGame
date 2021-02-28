import AState from "./AState";
import DoctorState from "./DoctorState";

class DetectiveState extends AState {
    action(): AState {
        return new DoctorState();
    }
}

export default DetectiveState;