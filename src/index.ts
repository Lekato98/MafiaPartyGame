import http from "http";

import expressApp from "./app/expressApp";
import ColyseusServer from "./utils/colyseusServer";

const server = http.createServer(expressApp);
const options = {server};
const colyseusServer = ColyseusServer.create(options);