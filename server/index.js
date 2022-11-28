const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const  storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})

const upload = multer({ storage })
const app = express()


app.use(cors())
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('<h1>Hello World</h1>')
})

let todos = []

app.get('/todos', function (req, res) {
    res.json(todos)
})

app.post('/todos/create-with-file', upload.single('File'), (req, res) => {
    todos = [{
        name: req.body.name,
        desc: req.body.desc,
        untilDate: req.body.untilDate,
        fileName: req.file?.filename,
        origName: req.file?.originalname,
        done: false,
        id: Math.random() + '',
        created: Date.now(),
        updated: null,
        completed: null
    }, ...todos]
    res.json(todos)
});


app.post('/todos/edit', upload.single('File'), function (req, res) {
    todos = todos.map(todo => todo.id === req.body.id ? ({
        ...todo,
        name: req.body.name,
        desc: req.body.desc,
        untilDate: req.body.untilDate,
        fileName: req.file?.filename || todo.fileName,
        origName: req.file?.originalname,
        updated: new Date().toISOString(),
    }) : todo)
    res.json(todos)
})

app.get('/todos/files/:id', function (req, res) {
    const todo = todos.find(t => t.id === req.params.id);
    res.sendFile(path.resolve(__dirname, '../uploads/') + '/' + todo.fileName)
})

app.post('/todos/complete', function (req, res) {
    todos = todos.map(todo => todo.id === req.body.id ? ({
        ...todo,
        done: !todo.done,
        completed: !todo.done ? new Date().toISOString() : null,
        updated: new Date().toISOString(),
    }) : todo)
    res.json(todos)
})

app.post('/todos/delete', function (req, res) {
    todos = todos.filter(todo => todo.id !== req.body.id)
    res.json(todos)
})

app.post('/todos/clear-completed', function (req, res) {
    todos = todos.filter(todo => !todo.done)
    res.json(todos)
})


app.listen(8080)