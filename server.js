const express = require('express');
const formData = require('express-form-data');  
const service =  require('./routes/api/service');


//Initialize Express
const app = express(); 


// Init Middleware
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse())

//Define Routes
app.use('/api/service', service);

// const PORT = config.expressServerPort || 5000;

const PORT = 5000;

app.listen(PORT, () => console.group(`Express Server Started On ${PORT}`));

