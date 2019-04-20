const express = require('express');
const router = express.Router();
const db = require('../db/connetion.js');

router.get('/', (req, res) => {
  if(req.session.user!==undefined && req.session.flag===0){
    res.redirect('/auth');
  }
  db.query("select * from News where grname IN (select grname from Gr where best = 1) order by ID desc", (err,result) => {
  // db.query('select * from News where grname in (select grname from Gr where best = 1) order by id desc',(err,result) => {
    //console.log(result)
    if(err) console.log(err);
    if(result !== undefined){
      var arr = [];
      var check = [];
      var cnt = 0;
      var flag = 0;
      var cnt2 = 0;
      for(var i = 0;i<result.length;i++){
        for(var j = 0;j<result.length;j++){
          if(result[i].grname === check[j]){
            flag = 1;
            break;
          }
        }
        if(!flag){
          arr[cnt2++] = result[i];
          check[cnt++] = result[i].GRNAME;
        }
        flag = 0;
      }
      console.log(arr);
      res.render('index.ejs',{
        news : arr
      });
    }
   /* else{
      res.redirect('/news/all');
    }
    */
  });
}).get('/fake',(req,res) => {
  db.query('select TITLE,GRNAME,USER,ID from News where flag = 0',(err,result) => {
    if(err) console.log(err);
    res.render('fake.ejs',{
      news : result
    })
  })
}).get('/fake/:num',(req,res) => {
  db.query('select CONTENTS,GRNAME,USER from News where flag = 0 and ID = ?',req.params.num,(err,result) => {
    if(err) console.log(err);
    res.render('detailfake.ejs',{
      news : result
    })
  })
}).post('/fake/:num/edit',(req,res) => {
  if(req.body.title !== '' && req.body.contents !==''){
    db.query('update News set title = ?, contents = ?, flag = 1, GV = 0,BV = 0 where id = ?',[req.body.title,req.body.contents,req.params.num]);
    db.query('delete from Voted Where id = ?',req.params.num);
    res.send('<script type="text/javascript">alert("기사수정을 완료했습니다. 수정된 기사는 검열 후에 다시 업로드 될 것입니다.");window.location.href="/";</script>')
  }
  else
    res.send('<script type="text/javascript">alert("비어있는 칸이 있는지 확인해주세요.");window.location.href="/fake/ '+req.params.num+'/edit";</script>')

}).get('/fake/:num/edit',(req,res) => {
  if(req.session.user === undefined || req.session.flag === 0)
    res.redirect('/fake/'+req.params.num);
  db.query('select * from News where id = ? and flag = 0 and user = ?',[req.params.num,req.session.user],(err,result) => {
    if(err) console.log(err);
    if(result.length === 0)
      res.send('<script type="text/javascript">alert("이 기사를 수정할 수 있는 권한이 없습니다.");window.location.href="/fake/ '+req.params.num +'";</script>');
    else
      res.render('fackedit.ejs');
  })
})

module.exports = router;
