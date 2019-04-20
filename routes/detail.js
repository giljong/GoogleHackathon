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
            db.query('select * from comments where id = ? ordey by asc',req.params.num,(error,results) => {
                if(error) console.log(error);
                if(results.length === 0){
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
                db.query('insert into Comments (user,id,contents) values(?,?,?)',[req.session.user,req.params.num,req.body.title]);
                db.query('select * from News where id = ?',req.params.num,(error,results) => {
                    if(error) console.log(error)
                    sum = results[0].hap + req.body.score;
                    cnt = results[0].cnt+1;
                    score = sum/cnt;
                    db.query('update News set hap = ?, cnt = ?, score = ?',[sum,cnt,score]);
                })
            }
        })
    }
}).get('/:num/report',(req,res) => {
    db.query('select * from Report where id = ? and user = ?',[req.params.num,req.session.user],(err,result) => {
        if(err) console.log(err);
        if(result.length === 0){
            db.query('update News set cnt = cnt+1 where id = ?',req.params.num);
            db.query('insert into Report (id,user) values(?,?)',[req.params.num,req.session.user])
            res.send('<script type="text/javascript">alert("기사에 대한 신고가 완료되었습니다.");window.location.href="/detail";</script>')
        }
        else{
            res.send
        }
    })
})
module.exports = router;
