
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ExportBundleInfo } = require('firebase-functions/lib/providers/analytics');

admin.initializeApp();

const express = require('express'); 
const app = express();

app.get('/weight', (req, res) => {
    admin
        .firestore()
        .collection('weight')
        .get()
        .then(data => {
            let weight = [];
            data.forEach((doc) => {
                weight.push(doc.data());
            });
            return res.json(weight);
        })
        .catch(err => console.error(err));
})

exports.createWeight = functions.https.onRequest((req, res) => {
    if(req.method !== 'POST'){
        return res.status(400).json({ error: 'Method not allowed'});
    }

    const newWeight = {
        weightNr: req.body.weightNr, 
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore()
        .collection('weight')
        .add(newWeight)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({ erros: 'something went wrong'});
            console.error(err);
        })
})

exports.api = functions.https.onRequest(app);