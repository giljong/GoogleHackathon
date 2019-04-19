const express = require('express');
const router = express.Router();
const db = require('../db/connetion')

/* GET home page. */
router.get('/', (req, res) => {
  db.query('select * from News where user = ("select user from Reporters where best = 1") order by id desc',(err,result) => {
    if(err) console.log(err);
    var arr = [];
    var check = [];
    var cnt = 0;
    var flag = 0;
    var cnt2 = 0;
    /*for(var i = 0;i<result.length;i++){
      for(var j = 0;j<cnt;j++){
        if(result[i].grname === check[j]){
          flag = 1;
          break;
         }
      }
      if(!flag){
        arr[cnt2++] = result[i];
        check[cnt++] = result[i].grname;
      }
      flag = 0;
    }*/
    res.render('index.ejs',{
      news : arr
    });
  })
});

module.exports = router;
