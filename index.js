const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key')

//데이터를 parse 해서 import
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {}).then(() => console.log(`MongoDB Connedted...`))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hi!'))

//회원가입을 위한 route
app.post('/register', (req, res) => {
    //회원 가입 시에 필요한 정보를 client에서 가져와 db에 넣음
    const user = new User(req.body)//body-parser가 있어서 사용가능

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))