var http = require('http');
var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');


var app = express();
app.set('port',process.env.PORT || 9090);

app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public',serveStatic(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var router = express.Router();

router.route('/index').get(function(req,resp){
	
	resp.render('PICamera',{title:'LED Control'},function(err, html){
		if(err){
			resp.set('200',{'Content-Type':'text/html;charset=UTF-8'});
			resp.write('<h2>뷰 렌더링중 오류발생</h2>');
			resp.write('에러 : '+err);
			resp.end();
			return;
		}
		resp.end(html);
	});
 	

});


app.use(router);
var server = http.createServer(app);
server.listen(9090, function() {
	console.log('Express 서버 실행 -> 포트번호 : ' + app.get('port'));
});
