const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const path = require('path');
const crypto = require('crypto');

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
    console.log(JSON.stringify(todos))
    res.json(todos)
})

app.post('/todos/create-with-file', upload.single('File'), createHandler);

function createHandler(req, res) {
    console.log('create request: ', req.body)
    todos = [{
        name: req.body.name,
        desc: req.body.desc,
        done: false,
        id: Math.random() + '',
        created: Date.now(),
        updated: null
    }, ...todos]
    res.json(todos)
}

app.post('/todos/complete', function (req, res) {
    console.log('complete request: ', req.body)
    todos = todos.map(todo => todo.id === req.body.id ? ({...todo, done: !todo.done, updated: Date.now()}) : todo)
    res.json(todos)
})

app.post('/todos/delete', function (req, res) {
    console.log('delete request: ', req.body)
    todos = todos.filter(todo => todo.id !== req.body.id)
    res.json(todos)
})

app.post('/todos/clear-completed', function (req, res) {
    console.log('clear completed request: ', req.body)
    todos = todos.filter(todo => !todo.done)
    res.json(todos)
})


app.listen(8080)