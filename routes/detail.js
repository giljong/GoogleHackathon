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
                        contents : result[0].contents,
                        comments : false
                    })
                }else{
                  res.render('newspage.ejs',{
                      contents : result[0].contents,
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
})
module.exports = router;
