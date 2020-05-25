var events = require("events");
var redis = require('redis');
var db = module.exports = new events.EventEmitter();
(function() {
    var host = Conf.get("redis");
    var options = {};
    var parts = host.split(":");
    if (parts.length == 3) {
        options.auth_pass = parts[2];
    }
    var client = redis.createClient(parts[1], parts[0], options);
    client.once("ready", function() {
        console.info("[DB][redis] " + host + " connected");
        db.redis = client;
    });
    client.on("error", function(err) {
        console.error("[DB][redis] " + host + " connect error, stack:" + err.stack, err);
    });
})();