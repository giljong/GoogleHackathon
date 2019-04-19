const express = require('express');
const router = express.Router();
const db = require('../db/connetion')

/* GET home page. */
router.get('/', (req, res) => {
  if((req.session.user === undefined)){
    db.query('select * from News where ')
    res.render('index.ejs',{
      
    });
  }
  else if(!(req.session.flag) && (req.session.user !== undefined))
        res.redirect('/auth');
  else{
      res.render('index.ejs',{
        score : req.session.score,
        user_id : req.session.user,
        user_school: req.session.school
      })
    }
});

module.exports = router;
