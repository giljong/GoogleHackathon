const createError = require('http-errors');
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const indexRouter = require('./routes/index');
const myPageRouter = require('./routes/mypage');
const loginRouter = require('./routes/login');
const authRouter = require('./routes/auth');
const registerRouter = require('./routes/register');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const logoutRouter = require('./routes/logout');
const writeRouter = require('./routes/wrnews');
const schedule = require('node-schedule');
const productRouter = require('./routes/news');
const detailRouter = require('./routes/detail');
const adminRouter = require('./routes/admin');
const addgrRouter = require('./routes/grenroll')
const addrpRouter = require('./routes/reportenroll');
const fakeRouter = require('./routes/fake');
const parseRouter = require('./routes/parse');

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '122345564fasdfafa54fsadaf', //사용자의 세션아이디 값
  resave: false,  //재접속 시 세션아이디 재발급x
  saveUninitialized: true,  //세션 사용 전까지 세션아이디 발급x
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/mypage',myPageRouter);
app.use('/wrnews',writeRouter);
app.use('/login',loginRouter);
app.use('/auth',authRouter);
app.use('/register',registerRouter);
app.use('/logout',logoutRouter);
app.set('view engine', 'ejs');
app.use('/news',productRouter);
app.use('/detail',detailRouter);
app.use('/addgroup',addgrRouter);
app.use('/addrp',addrpRouter);
app.use('/fake',fakeRouter);
app.use('/parse',parseRouter);

app.use(helmet());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404.ejs');
});

app.listen(3000, "0.0.0.0", () => {
  console.log("connect");
});

const request = require("request");
const cheerio = require("cheerio");

request.get({url : "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRFp4WkRNU0FtdHZLQUFQAQ?hl=ko&gl=KR&ceid=KR%3Ako"},(err,res,body) =>{
    const $ = cheerio.load(body);
    var google = "https://news.google.com";
    for(var i = 1; i<10;i++){
      title = $("#yDmH0d > c-wiz > div > div.FVeGwb.NLCVwf > c-wiz > div > div.ajwQHc.BL5WZb > div > main > c-wiz > div > div > main > div.lBwEZb.BL5WZb.GndZbb > div:nth-child("+i+") > div > article > h3").text();
      url = google+$("#yDmH0d > c-wiz > div > div.FVeGwb.NLCVwf > c-wiz > div > div.ajwQHc.BL5WZb > div > main > c-wiz > div > div > main > div.lBwEZb.BL5WZb.GndZbb > div:nth-child("+i+") > div > article > h3 > a").attr("href");
      console.log(url);
    }
})


module.exports = app;
