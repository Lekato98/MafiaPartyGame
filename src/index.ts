import http from "http";

import expressApp from "./app/expressApp";
import ColyseusServer from "./colyseus/ColyseusServer";

const server = http.createServer(expressApp);
const colyseusServerOptions = {server};
const colyseusServer = ColyseusServer.create(colyseusServerOptions);