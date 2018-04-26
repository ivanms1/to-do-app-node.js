const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');


const { app } = require('../server');
const { Todo } = require('../models/todo');

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

beforeEach((done) => {
	Todo.remove({})
	.then(() => {
		return Todo.insertMany(todos);
	})
	.then(() => done());
});

describe('POST /todos', () => {

	it('should create a new todo', (done) => {
		let text = 'Hola Test';

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err) {
				return done(err)
			}

			Todo.find({text})
			.then((todos) => {
				expect(todos.length).toBe(1);
				expect(todos[0].text).toBe(text);
				done();
			}).catch((err) => done(err));
		});
	});

	it('should not create to do', (done) => {
		
		request(app)
		.post('/todos')
		.send({})
		.expect(400)
		.end((err, res) => {
			if(err) return done(err);

			Todo.find()
			.then((todos) => {
				expect(todos.length).toBe(2);
				done();
			}).catch((err) => done(err));
		});
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) =>{

		request(app)
		.get('/todos')
		.expect(200)
		.expect((res) => {
			expect(res.body.todos.length).toBe(2);
		})
		.end(done); 
	});
});

describe('GET /todos/:id', () => {
	it('should get an specific todo', (done) => {

		request(app)
		.get(`/todos/${todos[0]._id.toHexString()}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo.text).toBe(todos[0].text);
		})
		.end(done);

	});

	it('should return a 404 if todo not found', (done) => {
		let id = new ObjectId;
		request(app)
		.get(`/todos/${id.toHexString()}`)
		.expect(404)
		.end(done);
	});
	
	it('should return a 404 if invalid id', (done) => {

		request(app)
		.get('/todos/123')
		.expect(400)
		.end(done);
	});

});

describe('DELETE /todos/:id', () => {
	it('should delete todo by id', (done) => {

		let id = todos[0]._id.toHexString();

		request(app)
		.delete(`/todos/${id}`)
		.expect(200)
		.expect((res) => {
			expect(res.body.todo._id).toBe(id);
		})
		.end((err, res) => {
			if(err) return done(err);

			Todo.findById(id)
			.then((todo) => {
				expect(todo).toNotExist();
				done()
			})
			.catch((err) => done(err));
		});

	});

	it('should return 404 if todo not found', (done) => {
		let id = new ObjectId;
		request(app)
		.delete(`/todos/${id.toHexString()}`)
		.expect(404)
		.end(done);
	});

	it('should return 400 if id is invalid', (done) => {
		request(app)
		.delete('/todos/123')
		.expect(400)
		.end(done);
	})
});

describe('PATCH /todos/:id', () => {
	it('should update todo', (done) => {

		let id = todos[0]._id.toHexString();
		let data = { completed: true,
					text: "updated test" };

		request(app)
		.patch(`/todos/${id}`)
		.send(data)
		.expect(200)
		.expect((res) => {
			Todo.findById(id)
			.then((todo) => {
				expect(todo.text).toBe(res.body.todo.text);
				expect(todo.completedAt).toBeA('number');
				done();
			})
		})
		.catch((err) => done(err))

	});

	it('should clear completedAt when completed is false', (done) => {
		let id = todos[1]._id.toHexString();

		request(app)
		.patch(`/todos/${id}`)
		.send({ completed: false, text: "changed to false" })
		.expect(200)
		.expect((res) => {
			Todo.findById(id)
			.then((todo) => {
				expect(todo.text).toBe(res.body.todo.text);
				expect(todo.completedAt).toNotExist();
				done();
			})
		})
		.catch((err) => done(err));
	});
});
