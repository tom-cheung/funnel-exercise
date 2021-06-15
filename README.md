# Satellite Altitude Monitoring API 

This API is used to track the health Funnel Leasing's satellite through monitoring of altitude data provided by the satellite's own [API](nestio.space/api/satellite/data). This API exposes two end-points. 

* `http://localhost:3000/api/health` - this endpoint warns if the average altitude of the satellite drops below 160KM, reports if the average altitude returns to at least 160KM, and otherwise reports that the altitude is OK. Data is returned as JSON. 

```javascript 
    {
        health: "Altitude is A-OK"
    }
```

* `http://localhost:3000/api/stats` - this endpoint reports the maximum, minimum, and average altitude of the satellite over the last 5 minute period. Data is returned as JSON 

```javascript
    {
        minimum_altitude_in_km: 130.8570264453636,
        maximum_altitude_in_km: 183.59951466436888,
        average_altitude_in_km: 156.7028635882785,
        time: "Last 5 minute(s)"
    }
```

Also included is a testing file for the API. 

## Environment and Dependencies 

* Node 14.3.0

### API 

* express 5.17.1
* axios 0.21.1

### Testing 

* chai 4.3.4
* chai-http 4.3.0
* mocha 9.0.0

## Usage 

This application requires Node. 

Clone this repository https://github.com/tom-cheung/funnel-exercise.git. For the API, cd into the nestio_api directory and run `npm install`. Once the dependencies have been installed run `npm run start-server` to start up the local server which exposes the following end-points, 

* `http://localhost:3000/api/health` - for the satellite altitude health data  
* `http://localhost:3000/api/stats` - for the satellite altitude data over the past 5 minutes 

For testing, once this repository has been cloned, cd into the test_nestio_api directory and run `npm install`. Once the dependencies have been installed run `npm run mocha-test` to run the tests on the API. 
