const express = require("express");
const router = express.Router(); 
const responses = require("../util/nestio_api");

router.get('/health', (req, res) => {
    if(responses.error) {
        res.status(400).json({
            error: "could not reach satellite api"
        })
    } else {
        if(responses.altitudeData.length > 6) {

            // calculate average altitude for the last minute
            let minSum = 0; 
            for(let i = responses.altitudeData.length - 6; i < responses.altitudeData.length; i++) {
                minSum += responses.altitudeData[i]; 
            }
            let minAvg = minSum / 6; 

            // render conditions
            if(minAvg < 160) {
                responses.counter = 6; 
                res.status(200).json({
                    health: "WARNING: RAPID ORBITAL DECAY IMMINENT", 
                })
            } else if(minAvg >= 160 && responses.counter > 0) {
                res.status(200).json({
                    health: "Sustained Low EarthOrbit Resumed"
                })
            } else {
                res.status(200).json({
                    health: "Altitude is A-OK"
                })
            }
        } else {
            // render for when data is available for < 1 minute
            res.status(200).json({
                health: "Altitude is A-OK",
            })
        }
    }   
})

module.exports = router;
