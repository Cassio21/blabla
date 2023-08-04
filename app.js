require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

const port = process.env.PORT;

//* CONFING THE JSON AND FORM DATA RESPONSE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//*CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

//* UPLOAD DIRECTORY
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

//* DB COLLECTION
require('./config/db.js');

//* ROUTES
const router = require('./routes/Router.js');
app.use(router);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
