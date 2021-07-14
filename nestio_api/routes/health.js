const { response } = require("express");
const express = require("express");
const router = express.Router(); 
const responses = require("../util/nestio_api");

router.get('/health', (req, res) => {
    if(responses.error) {
        res.status(400).json({
            error: "could not reach satellite api"
        })
    } else {
        if(responses.time > 1) {

            let currentTime = responses.altitudeData[responses.altitudeData.length - 1][0];
            let prevTime = currentTime - (1 * 60 * 1000);
            let minSum = 0; 
            let count = 0; 

            for(let i = responses.altitudeData.length - 1; i >= 0; i--) {
                minSum += responses.altitudeData[i][1]
                count++; 
                if(responses.altitudeData[i][0] === prevTime) {
                    break;
                }; 
            }

            let minAvg = minSum / count; 

            // render conditions
            if(minAvg < 160) {
                responses.recovering = currentTime + (1 * 60 * 1000); // sets a window to render the "sustained low earth orbit resumed" message
                res.status(200).json({
                    health: "WARNING: RAPID ORBITAL DECAY IMMINENT", 
                })
            } else if(minAvg >= 160 && currentTime <= responses.recovering) {
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
