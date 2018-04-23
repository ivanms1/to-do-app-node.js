//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

let obj = new ObjectId();
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err, db) => {
	if(err) return console.log('Unable to connect to MongoDB server');
	console.log('Connected to MongoDB server');

	/*db.collection('Todos').insertOne({
		text: 'Walk the dog',
		completed: false
	}, (err, result) => {
		if(err) return console.log('Unable to insert to do', err);
		console.log(JSON.stringify(result.ops, undefined, 2));
	});
*/
	/*db.collection('Users').insertOne({
		name: 'Ivan',
		age: 28,
		location: 'Chile'
	}, (err, result) => {
		if(err) return console.log('Unable to connect to database', err);
		console.log(JSON.stringify(result.ops, undefined, 2));
	});*/
	db.close();
});