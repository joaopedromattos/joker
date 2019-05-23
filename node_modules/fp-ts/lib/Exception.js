"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Adapted from https://github.com/purescript/purescript-exceptions
 */
var Either_1 = require("./Either");
var IO_1 = require("./IO");
var Option_1 = require("./Option");
/**
 * Create a JavaScript error, specifying a message
 *
 * @since 1.0.0
 */
exports.error = function (message) {
    return new Error(message);
};
/**
 * Get the error message from a JavaScript error
 *
 * @since 1.0.0
 */
exports.message = function (e) {
    return e.message;
};
/**
 * Get the stack trace from a JavaScript error
 *
 * @since 1.0.0
 */
exports.stack = function (e) {
    return typeof e.stack === 'string' ? Option_1.some(e.stack) : Option_1.none;
};
/**
 * Throw an exception
 *
 * @since 1.0.0
 */
exports.throwError = function (e) {
    return new IO_1.IO(function () {
        throw e;
    });
};
/**
 * Catch an exception by providing an exception handler
 *
 * @since 1.0.0
 */
exports.catchError = function (ma, handler) {
    return new IO_1.IO(function () {
        try {
            return ma.run();
        }
        catch (e) {
            if (e instanceof Error) {
                return handler(e).run();
            }
            else {
                return handler(new Error(e.toString())).run();
            }
        }
    });
};
/**
 * Runs an IO and returns eventual Exceptions as a `Left` value. If the computation succeeds the result gets wrapped in
 * a `Right`.
 *
 * @since 1.0.0
 */
exports.tryCatch = function (ma) {
    return exports.catchError(ma.map(Either_1.right), function (e) { return IO_1.io.of(Either_1.left(e)); });
};
