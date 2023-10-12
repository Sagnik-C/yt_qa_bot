import express from "express";
// controllers
import * as miscCtrls from "./ctrls/misc-ctrls.js";
import * as authCtrls from "./ctrls/auth-ctrls.js";
import * as queryCtrls from "./ctrls/query-ctrls.js";

const Router = express.Router();

// misc rouets
Router.get("/", miscCtrls.index);
// Auth Routes
Router.post("/auth/in", authCtrls.signIn);
Router.post("/auth/token", authCtrls.token);
Router.post("/auth/otp-generate", authCtrls.otp_generate);
Router.post("/auth/otp-verify", authCtrls.otp_verify);
// query routes
Router.post("/query", queryCtrls.query);

export default Router;
