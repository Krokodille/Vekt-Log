const functions = require('firebase-functions');
const {
	ExportBundleInfo,
} = require('firebase-functions/lib/providers/analytics');
const express = require('express');
const app = express();
const FBAuth = require('./util/fbAuth');

const {
	getAllWeights,
	postOneWeight,
	deleteWeight,
	//getWeight,
} = require('./handlers/weight');
const {
	signup,
	login,
	uploadImage,
	addUserDetails,
	getAuthenticatedUser,
} = require('./handlers/users');

//weights
app.get('/weights', getAllWeights); //Maybe need to add FBAuth.
app.post('/weight', FBAuth, postOneWeight);
//app.get("/weight/:weightId", FBAuth, getWeight); //Denne er ikke laget
app.delete('/weight/:weightId', FBAuth, deleteWeight);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

//Users route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
//app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.onUserImageChange = functions
	.region('europe-west1')
	.firestore.document('/users/{userId}')
	.onUpdate((change) => {
		console.log(change.before.data());
		console.log(change.after.data());
		if (change.before.data().imageUrl !== change.after.data().imageUrl) {
			console.log('image has changed');
			const batch = db.batch();
			return db
				.collection('weights')
				.where('userHandle', '==', change.before.data().handle)
				.get()
				.then((data) => {
					data.forEach((doc) => {
						const weight = db.doc(`/weight/${doc.id}`);
						batch.update(weight, { userImage: change.after.data().imageUrl });
					});
					return batch.commit();
				});
		} else return true;
	});

exports.onWeightDelete = functions
	.region('europe-west1')
	.firestore.document('/weight/{weightId}')
	.onDelete((snapshot, context) => {
		const weightId = context.params.weightId;
		const batch = db.batch();
		return db
			.collection('weights')
			.where('weightId', '==', weightId)
			.get()
			.then((data) => {
				data.forEach((doc) => {
					batch.delete(db.doc(`/weights/${doc.id}`));
				});
			})
			.catch((err) => console.error(err));
	});
