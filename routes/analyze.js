var express = require('express');
var router = express.Router();
var request = require('request');
var auto_res_lib_changed = false; // need to pull the list again?
var auto_res_lib; // get auto-responses from here

// on load, analyze and redirect to home again 
var auto_res_lib_changed = false; // need to pull the list again?
var auto_res_lib; // get auto-responses from here
router.get('/', (req, res, next) => {
    res.redirect('/dashboard');
});

/* Get the sentiment_colors json object*/
router.post('/get_colors', (req, res, next) => {
    // send only colors for sentiments that are used
    var colors_used = {};
    for (var key in sentiments_used) {
        colors_used[sentiments_used[key]] = sentiment_colors[sentiments_used[key]];
    }
    res.send(colors_used);
});

/* Analyze a single message (used for demo) */
router.post('/analyze_single', (req, res, next) => {
    var message = req.body.message;
    analyze([{ text: message }]).then(result => getAutoResponse(result[0])).then(message => {
        res.send(message); // send back the message
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
    // get the list of responses
    db.collection('responses').doc(id).get().then(doc => {
        // modify the list by removing that index
        var messages = doc.data().messages;
        messages.splice(ind, 1);
        // update the firestore document with new list
        db.collection('responses').doc(id).update({ messages: messages })
            .then(() => {
                auto_res_lib_changed = true; // mark the change
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
                auto_res_lib_changed = true; // mark the change
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

                auto_res_lib_changed = true; // mark the change

                res.send(true);
            }).catch(() => {
                res.send(false);
            });
    });
});

/* Request to start analysis on the 50 messages from twitter */
router.post('/start_mass_analysis', (req, res, next) => {
    // analyze the messages
    // for demo purposes, get this list by calling the function
    getMessages('twitter', 50).then(analyze).then(tones => {
        for (var key in tones) {
            // for each tone detected
            // get the message
            // getAutoResponse(tones[key]).then().catch()

            // analyze data

        }
    });

    // for each message, get the response

    // for each message, respond back


});



function saveAnalysis(tones) {
    // save the tone count for display
    for (var key in tones) {
        let tone = tones[key];
        sentiments_count[tone.tone_id]++; // increment the count
    }
}

/*  */
function getMessages(source, count) {
    return new Promise((resolve, reject) => {
        resolve(twitter_data);
    });
}

router.post('/get_twitter_mesage', (req, res, next) => {

});

/* helper function for getting all saved responses */
function getSavedResponses() {
    return new Promise(async (resolve, reject) => {
        if (auto_res_lib && !auto_res_lib_changed) {
            resolve(auto_res_lib);
        } else {
            var querySnapshot = await db.collection("responses").get();
            var docs = await querySnapshot.docs.map(doc => [doc.id, doc.data()]);
            if (!docs) reject("error"); // could not get data
            var temp_docs = [];
            for (var key in docs) {
                temp_docs.push({
                    id: docs[key][0],
                    messages: docs[key][1].messages
                });
            }
            auto_res_lib = temp_docs;
            auto_res_lib_changed = false; // auto responses updated to latest
            resolve(temp_docs);
        }
    });
}

/* analyze a list of up to 50 messages at a time */
function analyze(messages) {
    var toneChatParams = { utterances: messages };
    return new Promise((resolve, reject) => {
        toneAnalyzer.toneChat(toneChatParams, function (error, analysis) {
            if (error) {
                reject(error);
            } else {
                resolve(analysis.utterances_tone);
            }
        }); 0;
    });
}

/* Get an automatic response for a single message */
function getAutoResponse(results) {
    return new Promise((resolve, reject) => {
        getSavedResponses().then(responses => {
            // get and sort the tones
            var tones = results.tones;
            tones = tones.sort((a, b) => {
                if (a.score < b.score) {
                    return -1;
                } else if (a.score > b.score) {
                    return 1;
                } else {
                    return 0;
                }
            });
            var response_str = ""; // the string to buld up then return
            // for each tone found, build the response string
            for (var i in tones) {
                var tone = tones[i].tone_id;

                var tone_response = responses.filter(obj => {
                    return obj.id === tone;
                });
                tone_response = tone_response[0].messages;
                // tone_response is a list of possible messages. Pick one at random
                var random_ind = getRandomInt(0, tone_response.length - 1);
                response_str += tone_response[random_ind] + ". ";
            }
            resolve(response_str);
        }).catch(reject);
    });
}

/* inclusive random */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
Given the analysis results, respond with the appropriate combination of
auto-responses.
*/
function respond(results) {

}

module.exports = router;
