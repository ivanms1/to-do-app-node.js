const { ObjectId } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

//let id = '5ae0625d9eb8ce2c23b06878';

let id = '5adf20dbc74f602007010e81';

/*if(!ObjectId.isValid(id)) {
	console.log('Id is not valid');
}*/

/*Todo.find({
	_id: id
})
.then((docs) => console.log(docs));

Todo.findOne({
	_id: id
})
.then((doc) => {
	if(!doc) return console.log('Id not found')
	console.log(doc)
});*/

/*Todo.findById(id)
.then((doc) => {
	if(!doc) return console.log('Id not found')
	console.log('Find by Id', doc)
})
.catch((err) => console.log(err.message));*/

User.findById(id)
.then((doc) =>{
	if(!doc) return console.log('Id not found');
	console.log(doc)
})
.catch((err) => console.log(err.message));