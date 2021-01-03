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
