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

let timeStamp = "";
let fiveMinuteTarget = null;  
let fiveMinuteReached = false; 
let altData = []; 


let timeoutInterval = 1000;
async function call_nestio() {
    let response = await axios.get(URL.URL);

    if(response.status === 200) {
        responses.error = false; 

        let min = new Date(response.data.last_updated).getMinutes();
        let sec = new Date(response.data.last_updated).getSeconds(); 

        // set a target for 5 minutes 
        if(!fiveMinuteTarget) {
            fiveMinuteTarget = [(min + 5) % 60, sec]; 
        } 

        // once the 5 minute target has been reached, set fiveMinuteReached to true; 
        // used to control how many data points are being recorded. 
        if(min === fiveMinuteTarget[0] && sec === fiveMinuteTarget[1]) {
            fiveMinuteReached = true; 
        }

        // use the timestamp to collect unique altitude data based on time 
        if(!timeStamp) {
            timeStamp = response.data.last_updated;
            responses.altitudeData.push(response.data.altitude);
            responses.sum += response.data.altitude;
        } else {
            if(timeStamp !== response.data.last_updated && !fiveMinuteReached) {
                responses.altitudeData.push(response.data.altitude);
                responses.sum += response.data.altitude;
                timeStamp = response.data.last_updated;
            } else if(timeStamp !== response.data.last_updated && fiveMinuteReached) {
                responses.sum -= responses.altitudeData.shift(); 
                responses.altitudeData.push(response.data.altitude);
                responses.sum += response.data.altitude;
                timeStamp = response.data.last_updated;
            }
        }

        responses.average = responses.sum / responses.altitudeData.length; // calculating average 
        let sortedAltitudeData = Array.from(responses.altitudeData).sort(); // sort data to obtain minimum and maximum 
        responses.minimum = sortedAltitudeData[0];
        responses.maximum = sortedAltitudeData[sortedAltitudeData.length - 1]
        responses.time = `Last ${Math.floor((responses.altitudeData.length * 10) / 60)} minute(s)` // calculate minutes, ends at last 5 
        if(responses.counter > 0) responses.counter--; 
        
    } else {
        responses.error = true; 
        console.log('Error with call to nestio API')
    }

    setTimeout(call_nestio, timeoutInterval);
}

call_nestio(); 

module.exports = responses; 