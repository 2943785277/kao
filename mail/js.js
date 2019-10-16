const nodemailer = require('nodemailer'); //发送邮件的node插件
//const ejs = require("ejs"); //ejs模版引擎
const fs = require("fs"); //文件读写
const path = require("path"); //路径配置
let transporter = nodemailer.createTransport({
    service: 'QQ', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口  465/587
    secureConnection: true, // SSL安全链接
    auth: {   //发送者的账户密码
      user: '2943785277@qq.com', //账户
      pass: 'dwvyxwdignxwddfh', //smtp授权码，到邮箱设置下获取
    }
  });
module.exports = {
	mail(o){
		//发送邮件
		return new Promise((resolve, reject) => {
			transporter.sendMail(o, (error, info) => {
			    if (error) {
						resolve(info)
			    }else{
						resolve(info)
					}
			});
		})
	}
}