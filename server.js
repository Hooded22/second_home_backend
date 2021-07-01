const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(
	process.env.DB_CONNECTION,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	},
	(err) => errorHandler(err)
);

function errorHandler(err) {
	if (err) {
		console.log('ERROR: ', err);
	} else {
		console.log('Connected to DB');
	}
}

app.listen(3000);
