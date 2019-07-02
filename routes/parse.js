const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const router = express.Router();
/*
request.get({url : "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFp4WkRNU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR%3Ako"},(err,res,body) =>{
    const $ = cheerio.load(body);
    var google = "https://news.google.com";
    for(var i = 1; i<10;i++){
      title = $("#yDmH0d > c-wiz > div > div.FVeGwb.NLCVwf > c-wiz > div > div.ajwQHc.BL5WZb > div > main > c-wiz > div > div > main > div.lBwEZb.BL5WZb.GndZbb > div:nth-child("+i+") > div > article > h3").text();
      url = google+$("#yDmH0d > c-wiz > div > div.FVeGwb.NLCVwf > c-wiz > div > div.ajwQHc.BL5WZb > div > main > c-wiz > div > div > main > div.lBwEZb.BL5WZb.GndZbb > div:nth-child("+i+") > div > article > h3 > a").attr("href");
    }
})
*/
router.get('/',(req,res) => {
    if(req.query.page === undefined){
        startNum = 1;
    }
    else if(req.query.page == 1)
        startNum = 1;
    else if(req.query.page == 2)
        startNum = 11;
    else if(req.query.page == 3)
        startNum = 21;
    else if(req.query.page == 4)
        startNum = 31;
    else if(req.query.page == 5)
        startNum = 41;
    request.get({url : "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFp4WkRNU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR%3Ako"},(err,res,body) =>{
        const $ = cheerio.load(body);
        title = [];
        url = [];
        var google = "https://news.google.com";
        for(var i = startNum; i<startNum + 10;i++){
            title.push($("#yDmH0d > c-wiz > div > div.FVeGwb.NLCVwf > c-wiz > div > div.ajwQHc.BL5WZb > div > main > c-wiz > div > div > main > div.lBwEZb.BL5WZb.GndZbb > div:nth-child("+i+") > div > article > h3").text());
            url.push(google+$("#yDmH0d > c-wiz > div > div.FVeGwb.NLCVwf > c-wiz > div > div.ajwQHc.BL5WZb > div > main > c-wiz > div > div > main > div.lBwEZb.BL5WZb.GndZbb > div:nth-child("+i+") > div > article > h3 > a").attr("href"));
        }
    })
    res.render('parse.ejs',{
        title : title,
        url : url
    })
})

module.exports = router;