const express = require('express');
const router = express.Router();
const db = require('../db/connetion.js');

router.get('/', (req, res) => {
  if(req.session.user!==undefined && req.session.flag===0)
    res.redirect('/auth');
  db.query("select * from News where grname IN (select grname from Gr where best = 1) and flag = 2 order by ID desc", (err,result) => {
  // db.query('select * from News where grname in (select grname from Gr where best = 1) order by id desc',(err,result) => {
    if(err) console.log(err);
    if(result !== undefined){
      var arr = [];
      var check = [];
      var cnt = 0;
      var flag = 0;
      var cnt2 = 0;
      for(var i = 0;i<result.length;i++){
        for(var j = 0;j<check.length;j++){
          if(result[i].GRNAME === check[j]){
            flag = 1;
            break;
          }
        }
        if(flag === 0){
          arr[cnt2++] = result[i];
          check[cnt++] = result[i].GRNAME;
        }
        flag = 0;
      }
      res.render('index.ejs',{
        news : arr
      })
    } else{
      res.redirect('/news/all');
    }
  });
})

module.exports = router;
