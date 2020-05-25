var fs = require("fs");
var path = require("path");
var tracer = require("tracer");

const env = process.env.NODE_ENV || "development";

function getLogTag() {
    var nowTime = new Date();
    return `${env}.${nowTime.getFullYear()}-${nowTime.getMonth() + 1}-${nowTime.getDate()}`;
};

function getPrintCfg() {
    if (env == "production") {
        return {
            level: Conf.get("logger:level"),
            transport: function(data) {
                var fileName = path.join(__dirname, `../logs/${getLogTag()}.log`);
                console.log(data.output);
                fs.appendFile(fileName, data.output + "\n", "utf-8", (err) => {
                    if (err) throw err;
                });
            }
        };
    } else if (env == "testing") {
        return {
            level: Conf.get("logger:level"),
            transport: function(data) {
                var fileName = path.join(__dirname, `../logs/${getLogTag()}.log`);
                console.log(data.output);
                fs.appendFile(fileName, data.output + "\n", "utf-8", (err) => {
                    if (err) throw err;
                });
            }
        };
    }
    return {
        level: "log"
    };
};

function getCoutCfg() {
    if (env == "production") {
        return {
            root: './logs',
            maxLogFiles: 366,
            allLogsFileName: "production"
        };
    } else if (env == "testing") {
        return {
            root: "./logs",
            maxLogFiles: 366,
            allLogsFileName: "testing"
        };
    }
    return {
        root: "./logs",
        maxLogFiles: 366,
        allLogsFileName: "development"
    };
};
module.exports = {
    print: tracer.console(getPrintCfg()),
    colorprint: tracer.colorConsole(getPrintCfg()),
    cout: tracer.dailyfile(getCoutCfg())
};