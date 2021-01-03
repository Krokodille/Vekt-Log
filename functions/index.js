const functions = require("firebase-functions");

const {
	ExportBundleInfo,
} = require("firebase-functions/lib/providers/analytics");
const express = require("express");
const app = express();

const FBAuth = require("./util/fbAuth");

const { getAllWeights, postOneWeight } = require("./handlers/weight");
const { signup, login, uploadImage } = require("./handlers/users");
const { signup, login } = require("./handlers/users");

//Retrieves weights
app.get("/weights", getAllWeights);
//Adds a new weight
app.post("/weight", FBAuth, postOneWeight);

//Users route
//Signup route
app.post("/signup", signup);
//Method for login to the application
app.post("/login", login);
app.post("/user/image", uploadImage);

exports.api = functions.region("europe-west1").https.onRequest(app);
