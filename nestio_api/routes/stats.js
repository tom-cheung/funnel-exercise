const express = require("express");
const router = express.Router(); 
const responses = require("../util/nestio_api");

router.get('/stats', (req, res) => {
    if(responses.error) {
        res.status(400).json({
            error: "could not reach satellite api"
        })
    } else {
        res.status(200).json({
            minimum_altitude_in_km: responses.minimum,
            maximum_altitude_in_km: responses.maximum, 
            average_altitude_in_km: responses.average, 
            time: `Last ${responses.time} minute(s)` // calculate minutes, ends at 5
        })
    }

})

module.exports = router;