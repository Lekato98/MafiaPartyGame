import { Schema, type } from '@colyseus/schema';
import { Client } from 'colyseus';
import { ISendOptions } from 'colyseus/lib/transport/Transport';

export class MafiaSpectator extends Schema {
    @type('string') private readonly id: string;
    @type('string') private readonly username: string;

    constructor(private readonly client: Client, username: string) {
        super();
        this.id = client.sessionId;
        this.username = username;
    }

    public send(type: string | number, message?: any, options?: ISendOptions): void {
        this.client.send(type, message, options);
    }

    public getId(): string {
        return this.id;
    }

    public getUsername(): string {
        return this.username;
    }
}

export default MafiaSpectator;
