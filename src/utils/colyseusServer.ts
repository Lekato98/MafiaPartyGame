import * as Colyseus from "colyseus";
import MafiaRoom from "../rooms/MafiaRoom";

export enum RoomsNameEnum {
    MAFIA = 'Mafia'
}

class ColyseusServer {
    public static readonly PORT: number = Number(process.env.PORT || 4567);
    public static readonly ROOM_NAME: RoomsNameEnum = RoomsNameEnum.MAFIA;

    public static create(options: any): Colyseus.Server {
        const colyseusServer = new Colyseus.Server(options);
        colyseusServer.define(this.ROOM_NAME, MafiaRoom);
        colyseusServer.listen(this.PORT)
            .then(() => console.log(`listing on ${this.PORT}`));

        return colyseusServer;
    }
}

export default ColyseusServer;