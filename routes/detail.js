const express = require('express');
const db = require('../db/connetion');
const router = express.Router();

router.get('/:num',(req,res) => {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
    else{
        db.query('select * from News where id = ?',req.params.num,(err,result) => {
            if(err) console.log(err);
            db.query('select * from comments where id = ?',req.params.num,(error,results) => {
                if(error) console.log(error);
                if(results === undefined){
                    res.render('newspage.ejs',{
                        contents : result,
                        comments : false
                    })
                }
                else{
                    res.render('newspage.ejs',{
                        contents : result,
                        comments : results,
                        len : results.length
                    })
                }   
            })
        })
    }
}).post('/:num',(req,res) => {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
    else if(req.session.user === undefined){
        res.send('<script type="text/javascript">alert("로그인이 필요한 컨텐츠입니다.");window.location.href="/login";</script>')
    }
    else{
        db.query('select * from Comments where user = ? and id = ?',[req.session.user,req.params.num],(err,result) =>{
            if(err) console.log(err);
            if(result.length === 0){
                db.query('insert into Comments (user,id,contents,score) values(?,?,?,?)',[req.session.user,req.params.num,req.body.contents,req.body.score]);
                res.redirect('/');
            }
        })
    }
}).get('/:num/report',(req,res) => {
    db.query('select * from Report where id = ? and user = ?',[req.params.num,req.session.user],(err,result) => {
        if(err) console.log(err);
        if(result.length === 0){
            db.query('update News set cnt = cnt+1 where id = ?',req.params.num);
            db.query('insert into Report (id,user) values(?,?)',[req.params.num,req.session.user])
            db.query('select * from News where id = ?',(error,results) => {
                if(error) console.log
                if(results[0].cnt >=100){
                    db.query('update News set flag=1 where id = ?',req.params.num);
                    res.send('<script type="text/javascript">alert("기사에 대한 신고가 완료되었습니다.");window.location.href="/detail";</script>')
                }
                else{
                    res.send('<script type="text/javascript">alert("기사에 대한 신고가 완료되었습니다.");window.location.href="/detail";</script>')
                }
            })
        }
        else{
            res.send('<script type="text/javascript">alert("기사에 대한 신고를 이미 하였습니다.");window.location.href="/detail";</script>')
        }
    })
})
module.exports = router;
