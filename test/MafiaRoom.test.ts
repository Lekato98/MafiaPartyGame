import { Room, Client } from "colyseus.js";
import MafiaRoom from "../src/rooms/MafiaRoom";
import MafiaRoomState from "../src/rooms/Schema/MafiaRoomState";

export function requestJoinOptions (this: Client, i: number): any {
    return { requestNumber: i, jointType: i % 2 ? 'SPECTATOR' : 'PLAYER', username: Math.random().toString() };
}

export function onJoin(this: Room): void {
   // console.log(this.sessionId, "joined.");

    this.onMessage("*", (type, message) => {
       // console.log("onMessage:", type, message);
    });
}

export function onLeave(this: Room): void {
    //console.log(this.sessionId, "left.");
}

export function onError(this: Room, err: Error): void {
   // console.error(this.sessionId, "!! ERROR !!", err.message);
}

export function onStateChange(this: Room, state: MafiaRoomState): void {
    //console.log('updated state');
}