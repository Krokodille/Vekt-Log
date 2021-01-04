const functions = require("firebase-functions");

const {
	ExportBundleInfo,
} = require("firebase-functions/lib/providers/analytics");
const express = require("express");
const app = express();

const FBAuth = require("./util/fbAuth");

const { getAllWeights, postOneWeight } = require("./handlers/weight");
const {
	signup,
	login,
	uploadImage,
	//getAuthenticatedUser,
} = require("./handlers/users");

//weights
app.get("/weights", getAllWeights);
app.post("/weight", FBAuth, postOneWeight);

//Users route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
//app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.region("europe-west1").https.onRequest(app);
