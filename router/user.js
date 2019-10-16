const router = require('koa-router')();
const request = require('../request/js.js');
const mail = require('../mail/js.js');
const mysql = require('../mysql/sql.js');
const schedule = require('../schedule/js.js');
var config = require('../config/config.js')

// const ejs = require("ejs"); //ejs模版引擎
// const fs = require("fs"); //文件读写
// const path = require("path"); //路径配置
// 
router.get('/mo/opentime', async (ctx, next) => {
		schedule.opentime({
			time:'30 * * * * *',
			code:function(){
				console.log('------------')
			}
		})
		//console.log(schedule)
    ctx.response.body = {
			code:200,
			data:{
				msg:schedule
			}
		};
});
router.get('/mo/close', async (ctx, next) => {
		schedule.close()
    ctx.response.body = {
			code:200,
			data:{
				msg:'关闭成功'
			}
		};
});
//发送邮件
router.post('/user/mail', async (ctx, next) => {
		var body = ctx.request.body;
		var html = '<h3>今日兰州最高温度 <span style="font-size:30px;color: #FD0000;">&nbsp;36°C&nbsp;</span>，请我最爱最爱的媳妇注意避暑，不要中暑了影响晚上老公的发挥，热了就给老公说 老公带风扇给你，还有...</h3><h4 style="text-indent: 2em;color: #FD0000;">晚上洗干净等老公----------老公爱你<span style="font-size: 30px;">❤</span></h4>'
		let mailOptions = {
			from: '"重要邮件" <2943785277@qq.com>', // 发送者昵称和地址
			to: '2536709629@qq.com', // 接收者的邮箱地址			2536709629@qq.com				3072336841@qq.com
			subject: '通知', // 邮件主题
			text: '',  //邮件的text
			html: html  //也可以用html发送  
		};
		var data = await mail.mail(mailOptions)
		//var w = JSON.parse(data.body)
		console.log(data)
		ctx.response.body = {
			code:200,
			data
		};
});
router.post('/user/weather', async (ctx, next) => {
		var body = ctx.request.body;
		//<video src="https://www.w3school.com.cn/i/movie.ogg" controls="controls"></video>
		//var html = '<h3>天气预报</h3><iframe width="400" scrolling="no" height="70" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=2&color=%230070C0&bgc=%23FFFFFF&bdc=%23&icon=1&py=lanzhou&num=2&site=13"></iframe>'
		var html = `<img src="http://a1.qpic.cn/psb?/V13j4EA72QZlQs/vFPNArRgKtLzlg1R4PivNMRRnMnh.ACQBpoDmulR67U!/m/dCQAAAAAAAAA&ek=1&kp=1&pt=0&bo=OAQkCQAAAAARFzE!&t=5&tl=3&vuin=2943785277&tm=1566284400&sce=60-4-3&rf=0-0" />时间: ` + new Date()
		let mailOptions = {
			from: '"国家主席习近平" <2943785277@qq.com>', // 发送者昵称和地址
			to: '2536709629@qq.com', // 接收者的邮箱地址			2536709629@qq.com				3072336841@qq.com
			subject: '尊敬的史尿多女士，你好！', // 邮件主题
			text: '',  //邮件的text
			html: html  //也可以用html发送  
		};
		schedule.opentime({
			time:'30 * * * * *',
			code:function(){
				var data = mail.mail(mailOptions);
				ctx.response.body = {
					code:200,
					data
				};
			}
		})
		// var data = await mail.mail(mailOptions)
		// //var w = JSON.parse(data.body)
		// console.log(data)
		// 
});
router.post('/user/we', async (ctx, next) => {
		var body = ctx.request.body;
		var o = {
			url:'https://api.weixin.qq.com/sns/jscode2session',method:'get',
			data:{appid:config.database.appId,secret:config.database.appSecret,js_code:body.code,grant_type:'authorization_code'}
		}
		var data = await request.ax(o)
		var w = JSON.parse(data.body)
		console.log(w)
		ctx.response.body = {
			code:200,
			w
		};
});
router.get('/user/data', async (ctx, next) => {
		let data = await mysql.query('SELECT * from user')
    ctx.response.body = {
			code:200,
			data:{
				data
			}
		};
});
//查看
router.post('/user', async (ctx, next) => {
		let res;
		var body = ctx.request.body;
		let data = await mysql.query('SELECT * from user WHERE id=?',[body.id],1)
		if(data != ''){
			res = '获取成功';
		}else{
			res = '获取失败!';
		}
    ctx.response.body = {
			code:200,
			res:res,
			data:{
				data
			}
		};
});
//注册
router.post('/user/register', async (ctx, next) => {
		let res;
		var body = ctx.request.body;
		if(body.number == '' || body.number == undefined){
			res = '账号不能为空';
		}else if(body.password == '' || body.password == undefined){
			res = '密码不能为空';
		}else{
			let data = await mysql.query('SELECT * from user WHERE number=?',[body.number]);
			console.log(data)
			if(data == '' || data ==undefined){
				var user = await mysql.Insertinto('INSERT INTO user(id,number,password) VALUES(0,?,?)',[body.number,body.password]);
				res = '注册成功';
			}else{
				res = '账号存在';
			}
		}
		ctx.response.body = {
			code:200,
			res:res,
			data:{
			}
		};
});
//登录
router.post('/user/logo', async (ctx, next) => {
		let res;
		var body = ctx.request.body;
		console.log(body.password)
		if(body.number == '' || body.number == undefined){
			res = '账号不能为空';
		}else if(body.password == '' || body.password == undefined){
			res = '密码不能为空';
		}else{
			let data = await mysql.query('SELECT * from user WHERE number=?',[body.number],1)
			if(data != '' || data !=undefined){
				if(body.password == data.password){
					res = '登录成功';
				}else{
					res = '密码错误,请重试!';
				}
			}else{
				res = '账号不存在!';
			}
		}	
    ctx.response.body = {
			code:200,
			res:res,
			data:{
				
			}
		};
});
router.post('/add', async (ctx, next) => {	
    var data = ctx.request.body;
		var arr = [];
		arr.push(data.type);
		arr.push(data.content)
		arr.push(data.state)
		var res = await mysql.Insertinto('INSERT INTO user(id,type,content,state) VALUES(0,?,?,?)',arr)
		let userdata = await mysql.query('SELECT * from user')
    ctx.response.body = {
			code:200,
			data:{
				userdata
			}
		};
});
router.get('/user/get', async (ctx, next) => {
    ctx.response.body = {
			code:200,
			data:{
				
			}
		};
});
router.post('/delete', async (ctx, next) => {
		var body = ctx.request.body;
		let data = await mysql.query('DELETE * from user WHERE id=?',[body.id])
    ctx.response.body = {
			code:200,
			data:{
				data
			}
		};
});
module.exports = router
// module.exports = {
// 	router
// }

