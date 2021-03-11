import express from 'express';
import {monitor} from "@colyseus/monitor";

const expressApp = express();

expressApp.use("/colyseus", monitor());

export default expressApp;