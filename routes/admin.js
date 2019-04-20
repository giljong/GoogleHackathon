//기사관리
const express = require('express');
const router = express.Router();
const db = require('../db/connetion.js');

router.get('/',(req,res) => {
    if(req.session.user === undefined || req.session.flag === 0){
      res.redirect('/');
    } else {
    db.query('select * from Users where AD=1 and email = ?',req.session.user,(err,result) => {
        if(err) console.log(err)
        if(result !== undefined){
            db.query('select title,id from News where flag = 1',(error,results) => {
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
}).get('/:num',(req,res) => {
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
}).post('/:num',(req,res) => {

})
module.exports = router;
