const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); //express에서 제공되는 모듈
const config = require('./config/dev');
const { auth } = require('./middleware/auth')
const { User } = require('./models/User');



//데이터를 parse 해서 import
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jihye:abcd1234@boilerplate.mhde1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'/*config.mongo_URI*/, {}).then(() => console.log(`MongoDB Connedted...`))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('hi!'))


//회원가입 route
app.post('/api/users/register', (req, res) => {
    //회원 가입 시에 필요한 정보를 client에서 가져와 db에 넣음
    const user = new User(req.body)//body-parser가 있어서 사용가능
    //    console.log(req.body)
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

//로그인 route
app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, userInfo) => { //몽고db 관련 메소드
        if (!userInfo) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 지 확인
        User.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
            //비밀번호까지 맞다면 토큰을 생성한다
            User.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userID: user._id })
            })
        })
    })
})

app.get('/api/users/auth', (req, res) => {

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))