var express = require('express');
var router = express.Router();
var request = require('request');

// on load, analyze and redirect to home again 
var db = firebase.firestore();


router.get('/', (req, res, next) => {

});

/* Get the sentiment_colors json object*/
router.post('/get_colors', (req, res, next) => {
    res.send(sentiment_colors);
});

/* Analyze a single message (used for demo) */
router.post('/analyze_single', (req, res, next) => {
    var message = req.body.message;
    analyze([{ text: message }]).then(data => {
        // process the data
        res.send(data);
    }).catch(console.log);
});

/* Get list of all saved auto-resposes for local JS to populate */
router.post('/get_responses', (req, res, next) => {
    getSavedResponses().then(data => {
        res.send(data);
    }).catch(res.send);
});

/* Delete a response, given its index and id (which tone) */
router.post('/delete_response', (req, res, next) => {
    var id = req.body.id;
    var ind = req.body.ind;
    console.log(id);
    // get the list of responses
    db.collection('responses').doc(id).get().then(doc => {
        // modify the list by removing that index
        var messages = doc.data().messages;
        console.log(messages);
        messages.splice(ind, 1);
        // update the firestore document with new list
        db.collection('responses').doc(id).update({ messages: messages })
            .then(() => {
                res.send(true);
            }).catch(() => {
                res.send(false);
            });
    });
});

/* Update a response, given its index and id (which tone) */
router.post('/update_response', (req, res, next) => {
    var id = req.body.id;
    var ind = req.body.ind;
    var message = req.body.message;
    // get the list of responses
    db.collection('responses').doc(id).get().then(doc => {
        // modify the list by updating that index
        var messages = doc.data().messages;
        messages[ind] = message;
        // update the firestore document with new list
        db.collection('responses').doc(id).update({ messages: messages })
            .then(() => {
                res.send(true);
            }).catch(() => {
                res.send(false);
            });
    });
});

/* Insert a new response, given the tone type and message to insert */
router.post('/new_response', (req, res, next) => {
    var id = req.body.id;
    var message = req.body.message;
    db.collection('responses').doc(id).get().then(doc => {
        // add message to messages list
        var messages = doc.data().messages;
        messages.push(message);
        // update the firestore document with new list
        db.collection('responses').doc(id).update({ messages: messages })
            .then(() => {
                res.send(true);
            }).catch(() => {
                res.send(false);
            });
    });
});

/* helper function for getting all saved responses */
function getSavedResponses() {
    return new Promise(async (resolve, reject) => {
        var querySnapshot = await db.collection("responses").get();
        var docs = await querySnapshot.docs.map(doc => [doc.id, doc.data()]);
        if (!docs) reject("error");
        var temp_docs = [];
        for (var key in docs) {
            temp_docs.push({
                id: docs[key][0],
                messages: docs[key][1].messages
            });
        }
        resolve(temp_docs);
    });
}

/* function for analyzing list of up to 50 messages at a time */
function analyze(messages) {
    var toneChatParams = {
        utterances: messages
    };
    return new Promise((resolve, reject) => {
        toneAnalyzer.toneChat(toneChatParams, function (error, analysis) {
            if (error) {
                reject(error);
            } else {
                resolve(analysis.utterances_tone);
                console.log(analysis.utterances_tone);
            }
        }); 0;
    });
}

module.exports = router;
