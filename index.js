const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jihye:abcd1234@boilerplate.mhde1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {}).then(() => console.log(`MongoDB Connedted...`))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))