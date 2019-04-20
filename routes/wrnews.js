//기사 작성
const express = require('express');
const db = require('../db/connetion');
const router = express.Router();

router.get('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('select * from Reporter where user = ?',req.session.user,(err,result) => {
            if(err) console.log(err);
            if(result.length === 0){
                res.send('<script type="text/javascript">alert("일반사용자는 기사를 작성할 수 없습니다.");window.location.href="/";</script>');
            }
            else{
                res.render('wrnews.ejs');
            }
        })
    }
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
}).post('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('select * from Reporter where user = ?',req.session.user,(err,result) => {
            if(err) console.log(err);
            if(result.length === 0){
                res.send('<script type="text/javascript">alert("일반사용자는 기사를 작성할 수 없습니다.");window.location.href="/";</script>');
            }
            else{
                db.query('insert into News (TITLE,CONTENTS,USER,CATEGORIZE,GRNAME) values(?,?,?,?,?)',[req.body.title,req.body.contents,req.session.user,req.body.categorize,result[0].GRNAME]);
                res.redirect('/');
            }
        })
    }
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
})

module.exports = router;