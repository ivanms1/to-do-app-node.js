const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

const users = [{
	_id: userOneId,
	email: 'ivan@example.com',
	password: '123abc',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
	}]

	}, {
	_id: userTwoId,
	email: 'eun@example.com',
	password: '123abc'
	}]

const todos = [
	{
		_id: new ObjectId,
		text: 'first test'
	},
	{
		_id: new ObjectId,
		text: 'second test',
		completed: true,
		completedAt: 101010
	}
	];

const populateTodos= (done) => {
	Todo.remove({})
	.then(() => {
		return Todo.insertMany(todos);
	})
	.then(() => done());
};

const populateUsers = (done) => {
	User.remove({})
	.then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers }