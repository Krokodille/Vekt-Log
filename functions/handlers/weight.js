const { db } = require("../util/admin");

exports.getAllWeights = (req, res) => {
	db
		.collection("weights")
		.orderBy("createdAt", "desc")
		.get()
		.then((data) => {
			let weights = [];
			data.forEach((doc) => {
				weights.push({
					weightId: doc.id,
					weightNr: doc.data().weightNr,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt,
				});
			});
			return res.json(weights);
		})
		.catch((err) => console.error(err));
};

exports.postOneWeight = (req, res) => {
	if (req.body.weightNr === "") {
		return res.status(400).json({ weightNr: "Weight cannot be empty" });
	}

	const newWeight = {
		weightNr: req.body.weightNr,
		userHandle: req.user.handle,
		createdAt: new Date().toISOString(),
	};

	db
		.collection("weights")
		.add(newWeight)
		.then((doc) => {
			res.json({ message: `weight ${doc.id} added successfully` });
		})
		.catch((err) => {
			res.status(500).json({ erros: "something went wrong" });
			console.error(err);
		});
};

// Fetch one scream
/*exports.getWeight = (req, res) => {
	let weightData = {};
	db
		.doc(`/weight/${req.params.weightId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: "Weight not found" });
			}
			weightData = doc.data();
			weightData.weightId = doc.id;
			return db
				.collection("weights")
				.orderBy("createdAt", "desc")
				.where("weightId", "==", req.params.weightId)
				.get();
		})
		.then((data) => {
			screamData.comments = [];
			data.forEach((doc) => {
				screamData.comments.push(doc.data());
			});
			return res.json(screamData);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({ error: err.code });
		});
};*/

//Delete a weight
exports.deleteWeight = (req, res) => {
	const document = db.doc(`/weight/${req.params.weightId}`);
	document
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return res.status(404).json({ error: "Weight not found" });
			}
			if (doc.data().userHandle !== req.user.handle) {
				return res.status(403).json({ error: "Unauthorized" });
			} else {
				return document.delete();
			}
		})
		.then(() => {
			res.json({ message: "Weight deleted successfully" });
		})
		.catch((err) => {
			console.error(err);
			return res.status(500).json({ error: err.code });
		});
};
