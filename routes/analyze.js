var express = require('express');
var router = express.Router();
var request = require('request');

// on load, analyze and redirect to home again 
var db = firebase.firestore();


router.get('/', (req, res, next) => {
    utterances = [
        {
            text: "I hate how BMO banks are like always full, and their service is so crap! I'm so glad I get to move to the XYZ Group bank soon when they open near me!",
            user: "customer"
        },
        {
            text: "Trying to pay CRA source deductions. Link on CRA page to pay from BMO account through interact online hasn't worked for days. Any idea of issue is BMO or CRA?",
            user: "agent"
        },
        {
            text: "Amazing energy & ideas coming from our LowerCap-Caulfeild joint strategy session! A fantastic way to kick off the 2nd half with entire team including branch, Commercial, Nesbitt, Private Bank and SSG - All Working together to make this new joint branch model a success!",
            user: "customer"
        },
        {
            text: "Sorry to hear that.",
            user: "agent"
        }
    ]

    var toneChatParams = {
        utterances: utterances
    };

    toneAnalyzer.toneChat(toneChatParams, function (error, analysis) {
        if (error) {
            console.log(error);
        } else {
            console.log(JSON.stringify(analysis, null, 2));
        }
    }); 0;

});



module.exports = router;
