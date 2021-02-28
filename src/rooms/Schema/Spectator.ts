import {defineTypes, Schema} from "@colyseus/schema";

export class Spectator extends Schema {
    private readonly sessionId: string;
    private readonly username: string;

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

defineTypes(Spectator, {
    sessionId: 'string',
    username: 'string',
});

export default Spectator;