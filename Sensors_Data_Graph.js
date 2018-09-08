var http = require('http');
var express = require('express');
var path = require('path');
//body-parser 모듈 로딩
var bodyParser = require('body-parser');
//mysql 모듈 로딩
var mysql = require('mysql');
//연결정보 설정
var con = mysql.createConnection({
	  host: "localhost",
	  user: "iot",
	  password: "iot",
	  port     : "3306",
	  database: "iot_schema"
});



var app = express();
app.set('port',process.env.PORT || 8080);
//뷰 템플릿 및 엔진 설정
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//body-parser모듈 등록
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//1.Router 객체 생성
var router = express.Router();

//센터 데이타 입력요청 처리
router.get('/insert',function(req,resp){

	
	if(con){

		con.query('INSERT INTO sensors(temperature,humidity) VALUES(?,?)',[req.query.temp,req.query.humi],function(err,result){
			if (err) throw err;
			console.log(result);
			//result.affectedRows: 입력된 행의 수
			//result.insertId:입력된 행의 KEY값
			console.log('입력 성공');			
		});
		
	}
	
});
//센터 데이타 조회후 그래프 그리기
router.get('/graph',function(req,resp){
	
	if(con){
		
		con.query("SELECT temperature,humidity  FROM sensors ORDER BY seq DESC LIMIT 0,10",function(err,results){
			if (err) throw err;
			 //※SELECT 쿼리결과는 배열형태로 반환됨
			 console.log(Array.isArray(results));
			 console.log(results);
			 //[ RowDataPacket { _ID: 1, ID: 'KIM', PASS: '1234', NAME: '김길동', AGE: 20 } ]
			 console.log('조회 성공');
			 if(Array.isArray(results)){				
				 resp.render('Sensor_Data_Grapth',{sensors:results},function(err, html){
						if(err){
							resp.set('200',{'Content-Type':'text/html;charset=UTF-8'});
							resp.write('<h2>뷰 렌더링중 오류발생</h2>');
							resp.write('에러 : '+err);
							resp.end();
							return;
						}
						resp.end(html);
				});
			 }
			
		});
		
	}
	
});


//3.Router객체를 app.use()로 등록.(※필수)
app.use(router);

var connect = function(){
	//MySql에 연결하기
	con.connect(function(err) {
		  if (err) throw err;
		  console.log("MySQL에 연결 성공");				
	});
}

var server = http.createServer(app);
server.listen(8080, function() {
	console.log('Express 서버 실행 -> 포트번호 : ' + app.get('port'));
	//데이타 베이스 연결
	connect();
	
});