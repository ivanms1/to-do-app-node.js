//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err, db) => {
	if(err) return console.log('Unable to connect to MongoDB server');
	console.log('Connected to MongoDB server');

	db.collection('Todos').deleteMany({text: 'Walk the dog'})
	.then((res) => console.log(res.deletedCount))

	db.close();
});