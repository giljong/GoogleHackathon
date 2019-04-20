//기자 등록
const express = require('express');
const db = require('../db/connetion');
const router = express.Router();

router.get('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1)
        res.render('addrp.ejs');
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
})
.post('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('select * from Reporter where USER = ?',req.session.user,(err,result) => {
            if(err) console.log(err);
            if(result.length !== 0)
                res.send('<script type="text/javascript">alert("이미 기자로 등록된 사용자입니다.");window.location.href="/";</script>');
            else{
                db.query('select * from Gr where GRNAME = ?',req.body.grname,(error,results) => {
                    if(error) console.log(error);
                    if(results.length === 0)
                        res.send('<script type="text/javascript">alert("등록되어 있지 않은 언론사입니다.");window.location.href="/grenroll";</script>');
                    else{
                        db.query('insert into Reporter (USER,GRNAME) values(?,?)',[req.session.user,req.body.grname]);
                        res.send('<script type="text/javascript">alert("기자등록을 완료했습니다.");window.location.href="/";</script>');
                    }
                })
            }
        })
    }
})

module.exports = router;