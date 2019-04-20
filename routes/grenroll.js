//기자 등록
const express = require('express');
const db = require('../db/connetion');
const router = express.Router();

router.get('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1)
        res.render('addgroup.ejs');
    else if(req.session.flag === 0 && req.session.user !== undefined)
        res.redirect('/auth');
    else
        res.redirect('/');
})
.post('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 1){
        db.query('select * from Gr where GRNAME = ?',req.body.grname,(err,result) => {
            if(err) console.log(err);
            if(result.length!==0)
                res.send('<script type="text/javascript">alert("이미 등록된 언론사입니다.");window.location.href="/";</script>');
            else{
                db.query('insert into Gr (GRNAME,GRURL,CEO) values (?,?,?)',[req.body.grname,req.body.grurl,req.session.user]);
                res.send('<script type="text/javascript">alert("언론사 등록이 완료되었습니다.");window.location.href="/";</script>')
            }
        })
    }
    else if(req.session.flag)
        res.redirect('/auth');
    else
        res.redirect('/');
})

module.exports = router;