//기사관리
const express = require('express');
const router = express.Router();
const db = require('../db/connetion.js');

router.get('/',(req,res) => {
    if(req.session.user !== undefined && req.session.flag === 0){
      res.redirect('/auth');
    }
    if(req.session.user === undefined){
        res.send('<script type="text/javascript">alert("로그인이 필요한 컨텐츠입니다.");window.location.href="/login";</script>')
    }
    else{
        db.query('select * from Users where AD = 1 and email = ?',req.session.user,(err,result) => {
            if(err) console.log(err)
            if(result !== undefined){
                db.query('select * from News where flag = 1',(error,results) => {
                    if(error) console.log(error);
                    res.render('admin.ejs',{
                        news : results
                    })
                })
            }
            else
                res.send('<script type="text/javascript">alert("일반 사용자는 접근할 수 없습니다.");window.location.href="/"</script>');
        })
    }
})
    .get('/:num/:string',(req,res) => {
        db.query('select * from Voted where id = ? and user = ?',[req.params.num,req.session.user],(err,result) =>{
        if(err) console.log(err);
        if(result.length === 0){
            if(req.params.string ==='Good'){
                db.query('update News set GV = GV+1 where id = ?',req.params.num);
                db.query('insert into Voted (id,user) values(?,?)',[req.params.num,req.session.user]);
                db.query('select * from News where id = ?',req.params.num,(error,results) => {
                   if(error) console.log(error);
                   if(results[0].GV >= 4){
                       db.query('update News set flag=2 where id = ?',req.params.num);
                   } 
                })
                res.send('<script type="text/javascript">alert("투표완료");window.location.href="/admin";</script>');
            }
            else if(req.params.string === 'Bad'){
                db.query('update News set BV = BV+1 where id = ?',req.params.num);
                db.query('insert into Voted (id,user) values(?,?)',[req.params.num,req.session.user]);
                db.query('select * from News where id = ?',req.params.num,(error,results) => {
                    if(error) console.log(error);
                    if(results[0].BV >= 4){
                        db.query('update News set flag=0 where id = ?',req.params.num);
                    } 
                 })
                res.send('<script type="text/javascript">alert("투표완료");window.location.href="/admin";</script>')
            }
            else
                res.send('<script type="text/javascript">alert("이미 투표한 기사입니다.");window.location.href="/admin";</script>')
        
        }
    })
})
.get('/:num',(req,res) => {
    if(req.session.user === undefined || req.session.flag === 0)
        res.redirect('/');
    db.query('select * from Users where ad = 1 and user = ?',req.session.user,(err,result) => {
        if(err) console.log(err)
        if(result.length !== 0){
            db.query('select contents from News where flag = 1',(error,results) => {
                if(error) console.log(error);
                res.render('admin.ejs',{
                    news : results
                })
            })
        }
        else
            res.send('<script type="text/javascript">alert("일반사용자는 접근불가능한 페이지입니다.");window.location.href="/";</script>');
    })
})

module.exports = router;
