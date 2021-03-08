import {Schema, type} from "@colyseus/schema";
import {MafiaRole} from "../MafiaUtils/MafiaRoleUtils";

export class Player extends Schema {
    @type('string') private readonly sessionId: string;
    @type('string') private readonly username: string;
    @type('string') private role: MafiaRole;

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

    setRole(role: MafiaRole): void {
        this.role = role;
    }

    getRole(): MafiaRole {
        return this.role;
    }
}

export default Player;