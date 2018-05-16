const expect = require('expect');
const request = require('supertest');
const { ObjectId } = require('mongodb');


const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
		.get('/users/me')
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((res) => {
			expect(res.body._id).toBe(users[0]._id.toHexString());
			expect(res.body.email).toBe(users[0].email);
		})
		.end(done);
	});

	it('should return a 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((res) => {
			expect(res.body).toEqual({});
		})
		.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		let email = 'example@example.com';
		let password = '123abc';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist();
			expect(res.body._id).toExist();
			expect(res.body.email).toBe(email);
		})
		.end((err) => {
			if(err) return done(err);
			User.findOne({email})
			.then((user)=> {
				expect(user).toExist();
				expect(user.password).toNotBe(password);
				done()
			})
			.catch((err) => done(err));
		});
	});

	it('should return validation error if request invalid', (done) => {
		let email = '1234asdf';
		let password = 'qwer';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done)
	});

	it('should not create if email already in use', (done) => {
		let email = 'ivan@example.com';
		let password = 'qwerty1234';

		request(app)
		.post('/users')
		.send({email, password})
		.expect(400)
		.end(done)
	});
});

describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: users[1].password
			})
		.expect(200)
		.expect((res) => {
			expect(res.headers['x-auth']).toExist();
		})
		.end((err, res) => {
			if(err) return done(err);

			User.findById(users[1]._id)
			.then((user) => {
				expect(user.tokens[0]).toInclude({
					access: 'auth',
					token: res.headers['x-auth']
				})
				done()
			})
			.catch((err) => done(err));
		});
	});

	it('should reject invalid login', (done) => {
		request(app)
		.post('/users/login')
		.send({
			email: users[1].email,
			password: 'invalid'
			})
		.expect(400)
		.expect((res) => {
			expect(res.headers['x-auth']).toNotExist();
		})
		.end((err, res) => {
			if(err) return done(err);

			User.findById(users[1]._id)
			.then((user) => {
				expect(user.tokens.length).toBe(0);
				done()
			})
			.catch((err) => done(err));
		});
	})
})