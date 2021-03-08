import {Schema, type} from "@colyseus/schema";

export class Spectator extends Schema {
    @type('string') private readonly sessionId: string;
    @type('string') private readonly username: string;

    constructor(sessionId: string, username: string) {
        super();
        this.sessionId = sessionId;
        this.username = username;
    }

    getSessionId(): string {
        return this.sessionId;
    }

    getUsername(): string {
        return this.username;
    }
}

export default Spectator;