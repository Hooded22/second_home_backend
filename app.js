const express = require('express');
require('dotenv/config');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//ROUTES
app.get('/', (req, res) => {
	res.send('We are on home');
});

module.exports = app;
