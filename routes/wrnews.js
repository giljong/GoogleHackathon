//기사 작성
const express = require('express');
const db = require('../db/connetion');
const router = express.Router();

router.get('/',(req,res) => {
    res.render('wrnews.ejs');
})

module.exports = router;