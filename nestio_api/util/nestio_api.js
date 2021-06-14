const axios = require('axios');
const URL = require('./url')

let responses = {
    altitudeData: [], 
    minimum: Infinity, 
    maximum: -Infinity, 
    sum: 0,
    average: 0,
    time: '',
    counter: 0, 
    error: false,
}


async function call_nestio() {
    let response = await axios.get(URL.URL);
    
    if(response.status === 200) {
        responses.error = false; 
        if(responses.altitudeData.length < 30) { // collect only 5 minutes of data 
            responses.altitudeData.push(response.data.altitude);
        } else {
            responses.sum -= responses.altitudeData.shift(); 
            responses.altitudeData.push(response.data.altitude); 
        }

        responses.sum += response.data.altitude; // sum altitude data 
        responses.average = responses.sum / responses.altitudeData.length; // calculating average 
        let sortedAltitudeData = Array.from(responses.altitudeData).sort(); 
        responses.minimum = sortedAltitudeData[0];
        responses.maximum = sortedAltitudeData[sortedAltitudeData.length - 1]
        responses.time = `Last ${Math.floor((responses.altitudeData.length * 10) / 60)} minute(s)` // calculate minutes, ends at last 5 
        if(responses.counter > 0) responses.counter--; 
    } else {
        responses.error = true; 
        console.log('Error with call to nestio API')
    }

    setTimeout(call_nestio, 10000);
}

call_nestio(); 

module.exports = responses; 