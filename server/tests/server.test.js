const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

beforeEach((done) => {
	Todo.remove({})
	.then(() => done())
});

describe('POST /todos', () => {

	it('should create a new todo', (done) => {
		let text = 'Hola Test';

		request(app)
		.post('/todos')
		.send({text})
		.expect(200)
		.expect((res) => {
			console.log(res.body);
			expect(res.body.text).toBe(text);
		})
		.end((err, res) => {
			if(err) {
				return done(err)
			}

			Todo.find()
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
				expect(todos.length).toBe(0);
				done();
			}).catch((err) => done(err))
		})
	})
});
