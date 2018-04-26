const { ObjectId } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

/*Todo.remove()
.then((result) => console.log(result));
*/

Todo.findByIdAndRemove('5ae164f842e6155826b8cac5')
.then((todo) => console.log(todo));