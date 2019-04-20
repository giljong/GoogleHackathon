//익명편지 주고받기
const express = require('express');
const db = require('../db/connetion');
const router = express.Router();

router.get('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('select TITLE,ID from MAIL where fromuser = ?',req.session.user,(err,result) => {
            if(err) console.log(err);
            res.render('mypage.ejs',{
                info : result
            })
        })
    }
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
}).get('/:num',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('select TITLE,CONTENTS,ID,FROMUSER from MAIL where id = ?',req.params.num,(err,result) => {
            if(err) console.log(err);
            from = result[0].fromuser;
            title = result[0].title + "에 대한 답장"
            res.render('viewmail.ejs',{
                info : result
            })
        })
    }
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
}).post('/:num/edit',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('insert into Mail (title,contents,fromuser,touser) values (?,?,?,?)',[title,req.body.contents,req.session.user,from]);  
        res.send('<script type="text/javascript">alert("메일발송완료");window.location.href="/";</script>') 
    }
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
}).get('/:num/edit',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        res.render('wrmail.ejs');
    }
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
})

module.exports = router;