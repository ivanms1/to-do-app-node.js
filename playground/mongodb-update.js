//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err, db) => {
	if(err) return console.log('Unable to connect to MongoDB server');
	console.log('Connected to MongoDB server');

	db.collection('Users').findOneAndUpdate(
		{ _id: ObjectId('5add8692e956b510e098849b') },
		{ $inc: { age: 5 }, $set: { name: "Ivan" } },
		{ returnOriginal:false })
	.then((res) => console.log(res))

	db.close();
});