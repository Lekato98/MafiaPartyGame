import {defineTypes, Schema} from "@colyseus/schema";
import {MafiaRolesEnum} from "../MafiaUtils/MafiaRolesUtils";

export class Player extends Schema {
    private readonly sessionId: string;
    private readonly username: string;
    private role: MafiaRolesEnum;

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

    setRole(role: MafiaRolesEnum): void {
        this.role = role;
    }

    getRole(): MafiaRolesEnum {
        return this.role;
    }
}

defineTypes(Player, {
    sessionId: 'string',
    username: 'string',
    role: 'string'
});

export default Player;