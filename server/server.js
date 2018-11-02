//library imports
const express = require('express');
const BodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local requirements
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
const PORT =  process.env.PORT || 3000;

app.use(BodyParser.json());

//this sends data to the database
app.post('/todos', function (req, res) {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then(function (document) {
        res.send(document);
    }).catch(function (err) {
       res.status(400).send(err);
    });
});

//this gets/ fetches data from the database on the /todos route
app.get('/todos', function (req, res) {
    Todo.find().then(function (todos) {
        res.send({
            todos: todos
        });
    }, function (err) {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', function (req, res) {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            res.status(400).send();
        }
        
        res.send({
            todo: todo
        });
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(PORT, function () {
    console.log('Listening on port: ', PORT);
});

module.exports = {
    app: app
};