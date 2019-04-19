const express = require('express');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const db = require('../db/connection');
const crypto = require('crypto');
const router = express.Router();

router.post('/',(req,res) => {
    const pw = req.body.pw;
    const tmpEmail = req.body.email;
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    const tmpPwd = crypto.createHash('sha512').update(pw).digest('base64');
    if(tmpId===''||tmpPwd===''||tmpEmail===''||tmpSchool === ''||tmpGrade === '')
        res.send('<script type="text/javascript">alert("입력되지 않은 값이 있습니다.");window.location.href="/register";</script>');
    else if(pw.length<8||pw.length>20)
        res.send('<script type="text/javascript">alert("패스워드의 길이가 맞지 않습니다.");window.location.href="/register";</script>');
    else if(pw.indexOf(' ') !== -1){
        res.send('<script type="text/javascript">alert("비밀번호에는 공백이 들어갈 수 없습니다.");window.location.href="/register";</script>');
    }
    else{
        db.query('select * from Users where EMAIL = ?', tmpEmail, (err, result) => {
			if(err) console.error(err);
			if(!(result.length===0))
                res.send('<script type="text/javascript">alert("중복되는 아이디에요!(•⊙ω⊙•)");window.location.href="/register";</script>');
            else{
                const authkey = randomstring.generate();
                db.query('insert into Users (ID,PW,EMAIL,SCHOOL,AUTHKEY,GRADE) values (?,?,?,?,?,?)',[tmpId,tmpPwd,tmpEmail,tmpSchool,authkey,tmpGrade]);
                res.send('<script type="text/javascript">alert("회원가입 성공!ヾ|๑╹◡╹๑|ﾉ");window.location.href="/";</script>');
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'teamlogsr@gmail.com', 
                        pass: 'teamlogzzang2017'
                    }
                });
                const mailOptions = {
                    from: 'teamlogsr@gmail.com',
                    to: tmpEmail ,
                    subject: 'LOGCON 인증',
                    text: '가입완료를 위해 <'+authkey+'> 를 입력해주세요'
                };
                transporter.sendMail(mailOptions, (err, response) => {
                    if(err)
                        console.log(err);  
                    else
                        console.log(response,time + ' - '+ ip ); 
                })   
            }
        })
    }
})

module.exports = router;
