const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const baseUrl = "http://localhost:3000"; 

chai.use(chaiHttp);

describe("Unit Tests", function() {
    it('server is live', function(done) {
        chai.request(baseUrl)
        .get('/')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.text).to.equal("Server is live!");
            done();
        });
    }),
    it('list endpoints', function(done) {
        chai.request(baseUrl)
        .get('/api')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.text).to.equal("Available endpoints: /api/stats && /api/health");
            done(); 
        });
    }) 
    it('health endpoint', function(done) {
        chai.request(baseUrl)
        .get('/api/health')
        .end(function (err, res) {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("health");
            expect(res.body.health).to.be.oneOf(["WARNING: RAPID ORBITAL DECAY IMMINENT", "Sustained Low EarthOrbit Resumed", "Altitude is A-OK"]);
            done(); 
        });
    })

})