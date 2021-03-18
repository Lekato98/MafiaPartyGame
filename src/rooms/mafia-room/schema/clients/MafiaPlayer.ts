import { Schema, type } from '@colyseus/schema';
import { MafiaRole } from '../../utils/MafiaRoleUtils';
import { Client } from 'colyseus';
import { ISendOptions } from 'colyseus/lib/transport/Transport';

export class MafiaPlayer extends Schema {
    @type('string') private readonly sessionId: string;
    @type('string') private readonly username: string;
    @type('string') private role: MafiaRole;

    constructor(private readonly client: Client, username: string) {
        super();
        this.sessionId = client.sessionId;
        this.username = username;
        this.client = client;
    }

    public send(type: string | number, message?: any, options?: ISendOptions): void {
        this.client.send(type, message);
    }

    public getSessionId(): string {
        return this.sessionId;
    }

    public getUsername(): string {
        return this.username;
    }

    public setRole(role: MafiaRole): void {
        this.role = role;
    }

    public getRole(): MafiaRole {
        return this.role;
    }
}

export default MafiaPlayer;
