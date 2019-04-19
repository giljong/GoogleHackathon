const express = require('express');
const nodemailer = require('nodemailer');
const db = require('../db/connetion');
const router = express.Router();
const moment = require('moment');
const randomstring = require('randomstring');

router.get('/', (req,res) => {
    if((req.session.user !== undefined) && req.session.flag === 0){
        res.render('auth.ejs',{
            id : req.session.user
        });
    }
    else
        res.redirect('/');
})
.post('/', (req,res) => {
    if(req.session.user === undefined)
        res.redirect('/');
    if(req.session.flag === 1){
        res.redirect('/');
    }
    else{
        const key = req.body.key; 
        const email = req.body.email;
        const time = moment().format('MMMM Do YYYY, h:mm:ss a');
        const ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        if(!(req.body.key===undefined)){
            db.query('select AUTHKEY from Users where email = ?',req.session.user,(err,result) => {
                if(err) console.log(err);
                if((key === result[0].AUTHKEY)){
                    db.query('update Users set FLAG=1 where email = ?',req.session.user);
                    req.session.flag = 1;
                    req.session.save(() => {
                        res.send('<script type="text/javascript">alert("인증성공!(๑′ᴗ‵๑)");window.location.href="/";</script>');
                        console.log(time+':'+req.session.user+' 인증성공 - '+ip)
                    })
                }
                else{
                    res.send('<script type="text/javascript">alert("인증실패!(ꐦ°д°)");window.location.href="auth";</script>');
                    console.log(time+':'+req.session.user+' 인증실패 - ' + ip);
                }
            })
        }
        else{
            db.query('select * from Users where EMAIL = ?',req.body.email,(err,result) => {
                if(err) console.log(err);
                if(!(result.length === 0))
                es.send('<script type="text/javascript">alert("중복되는 이메일이에요!(ノ ̿ ̿ᴥ ̿ ̿)ノ");window.location.href="auth";</script>');
                else{
                    const authkey = randomstring.generate();
                    db.query('update Users set AUTHKEY = ?, EMAIL = ? where ID = ?',[authkey,email,req.session.user]);
                    res.send('<script type="text/javascript">alert("인증메일을 다시 보냈어요!(●•̀ ω •́●)");window.location.href="auth";</script>');
                    const transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'minjong5054@gmail,com', 
                            pass: 'pj83918332'
                        }
                    });
                    const mailOptions = {
                        from: '2NfU',
                        to: email ,
                        subject: '2NfU 인증',
                        text: '가입완료를 위해 <'+authkey+'> 를 입력해주세요'
                    };
                    transporter.sendMail(mailOptions, (err, response) => {
                        if(err)
                            console.log(err);
                        else{
                            console.log(response,time+'-'+ip);
                        }   
                    })
                }
            })
        }
    }
})


module.exports = router;
