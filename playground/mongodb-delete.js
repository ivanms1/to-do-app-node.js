//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err, db) => {
	if(err) return console.log('Unable to connect to MongoDB server');
	console.log('Connected to MongoDB server');

	db.collection('Users').findOneAndDelete({_id: ObjectId("5add94a0768f5c2058daac5d")})
	.then((res) => console.log(res))

	db.close();
});