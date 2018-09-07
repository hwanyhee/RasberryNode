var http = require('http');
var express = require('express');
var util= require('util');
var GPIO = require('onoff').Gpio;
led = new GPIO(17, 'out') ;
var app = express();
app.set('port',process.env.PORT || 8080);
var router = express.Router();
router.route('/ledcontrol/:action').get(function(req,resp){
var state=req.params.action;
console.log('state:',state);
if (state == 'on') {
 led.writeSync(1) ;
 }
 else if(state=='off') {
 led.writeSync(0) ;
 }
 else if(state == "toggle"){
     toggle=!led.readSync(0) ;
led.writeSync(toggle) ;
     if(toggle){
     		led.writeSync(1);
}
else{
	led.writeSync(0);
}
}
console.log(util.format('%s:%s',state,led.readSync(0)?'on':'off'));
resp.send(util.format('%s:%s',state,led.readSync(0)?'on':'off'));
});
app.use(router);
var server = http.createServer(app);
server.listen(8080, function() {
console.log('Express 서버 실행 -> 포트번호 : ' + app.get('port'));
});
