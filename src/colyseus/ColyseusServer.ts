import * as Colyseus from 'colyseus';
import MafiaRoom from '../rooms/mafia-room/MafiaRoom';

export enum RoomName {
    MAFIA = 'Mafia',
}

abstract class ColyseusServer {
    public static readonly PORT: number = Number(process.env.PORT || 4567);

    public static create(options: any): Colyseus.Server {
        const colyseusServer = new Colyseus.Server(options);
        colyseusServer.define(RoomName.MAFIA, MafiaRoom).sortBy({clients: 1});
        colyseusServer.listen(this.PORT)
            .then(() => console.log(`listing on ${ this.PORT }`));

        return colyseusServer;
    }
}

export default ColyseusServer;
