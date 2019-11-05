import mongoose from "mongoose";

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb://ec2-15-164-162-77.ap-northeast-2.compute.amazonaws.com/dodoli";
const env = process.env.NODE_ENV || "development";

const auth = require("../../db.json");

let mongoURL = MONGO_URL;
if (env !== "production") mongoURL += `_${env}`;
if (env === "development") {
  mongoose.set("debug", true);
}

module.exports = () =>
  mongoose.connect(mongoURL, {
    ...auth,
    auth: { authdb: "admin" }
  });
