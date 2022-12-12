const express = require('express');
const formData = require('express-form-data');  
const service =  require('./routes/api/service');
let cors = require("cors");
const config = require('./config');




//Initialize Express
const app = express(); 

// configure cors before starting http, https server

app.use(cors());
app.use(handleCORSRequests);


// Init Middleware
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse())

//Define Routes
app.use('/api/service', service);

const PORT = config.expressServerPort || 5000;

app.listen(PORT, () => console.group(`Express Server Started On ${PORT}`));

// add header parameters to every request object
function handleCORSRequests(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With, content-type, Authorization"
    );
    next();
}