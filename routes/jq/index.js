var errcode = require("../../utils/errcode.js");
var router = module.exports = require("express").Router();

router.post("/fresh", function(req, res, next) {

	var p = req.body.p;
	Log.info("jq/fresh", p);

	var msg = {
		errcode: errcode.success,
		errdesc: "success",
		data: {}
	};

	var list = [
		{
			title: "春晚",
			content: "今天过年"
		},
		{
			title: "小品",
			content: "春晚有小品"
		},
		{
			title: "赵本山",
			content: "小品有赵本山"
		},
		{
			title: "小崔说事",
			content: "赵本山的小品叫小崔说事"
		}
	];

	msg.data = list;

	res.end(JSON.stringify(msg));
});

router.get("/tips", function(req, res, next) {

	var title = req.query.title;
	var content = req.query.content;
	console.log("user/tips", title, content);

	var data = {
		tips: {
			title: title,
			content: content
		}
	};

	var tips = Logic.render.renderFile("tips.htm", data);
	res.writeHead(200, {"Content-Type": "text/html"});
	console.log(tips);
	res.end(tips);
});