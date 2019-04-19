const express = require('express');
const db = require('../db/connetion');
const crypto = require('crypto');
const moment = require('moment');
const router = express.Router();

router.post('/',(req,res)=>{
    const id = req.body.email;
    var tmpPw = req.body.pw;
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const pw = crypto.createHash('sha512').update(tmpPw).digest('base64');
    const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    db.query('select * from Users where EMAIL = ? and PW = ?' , [id,pw], (err, result) => {
		if (err) throw err;
        if(result.length === 0){
            res.send('<script type="text/javascript">alert("로그인 실패!");window.location.href="/"</script>');
            console.log(time+': '+id + ' 로그인 실패 - '+ip);
        }
        else {
            req.session.flag = 1;
            req.session.user = id;
            req.session.save(() => {
                console.log(time+ ': '+id + ' 로그인 성공 - '+ ip);
                res.send('<script type="text/javascript">alert("로그인 성공!");window.location.href = "/";</script>');
			})
        }
    })
})

.get('/',(req,res) => {
    res.render('login.ejs');
})

module.exports = router;
