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
            minimum_altitude: responses.minimum,
            maximum_altitude: responses.maximum, 
            average_altitude: responses.average, 
            time: responses.time 
        })
    }

})

module.exports = router;