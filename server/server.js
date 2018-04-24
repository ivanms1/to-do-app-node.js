const express = require('express');
const bodyParser = require('body-parser')

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();

app.use(bodyParser.json());

const PORT = 3000;

app.post('/todos', (req, res) => {
	let todo = new Todo({
		text: req.body.text,
	});
	todo.save()
	.then((doc) => {
		res.send(doc);
	},
	(err) => {
		res.status(400).send(err);
	});
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))