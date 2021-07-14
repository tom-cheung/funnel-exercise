const axios = require('axios');
const URL = require('./url')

let responses = {
    altitudeData: [], 
    minimum: Infinity, 
    maximum: -Infinity, 
    sum: 0,
    average: 0,
    time: null,
    recovering: 0, 
    error: false,
}

let timeStamp = null;
let fiveMinuteTarget = null;  
let fiveMinuteReached = false; 
let timeoutInterval = 1000;

async function call_nestio() {
    let response = await axios.get(URL.URL);

    if(response.status === 200) {

        responses.error = false; 
        let milliseconds = Date.parse(new Date(response.data.last_updated))

        // set a target for 5 minutes 
        if(!fiveMinuteTarget) {
            fiveMinuteTarget = milliseconds + (5 * 60 * 1000);
        } 

        // once the 5 minute target has been reached, set fiveMinuteReached to true; 
        // used to control how many data points are being recorded. 
        if(milliseconds === fiveMinuteTarget && !fiveMinuteReached) {
            console.log('hit five minutes')
            fiveMinuteReached = true; 
        }

        // use the timestamp to collect unique altitude data based on time 
        if(!timeStamp) {
            timeStamp = milliseconds;
            responses.altitudeData.push([milliseconds, response.data.altitude]);
            responses.sum += response.data.altitude;
        } else {
            if(milliseconds !== timeStamp) {
                responses.altitudeData.push([milliseconds, response.data.altitude]);
                timeStamp = milliseconds;
                responses.sum += response.data.altitude;
                if(fiveMinuteReached) {
                    responses.sum -= responses.altitudeData.shift()[1];
                }
            }
        }

        responses.average = responses.sum / responses.altitudeData.length; // calculating average 
        let sortedAltitudeData = Array.from(responses.altitudeData).sort((a, b) => a[1] - b[1]); // sort data to obtain minimum and maximum 
        responses.minimum = sortedAltitudeData[0][1];
        responses.maximum = sortedAltitudeData[sortedAltitudeData.length - 1][1];
        // responses.time = `Last ${Math.ceil( (responses.altitudeData[responses.altitudeData.length - 1][0] - responses.altitudeData[0][0]) / 60000)} minute(s)` // calculate minutes, ends at last 5 
        responses.time = Math.ceil( (responses.altitudeData[responses.altitudeData.length - 1][0] - responses.altitudeData[0][0]) / 60000);
        // if(responses.counter > 0) responses.counter--; 
        
    } else {
        responses.error = true; 
        console.log('Error with call to nestio API')
    }

    setTimeout(call_nestio, timeoutInterval);
}

call_nestio(); 

module.exports = responses; 