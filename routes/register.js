const express = require('express');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const db = require('../db/connetion');
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
    if(tmpPwd===''||tmpEmail==='')
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
                db.query('insert into Users (PW,EMAIL,AUTHKEY) values (?,?,?)',[tmpPwd,tmpEmail,authkey]);
                res.send('<script type="text/javascript">alert("회원가입 성공!ヾ|๑╹◡╹๑|ﾉ");window.location.href="/login";</script>');
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'minjong5054@gmail.com', 
                        pass: 'pj83918332'
                    }
                });
                const mailOptions = {
                    from: '2NfU',
                    to: tmpEmail ,
                    subject: '2NfU 인증',
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
}).get('/',(req,res) => {
    res.render('register.ejs');
})

module.exports = router;
