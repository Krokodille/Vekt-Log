
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ExportBundleInfo } = require('firebase-functions/lib/providers/analytics');

admin.initializeApp();

const express = require('express'); 
const app = express();

app.get('/weights', (req, res) => {
    admin
        .firestore()
        .collection('weights')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let weights = [];
            data.forEach((doc) => {
                weights.push({
                    weightId: doc.id,
                    weightNr: doc.data().weightNr,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(weights);
        })
        .catch(err => console.error(err));
});

app.post('/weight', (req, res) => {

    const newWeight = {
        weightNr: req.body.weightNr, 
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

    admin.firestore()
        .collection('weights')
        .add(newWeight)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({ erros: 'something went wrong'});
            console.error(err);
        })
});

exports.api = functions.region('europe-west1').https.onRequest(app);
