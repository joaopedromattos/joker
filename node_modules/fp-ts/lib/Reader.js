"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var function_1 = require("./function");
var Either_1 = require("./Either");
exports.URI = 'Reader';
/**
 * @since 1.0.0
 */
var Reader = /** @class */ (function () {
    function Reader(run) {
        this.run = run;
    }
    Reader.prototype.map = function (f) {
        var _this = this;
        return new Reader(function (e) { return f(_this.run(e)); });
    };
    Reader.prototype.ap = function (fab) {
        var _this = this;
        return new Reader(function (e) { return fab.run(e)(_this.run(e)); });
    };
    /**
     * Flipped version of `ap`
     */
    Reader.prototype.ap_ = function (fb) {
        return fb.ap(this);
    };
    Reader.prototype.chain = function (f) {
        var _this = this;
        return new Reader(function (e) { return f(_this.run(e)).run(e); });
    };
    /**
     * @since 1.6.1
     */
    Reader.prototype.local = function (f) {
        var _this = this;
        return new Reader(function (e) { return _this.run(f(e)); });
    };
    return Reader;
}());
exports.Reader = Reader;
var map = function (fa, f) {
    return fa.map(f);
};
var of = function (a) {
    return new Reader(function () { return a; });
};
var ap = function (fab, fa) {
    return fa.ap(fab);
};
var chain = function (fa, f) {
    return fa.chain(f);
};
/**
 * reads the current context
 *
 * @since 1.0.0
 */
exports.ask = function () {
    return new Reader(function_1.identity);
};
/**
 * Projects a value from the global context in a Reader
 *
 * @since 1.0.0
 */
exports.asks = function (f) {
    return new Reader(f);
};
/**
 * changes the value of the local context during the execution of the action `fa`
 *
 * @since 1.0.0
 */
exports.local = function (f) { return function (fa) {
    return fa.local(f);
}; };
var promap = function (fbc, f, g) {
    return new Reader(function (a) { return g(fbc.run(f(a))); });
};
var compose = function (ab, la) {
    return new Reader(function (l) { return ab.run(la.run(l)); });
};
var id = function () {
    return new Reader(function_1.identity);
};
var first = function (pab) {
    return new Reader(function (_a) {
        var a = _a[0], c = _a[1];
        return [pab.run(a), c];
    });
};
var second = function (pbc) {
    return new Reader(function (_a) {
        var a = _a[0], b = _a[1];
        return [a, pbc.run(b)];
    });
};
var left = function (pab) {
    return new Reader(function (e) { return e.fold(function (a) { return Either_1.left(pab.run(a)); }, Either_1.right); });
};
var right = function (pbc) {
    return new Reader(function (e) { return e.fold(Either_1.left, function (b) { return Either_1.right(pbc.run(b)); }); });
};
/**
 * @since 1.14.0
 */
exports.getSemigroup = function (S) {
    return {
        concat: function (x, y) { return new Reader(function (e) { return S.concat(x.run(e), y.run(e)); }); }
    };
};
/**
 * @since 1.14.0
 */
exports.getMonoid = function (M) {
    return __assign({}, exports.getSemigroup(M), { empty: of(M.empty) });
};
/**
 * @since 1.0.0
 */
exports.reader = {
    URI: exports.URI,
    map: map,
    of: of,
    ap: ap,
    chain: chain,
    promap: promap,
    compose: compose,
    id: id,
    first: first,
    second: second,
    left: left,
    right: right
};
