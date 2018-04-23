//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/Todoapp', (err, db) => {
	if(err) return console.log('Unable to connect to MongoDB server');
	console.log('Connected to MongoDB server');

	/*db.collection('Todos').find({ _id: new ObjectId('5ac0e1e891e8df225c5ac5b0') }).toArray((err, docs) => {
		if(err === null){
			return console.log(docs)
		}
		else console.log(err)
	});*/

	db.collection('Users').find({name: 'Eun Jung'}).toArray((err, docs) => {
		if(err === null){
			return console.log(docs)
		}
		else console.log(err)
	});

	db.close();
});