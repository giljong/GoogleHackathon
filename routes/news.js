//뉴스페이지
var express = require('express')
var router = express.Router()
var fs = require('fs')
var db = require('../db/connetion');
const path = require('path');
const ejs = require('ejs');


//게시판 페이징

router.get('/social', function(req,res){
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
  res.redirect('/news/social/' + 1);
});

router.get('/sports', function(req,res){
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
  res.redirect('/news/sports/' + 1);
});

router.get('/living', function(req,res){
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
  res.redirect('/news/living/' + 1);
});

router.get('/world', function(req,res){
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
  res.redirect('/news/world/' + 1);
});

router.get('/it', function(req,res){
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
  res.redirect('/news/it/' + 1);
});

router.get('/culture', function(req,res){
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
  res.redirect('/news/culture/' + 1);
});

router.get("/All/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
//limit 변수
    var no = "";
//전체 게시물의 숫자
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from News where flag = 2'
    db.query(queryString, function (error2, data) {
    if (error2) {
        console.log(error2 + "메인 화면 mysql 조회 실패");
        return
    }
//전체 게시물의 숫자
    totalPageCount = data[0].cnt

//현제 페이지
    var curPage = req.params.cur;

    console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
    if (totalPageCount < 0) {
        totalPageCount = 0
    }

    var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
    var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
    var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
    var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
    var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
    if (curPage < 0) {
        no = 0
    } else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
    no = (curPage - 1) * 10
    }

    console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
    "curPage": curPage,
    "page_list_size": page_list_size,
    "page_size": page_size,
    "totalPage": totalPage,
    "totalSet": totalSet,
    "curSet": curSet,
    "startPage": startPage,
    "endPage": endPage
    };


    fs.readFile(path.resolve(__dirname,"../views/main.ejs"), 'utf-8', function (error, data) {

    if (error) {
        console.log("ejs오류" + error);
        return
    }
    console.log("몇번부터 몇번까지냐~~~~~~~" + no)

    var queryString = 'select * from News where flag = 2 order by SCORE desc limit ?,?';
    db.query(queryString, [no, page_size], function (error, result) {
    if (error) {
        console.log("페이징 에러" + error);
        return
    }
    console.log(JSON.parse(JSON.stringify(result)));
    res.send(ejs.render(data, {
        data: JSON.parse(JSON.stringify(result)),
       pasing: result2
    }));
    });
});


})

})



router.get("/Social/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

var queryString = 'select count(*) as cnt from News WHERE CATEGORIZE = social and flag = 2'
db.query(queryString, function (error2, data) {
if (error2) {
console.log(error2 + "메인 화면 mysql 조회 실패");
return
}
//전체 게시물의 숫자
totalPageCount = data[0].cnt

//현제 페이지
var curPage = req.params.cur;

console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
if (totalPageCount < 0) {
totalPageCount = 0
}

var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
if (curPage < 0) {
no = 0
} else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
no = (curPage - 1) * 10
}

console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
"curPage": curPage,
"page_list_size": page_list_size,
"page_size": page_size,
"totalPage": totalPage,
"totalSet": totalSet,
"curSet": curSet,
"startPage": startPage,
"endPage": endPage
};


fs.readFile(path.resolve(__dirname,"../views/social.ejs"), 'utf-8', function (error, data) {

if (error) {
console.log("ejs오류" + error);
return
}
console.log("몇번부터 몇번까지냐~~~~~~~" + no)

var queryString = 'select * from News WHERE CATEGORIZE = social and flag = 2 order by TITLE desc limit ?,?';
db.query(queryString, [no, page_size], function (error, result) {
if (error) {
console.log("페이징 에러" + error);
return
}
console.log(JSON.parse(JSON.stringify(result)));
res.send(ejs.render(data, {
data: JSON.parse(JSON.stringify(result)),
pasing: result2
}));
});
});


})

})


router.get("/living/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

var queryString = 'select count(*) as cnt from News WHERE CATEGORIZE = living and flag = 2'
db.query(queryString, function (error2, data) {
if (error2) {
console.log(error2 + "메인 화면 mysql 조회 실패");
return
}
//전체 게시물의 숫자
totalPageCount = data[0].cnt

//현제 페이지
var curPage = req.params.cur;

console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
if (totalPageCount < 0) {
totalPageCount = 0
}

var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
if (curPage < 0) {
no = 0
} else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
no = (curPage - 1) * 10
}

console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
"curPage": curPage,
"page_list_size": page_list_size,
"page_size": page_size,
"totalPage": totalPage,
"totalSet": totalSet,
"curSet": curSet,
"startPage": startPage,
"endPage": endPage
};


fs.readFile(path.resolve(__dirname,"../views/living.ejs"), 'utf-8', function (error, data) {

if (error) {
console.log("ejs오류" + error);
return
}
console.log("몇번부터 몇번까지냐~~~~~~~" + no)

var queryString = 'select * from News WHERE CATEGORIZE = living and flag = 2 order by TITLE desc limit ?,?';
db.query(queryString, [no, page_size], function (error, result) {
if (error) {
console.log("페이징 에러" + error);
return
}
console.log(JSON.parse(JSON.stringify(result)));
res.send(ejs.render(data, {
data: JSON.parse(JSON.stringify(result)),
pasing: result2
}));
});
});


})

})


router.get("/it/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

var queryString = 'select count(*) as cnt from News WHERE CATEGORIZE = it and flag = 2'
db.query(queryString, function (error2, data) {
if (error2) {
console.log(error2 + "메인 화면 mysql 조회 실패");
return
}
//전체 게시물의 숫자
totalPageCount = data[0].cnt

//현제 페이지
var curPage = req.params.cur;

console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
if (totalPageCount < 0) {
totalPageCount = 0
}

var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
if (curPage < 0) {
no = 0
} else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
no = (curPage - 1) * 10
}

console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
"curPage": curPage,
"page_list_size": page_list_size,
"page_size": page_size,
"totalPage": totalPage,
"totalSet": totalSet,
"curSet": curSet,
"startPage": startPage,
"endPage": endPage
};


fs.readFile(path.resolve(__dirname,"../views/it.ejs"), 'utf-8', function (error, data) {

if (error) {
console.log("ejs오류" + error);
return
}
console.log("몇번부터 몇번까지냐~~~~~~~" + no)

var queryString = 'select * from News WHERE CATEGORIZE = it and flag = 2 order by TITLE desc limit ?,?';
db.query(queryString, [no, page_size], function (error, result) {
if (error) {
console.log("페이징 에러" + error);
return
}
console.log(JSON.parse(JSON.stringify(result)));
res.send(ejs.render(data, {
data: JSON.parse(JSON.stringify(result)),
pasing: result2
}));
});
});


})

})



router.get("/culture/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

var queryString = 'select count(*) as cnt from News WHERE CATEGORIZE = culture and flag = 2'
db.query(queryString, function (error2, data) {
if (error2) {
console.log(error2 + "메인 화면 mysql 조회 실패");
return
}
//전체 게시물의 숫자
totalPageCount = data[0].cnt

//현제 페이지
var curPage = req.params.cur;

console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
if (totalPageCount < 0) {
totalPageCount = 0
}

var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
if (curPage < 0) {
no = 0
} else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
no = (curPage - 1) * 10
}

console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
"curPage": curPage,
"page_list_size": page_list_size,
"page_size": page_size,
"totalPage": totalPage,
"totalSet": totalSet,
"curSet": curSet,
"startPage": startPage,
"endPage": endPage
};


fs.readFile(path.resolve(__dirname,"../views/culture.ejs"), 'utf-8', function (error, data) {

if (error) {
console.log("ejs오류" + error);
return
}
console.log("몇번부터 몇번까지냐~~~~~~~" + no)

var queryString = 'select * from News WHERE CATEGORIZE = culture and flag = 2order by TITLE desc limit ?,?';
db.query(queryString, [no, page_size], function (error, result) {
if (error) {
console.log("페이징 에러" + error);
return
}
console.log(JSON.parse(JSON.stringify(result)));
res.send(ejs.render(data, {
data: JSON.parse(JSON.stringify(result)),
pasing: result2
}));
});
});


})

})



router.get("/sports/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

var queryString = 'select count(*) as cnt from News WHERE CATEGORIZE = sports and flag = 2'
db.query(queryString, function (error2, data) {
if (error2) {
console.log(error2 + "메인 화면 mysql 조회 실패");
return
}
//전체 게시물의 숫자
totalPageCount = data[0].cnt

//현제 페이지
var curPage = req.params.cur;

console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
if (totalPageCount < 0) {
totalPageCount = 0
}

var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
if (curPage < 0) {
no = 0
} else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
no = (curPage - 1) * 10
}

console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
"curPage": curPage,
"page_list_size": page_list_size,
"page_size": page_size,
"totalPage": totalPage,
"totalSet": totalSet,
"curSet": curSet,
"startPage": startPage,
"endPage": endPage
};


fs.readFile(path.resolve(__dirname,"../views/sports.ejs"), 'utf-8', function (error, data) {

if (error) {
console.log("ejs오류" + error);
return
}
console.log("몇번부터 몇번까지냐~~~~~~~" + no)

var queryString = 'select * from News WHERE CATEGORIZE = sports and flag = 2 order by TITLE desc limit ?,?';
db.query(queryString, [no, page_size], function (error, result) {
if (error) {
console.log("페이징 에러" + error);
return
}
console.log(JSON.parse(JSON.stringify(result)));
res.send(ejs.render(data, {
data: JSON.parse(JSON.stringify(result)),
pasing: result2
}));
});
});


})

})



router.get("/world/:cur", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }

//페이지당 게시물 수 : 한 페이지 당 10개 게시물
var page_size = 20;
//페이지의 갯수 : 1 ~ 10개 페이지
var page_list_size = 10;
//limit 변수
var no = "";
//전체 게시물의 숫자
var totalPageCount = 0;

var queryString = 'select count(*) as cnt from News where flag = 2'
db.query(queryString, function (error2, data) {
if (error2) {
console.log(error2 + "메인 화면 mysql 조회 실패");
return
}
//전체 게시물의 숫자
totalPageCount = data[0].cnt

//현제 페이지
var curPage = req.params.cur;

console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);


//전체 페이지 갯수
if (totalPageCount < 0) {
totalPageCount = 0
}

var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지


//현재페이지가 0 보다 작으면
if (curPage < 0) {
no = 0
} else {
//0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
no = (curPage - 1) * 10
}

console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)

var result2 = {
"curPage": curPage,
"page_list_size": page_list_size,
"page_size": page_size,
"totalPage": totalPage,
"totalSet": totalSet,
"curSet": curSet,
"startPage": startPage,
"endPage": endPage
};


fs.readFile(path.resolve(__dirname,"../views/world.ejs"), 'utf-8', function (error, data) {

if (error) {
console.log("ejs오류" + error);
return
}
console.log("몇번부터 몇번까지냐~~~~~~~" + no)

var queryString = 'select * from News where flag = 2 order by TITLE desc limit ?,?';
db.query(queryString, [no, page_size], function (error, result) {
if (error) {
console.log("페이징 에러" + error);
return
}
console.log(JSON.parse(JSON.stringify(result)));
res.send(ejs.render(data, {
data: JSON.parse(JSON.stringify(result)),
pasing: result2
}));
});
});


})

})



//메인화면
router.get("/", function (req, res) {
console.log("메인화면")
//main 으로 들어오면 바로 페이징 처리
res.redirect('/news/all/' + 1);

});

router.get("/all", function (req, res) {
    if(req.session.user!==undefined && req.session.flag===0){
        res.redirect('/auth');
    }
console.log("메인화면")
//main 으로 들어오면 바로 페이징 처리
res.redirect('/news/all/' + 1);

});

//삭제
router.get("/delete/:id", function (req, res) {
    db.query('select * from News where ID = ?',req.params.id,(err,result) => {
        if(err) console.log(err);
        if(result[0].user !== req.session.user)
            res.send('<script type="text/javascript">alert("이 글을 삭제할 수 있는 권한이 없습니다.");window.location.href="/";</script>')
        else{
            db.query('delete from News where id = ?', [req.params.id]);
            res.redirect('/');
        }
    })
});


router.get("/edit/:id", function (req, res) {
    db.query('select * from News where ID = ?',req.params.id,(err,result) => {
        if(err) console.log(err);
        if(result[0].user !== req.session.user)
            res.send('<script type="text/javascript">alert("이 글을 수정할 수 있는 권한이 없습니다.");window.location.href="/";</script>')
    })
    console.log("수정 진행")
    fs.readFile('edit.html', 'utf-8', function (error, data) {
    db.query('select * from News where id = ?', [req.params.id], function (error, result) {
        res.send(ejs.render(data, {
            data: result[0]
        }))
    })
});

})
//수정 포스터 데이터
router.post("/edit/:id", function (req, res) {
console.log("수정 포스트 진행")
var body = req.body;
db.query('update News set TITLE = ?, CONTENTS = ?, CATEGORIZE = ? where id = ?',
[body.name, body.num, body.section, req.params.id], function () {
res.redirect('/main')
})
})


module.exports = router
