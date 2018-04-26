const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
	Todo.find()
	.then((todos) => {
		res.send({todos})
	}, (err) => {
		res.status(400).send(err);
	})
});

app.get('/todos/:id', (req, res) => {
	let id = req.params.id;

	if(!ObjectId.isValid(id)) {
		return res.status(400).send() 
	}

	Todo.findById(id)
	.then((todo) => {
		if(!todo) return res.status(404).send({});
		res.send({todo})
	})
	.catch((err) => res.status(400).send({}))
});

app.delete('/todos/:id', (req, res) => {
	let id = req.params.id;

	if(!ObjectId.isValid(id)) {
		return res.status(400).send('Id is invalid') 
	}

	Todo.findByIdAndRemove(id)
	.then((todo) => {
		if(!todo) return res.status(404).send('todo not found');
		return res.send({todo})
	})
	.catch((err) => res.status(404).send());

})

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

module.exports = { app }