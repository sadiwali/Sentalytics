var express = require('express');
var router = express.Router();
var request = require('request');

// on load, analyze and redirect to home again 
var db = firebase.firestore();

/* GET home page. */
router.get('/', function (req, res, next) {
    async () => {
        let comments = await db.collection("comments").get()
            .comments.map(doc => [doc.id, doc.data()]);

        let responses = await db.collection("responses").get()
            .comments.map(doc => [doc.id, doc.data()]);

        // have all the documents
        for (let j = 0; j < comments.length; j++) {
            // for all documents, analyze each one
            let doc = comments[j];

            let message = doc[1].message; // get the message to analyze
            let uid = doc[0]; // the id of message

            // analyze it 
            let res = await analyze(doc[0], message);

            for (let i = 0; i < res.length; i++) {
                // for all tones in the result, add values to the list

                sentiments[res[i].tone_id].push(1);
            }
        }

        console.log(sentiments);
        // al documents analyzed
        // set averages and return to index
        for (let key in sentiments) {
            let avg = 0;
            for (let i = 0; i < sentiments[key].length; i++) {
                avg += sentiments[key][i];
            }
            // avg /= sentiments[key].length
            sentiment_avgs[key] = avg; // save the averages
        }
        // send back to index
        res.redirect('/');
    }
});

function analyze(uid, what) {
    return new Promise((resolve, reject) => {
        request.post("https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-09-21", {
            json: { text: what }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                // do the message sending inline with analysis
                handleMessage(uid, body.document_tone.tones, what); 
                resolve(body.document_tone.tones);
            } else if (error) {
                reject(error);
            }
        }).auth(credentials.watson.username, credentials.watson.password, false);
    });
}

// find what message to send
async function handleMessage(uid, tones, message) {
    // have all messages we could send in comments

    let sorted_tones = tones.sort((a, b) => {
        if (a.score < b.score) {
            return 1;
        } else if (a.score > b.score) {
            return -1;
        } else {
            return 0;
        }
    });

    let response_str = ""; // this is the automated response.
    for (let j = 0; j < sorted_tones.length; j++) {
        // starting from the most sure, build the response

        let val = sorted_tones[j]; // get the current tone we are considering

        if (val.score > 0.60) { // sureness must be above this level to be included in message

            // find the message for the tone
            for (let i = 0; i < comments_b.length; i++) {
                if (comments_b[i][0] == val.tone_id) {
                    response_str += comments_b[i][1].message + ' '; // build the response, add a space for next
                    break;
                }
            }
        }
    }

    console.log(message, sorted_tones, response_str);
    // now that we have the message, atually respond, (update firebase)
    respond(uid, response_str);
}

// actually send the message
function respond(uid, message) {
    // work on this function for replying to each media
    db.collection('comments').doc(uid).set({
        response: message
    }, { merge: true });
}


module.exports = router;
