'use strict';

/**
 * Module dependencies.
 * @private
 */

var fs = require('fs');
var util = require('util');

/**
 * Module variables.
 * @private
 */

var inspect = util.inspect;
var toString = Object.prototype.toString;

/* istanbul ignore next */
var defer = typeof setImmediate === 'function' ?
    setImmediate :
    function(fn) {
        process.nextTick(fn.bind.apply(fn, arguments))
    };

/**
 * Error handler:
 *
 * Development error handler, providing stack traces
 * and error message responses for requests accepting text, html,
 * or json.
 *
 * Text:
 *
 *   By default, and when _text/plain_ is accepted a simple stack trace
 *   or error message will be returned.
 *
 * JSON:
 *
 *   When _application/json_ is accepted, connect will respond with
 *   an object in the form of `{ "error": error }`.
 *
 * HTML:
 *
 *   When accepted connect will output a nice html stack trace.
 *
 * @return {Function}
 * @api public
 */

exports = module.exports = function errorHandler(options) {
    // get environment
    var env = process.env.NODE_ENV || 'development';

    // get options
    var opts = options || {};

    // get log option
    var log = opts.log === undefined ?
        env !== 'test' :
        opts.log;

    if (typeof log !== 'function' && typeof log !== 'boolean') {
        throw new TypeError('option log must be function or boolean')
    }

    // default logging using console.error
    if (log === true) {
        log = logerror;
    }

    return function errorHandler(err, req, res, next) {
        // respect err.statusCode
        if (err.statusCode) {
            res.statusCode = err.statusCode
        }

        // respect err.status
        if (err.status) {
            res.statusCode = err.status
        }

        // default status code to 500
        if (res.statusCode < 400) {
            res.statusCode = 500
        }

        // log the error
        var str = stringify(err);
        if (log) {
            defer(log, err, str, req, res);
        }

        // cannot actually respond
        if (res._header) {
            return req.socket.destroy();
        }

        // Security header for content sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');


        var error = {
            message: err.message
        };
        if (!isProduction) {
            error.stack = err.stack;
        }
        for (var prop in err) error[prop] = err[prop];
        var json = JSON.stringify({
            error: error
        });
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(json);
    };
};

/**
 * Template title, framework authors may override this value.
 */

exports.title = 'Connect';

/**
 * Stringify a value.
 * @api private
 */

function stringify(val) {
    var stack = val.stack;

    if (stack) {
        return String(stack);
    }

    var str = String(val);

    return str === toString.call(val) ?
        inspect(val) :
        str
}

/**
 * Log error to console.
 * @api private
 */

function logerror(err, str) {
    console.error(str);
}