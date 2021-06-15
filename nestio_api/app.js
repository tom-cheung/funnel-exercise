const express = require("express"); 
const app = express(); 
const nestio_api = require("./util/nestio_api");
const stats = require("./routes/stats");
const health = require("./routes/health");

let port = process.env.PORT;

if(port == null || port == "") {
    port = 3000;
}

app.listen(port, () => console.log(`server is running on port ${port}`));

app.get("/", (req, res) => res.status(200).send("Server is live!"));
app.get("/api", (req, res) => res.status(200).send("Available endpoints: /api/stats && /api/health"));
app.use('/api', stats); 
app.use('/api', health);

