import {Schema} from "@colyseus/schema";
import DayState from "./DayState";

abstract class AState extends Schema {
    abstract action(): AState;
}

export default AState;