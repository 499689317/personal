; (function() {
	$(function() {
		console.log("hello world");

		$.ajax({
			url: '/jq/fresh',
			type: 'POST',
			dataType: 'json',
			data: {p: 11111},
		})
		.done(function(ret) {
			console.log("success", ret);

			if (ret.errcode) {
				console.log("errcode不为0", ret.errcode);
				return;
			};

			var list = ret.data;

			$("#list").html("");

			// TODO
			var htm = "";
			for (var i = 0; i < list.length; i++) {
				
				htm += "<li>";
				htm += "<p>" + list[i].title + "</p>";
				htm += "<p>" + list[i].content + "</p>";
				htm += "</li>";
			};

			$("#list").html(htm);
		})
		.fail(function(err) {
			console.log("error", err);
		})
		.always(function() {
			console.log("complete");
		});
		
	});
})();