import { Schema, type } from '@colyseus/schema';

export class MafiaSpectator extends Schema {
    @type('string') private readonly sessionId: string;
    @type('string') private readonly username: string;

    constructor(sessionId: string, username: string) {
        super();
        this.sessionId = sessionId;
        this.username = username;
    }

    public getSessionId(): string {
        return this.sessionId;
    }

    public getUsername(): string {
        return this.username;
    }
}

export default MafiaSpectator;
