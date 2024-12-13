const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCUMENT html><p>Test</p>')
window = dom.window
document = window.document
navigator= window.navigator
location={}
debugger;
// try {
window.CryptoJS = function() {
        for (var P, L, N, u, V, t, H, F, U, j, z, G, q, K, W, X, Z, J, Y, $, Q, tt, it, e, rt, nt, s, ot, st, at, ht, ct, n, ut, i, lt, ft, o, a, h, c, l, f, r = function(c) {
            var r;
            if (!(r = !(r = !(r = "undefined" != typeof window && window.crypto ? window.crypto : r) && "undefined" != typeof window && window.msCrypto ? window.msCrypto : r) && "undefined" != typeof global && global.crypto ? global.crypto : r) && "function" == typeof require)
                try {
                    r = require("crypto")
                } catch (t) {}
            var i = Object.create || function(t) {
                return e.prototype = t,
                t = new e,
                e.prototype = null,
                t
            }
            ;
            function e() {}
            var t = {}
              , n = t.lib = {}
              , o = n.Base = {
                extend: function(t) {
                    var e = i(this);
                    return t && e.mixIn(t),
                    e.hasOwnProperty("init") && this.init !== e.init || (e.init = function() {
                        e.$super.init.apply(this, arguments)
                    }
                    ),
                    (e.init.prototype = e).$super = this,
                    e
                },
                create: function() {
                    var t = this.extend();
                    return t.init.apply(t, arguments),
                    t
                },
                init: function() {},
                mixIn: function(t) {
                    for (var e in t)
                        t.hasOwnProperty(e) && (this[e] = t[e]);
                    t.hasOwnProperty("toString") && (this.toString = t.toString)
                },
                clone: function() {
                    return this.init.prototype.extend(this)
                }
            }
              , u = n.WordArray = o.extend({
                init: function(t, e) {
                    t = this.words = t || [],
                    this.sigBytes = null != e ? e : 4 * t.length
                },
                toString: function(t) {
                    return (t || a).stringify(this)
                },
                concat: function(t) {
                    var e = this.words
                      , i = t.words
                      , r = this.sigBytes
                      , n = t.sigBytes;
                    if (this.clamp(),
                    r % 4)
                        for (var o = 0; o < n; o++) {
                            var s = i[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                            e[r + o >>> 2] |= s << 24 - (r + o) % 4 * 8
                        }
                    else
                        for (o = 0; o < n; o += 4)
                            e[r + o >>> 2] = i[o >>> 2];
                    return this.sigBytes += n,
                    this
                },
                clamp: function() {
                    var t = this.words
                      , e = this.sigBytes;
                    t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8,
                    t.length = c.ceil(e / 4)
                },
                clone: function() {
                    var t = o.clone.call(this);
                    return t.words = this.words.slice(0),
                    t
                },
                random: function(t) {
                    for (var e = [], i = 0; i < t; i += 4)
                        e.push(function() {
                            if (r) {
                                if ("function" == typeof r.getRandomValues)
                                    try {
                                        return r.getRandomValues(new Uint32Array(1))[0]
                                    } catch (t) {}
                                if ("function" == typeof r.randomBytes)
                                    try {
                                        return r.randomBytes(4).readInt32LE()
                                    } catch (t) {}
                            }
                            throw new Error("Native crypto module could not be used to get secure random number.")
                        }());
                    return new u.init(e,t)
                }
            })
              , s = t.enc = {}
              , a = s.Hex = {
                stringify: function(t) {
                    for (var e = t.words, i = t.sigBytes, r = [], n = 0; n < i; n++) {
                        var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                        r.push((o >>> 4).toString(16)),
                        r.push((15 & o).toString(16))
                    }
                    return r.join("")
                },
                parse: function(t) {
                    for (var e = t.length, i = [], r = 0; r < e; r += 2)
                        i[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;
                    return new u.init(i,e / 2)
                }
            }
              , h = s.Latin1 = {
                stringify: function(t) {
                    for (var e = t.words, i = t.sigBytes, r = [], n = 0; n < i; n++) {
                        var o = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                        r.push(String.fromCharCode(o))
                    }
                    return r.join("")
                },
                parse: function(t) {
                    for (var e = t.length, i = [], r = 0; r < e; r++)
                        i[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;
                    return new u.init(i,e)
                }
            }
              , l = s.Utf8 = {
                stringify: function(t) {
                    try {
                        return decodeURIComponent(escape(h.stringify(t)))
                    } catch (t) {
                        throw new Error("Malformed UTF-8 data")
                    }
                },
                parse: function(t) {
                    return h.parse(unescape(encodeURIComponent(t)))
                }
            }
              , f = n.BufferedBlockAlgorithm = o.extend({
                reset: function() {
                    this._data = new u.init,
                    this._nDataBytes = 0
                },
                _append: function(t) {
                    "string" == typeof t && (t = l.parse(t)),
                    this._data.concat(t),
                    this._nDataBytes += t.sigBytes
                },
                _process: function(t) {
                    var e, i = this._data, r = i.words, n = i.sigBytes, o = this.blockSize, s = n / (4 * o), a = (s = t ? c.ceil(s) : c.max((0 | s) - this._minBufferSize, 0)) * o, t = c.min(4 * a, n);
                    if (a) {
                        for (var h = 0; h < a; h += o)
                            this._doProcessBlock(r, h);
                        e = r.splice(0, a),
                        i.sigBytes -= t
                    }
                    return new u.init(e,t)
                },
                clone: function() {
                    var t = o.clone.call(this);
                    return t._data = this._data.clone(),
                    t
                },
                _minBufferSize: 0
            })
              , d = (n.Hasher = f.extend({
                cfg: o.extend(),
                init: function(t) {
                    this.cfg = this.cfg.extend(t),
                    this.reset()
                },
                reset: function() {
                    f.reset.call(this),
                    this._doReset()
                },
                update: function(t) {
                    return this._append(t),
                    this._process(),
                    this
                },
                finalize: function(t) {
                    return t && this._append(t),
                    this._doFinalize()
                },
                blockSize: 16,
                _createHelper: function(i) {
                    return function(t, e) {
                        return new i.init(e).finalize(t)
                    }
                },
                _createHmacHelper: function(i) {
                    return function(t, e) {
                        return new d.HMAC.init(i,e).finalize(t)
                    }
                }
            }),
            t.algo = {});
            return t
        }(Math), dt = (P = (d = r).lib.WordArray,
        d.enc.Base64 = {
            stringify: function(t) {
                for (var e = t.words, i = t.sigBytes, r = this._map, n = (t.clamp(),
                []), o = 0; o < i; o += 3)
                    for (var s = (e[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (e[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | e[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, a = 0; a < 4 && o + .75 * a < i; a++)
                        n.push(r.charAt(s >>> 6 * (3 - a) & 63));
                var h = r.charAt(64);
                if (h)
                    for (; n.length % 4; )
                        n.push(h);
                return n.join("")
            },
            parse: function(t) {
                var e = t.length
                  , i = this._map;
                if (!(r = this._reverseMap))
                    for (var r = this._reverseMap = [], n = 0; n < i.length; n++)
                        r[i.charCodeAt(n)] = n;
                for (var o, s, a = i.charAt(64), h = (a && -1 !== (a = t.indexOf(a)) && (e = a),
                t), c = e, u = r, l = [], f = 0, d = 0; d < c; d++)
                    d % 4 && (o = u[h.charCodeAt(d - 1)] << d % 4 * 2,
                    s = u[h.charCodeAt(d)] >>> 6 - d % 4 * 2,
                    l[f >>> 2] |= (o | s) << 24 - f % 4 * 8,
                    f++);
                return P.create(l, f)
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        },
        Math), d = r, pt = (p = d.lib).WordArray, gt = p.Hasher, p = d.algo, x = [], yt = 0; yt < 64; yt++)
            x[yt] = 4294967296 * dt.abs(dt.sin(yt + 1)) | 0;
        function A(t, e, i, r, n, o, s) {
            t = t + (e & i | ~e & r) + n + s;
            return (t << o | t >>> 32 - o) + e
        }
        function D(t, e, i, r, n, o, s) {
            t = t + (e & r | i & ~r) + n + s;
            return (t << o | t >>> 32 - o) + e
        }
        function C(t, e, i, r, n, o, s) {
            t = t + (e ^ i ^ r) + n + s;
            return (t << o | t >>> 32 - o) + e
        }
        function k(t, e, i, r, n, o, s) {
            t = t + (i ^ (e | ~r)) + n + s;
            return (t << o | t >>> 32 - o) + e
        }
        p = p.MD5 = gt.extend({
            _doReset: function() {
                this._hash = new pt.init([1732584193, 4023233417, 2562383102, 271733878])
            },
            _doProcessBlock: function(t, e) {
                for (var i = 0; i < 16; i++) {
                    var r = e + i
                      , n = t[r];
                    t[r] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
                }
                var o = this._hash.words
                  , s = t[e + 0]
                  , a = t[e + 1]
                  , h = t[e + 2]
                  , c = t[e + 3]
                  , u = t[e + 4]
                  , l = t[e + 5]
                  , f = t[e + 6]
                  , d = t[e + 7]
                  , p = t[e + 8]
                  , g = t[e + 9]
                  , y = t[e + 10]
                  , m = t[e + 11]
                  , v = t[e + 12]
                  , w = t[e + 13]
                  , S = t[e + 14]
                  , T = t[e + 15]
                  , b = A(o[0], E = o[1], _ = o[2], B = o[3], s, 7, x[0])
                  , B = A(B, b, E, _, a, 12, x[1])
                  , _ = A(_, B, b, E, h, 17, x[2])
                  , E = A(E, _, B, b, c, 22, x[3]);
                b = A(b, E, _, B, u, 7, x[4]),
                B = A(B, b, E, _, l, 12, x[5]),
                _ = A(_, B, b, E, f, 17, x[6]),
                E = A(E, _, B, b, d, 22, x[7]),
                b = A(b, E, _, B, p, 7, x[8]),
                B = A(B, b, E, _, g, 12, x[9]),
                _ = A(_, B, b, E, y, 17, x[10]),
                E = A(E, _, B, b, m, 22, x[11]),
                b = A(b, E, _, B, v, 7, x[12]),
                B = A(B, b, E, _, w, 12, x[13]),
                _ = A(_, B, b, E, S, 17, x[14]),
                b = D(b, E = A(E, _, B, b, T, 22, x[15]), _, B, a, 5, x[16]),
                B = D(B, b, E, _, f, 9, x[17]),
                _ = D(_, B, b, E, m, 14, x[18]),
                E = D(E, _, B, b, s, 20, x[19]),
                b = D(b, E, _, B, l, 5, x[20]),
                B = D(B, b, E, _, y, 9, x[21]),
                _ = D(_, B, b, E, T, 14, x[22]),
                E = D(E, _, B, b, u, 20, x[23]),
                b = D(b, E, _, B, g, 5, x[24]),
                B = D(B, b, E, _, S, 9, x[25]),
                _ = D(_, B, b, E, c, 14, x[26]),
                E = D(E, _, B, b, p, 20, x[27]),
                b = D(b, E, _, B, w, 5, x[28]),
                B = D(B, b, E, _, h, 9, x[29]),
                _ = D(_, B, b, E, d, 14, x[30]),
                b = C(b, E = D(E, _, B, b, v, 20, x[31]), _, B, l, 4, x[32]),
                B = C(B, b, E, _, p, 11, x[33]),
                _ = C(_, B, b, E, m, 16, x[34]),
                E = C(E, _, B, b, S, 23, x[35]),
                b = C(b, E, _, B, a, 4, x[36]),
                B = C(B, b, E, _, u, 11, x[37]),
                _ = C(_, B, b, E, d, 16, x[38]),
                E = C(E, _, B, b, y, 23, x[39]),
                b = C(b, E, _, B, w, 4, x[40]),
                B = C(B, b, E, _, s, 11, x[41]),
                _ = C(_, B, b, E, c, 16, x[42]),
                E = C(E, _, B, b, f, 23, x[43]),
                b = C(b, E, _, B, g, 4, x[44]),
                B = C(B, b, E, _, v, 11, x[45]),
                _ = C(_, B, b, E, T, 16, x[46]),
                b = k(b, E = C(E, _, B, b, h, 23, x[47]), _, B, s, 6, x[48]),
                B = k(B, b, E, _, d, 10, x[49]),
                _ = k(_, B, b, E, S, 15, x[50]),
                E = k(E, _, B, b, l, 21, x[51]),
                b = k(b, E, _, B, v, 6, x[52]),
                B = k(B, b, E, _, c, 10, x[53]),
                _ = k(_, B, b, E, y, 15, x[54]),
                E = k(E, _, B, b, a, 21, x[55]),
                b = k(b, E, _, B, p, 6, x[56]),
                B = k(B, b, E, _, T, 10, x[57]),
                _ = k(_, B, b, E, f, 15, x[58]),
                E = k(E, _, B, b, w, 21, x[59]),
                b = k(b, E, _, B, u, 6, x[60]),
                B = k(B, b, E, _, m, 10, x[61]),
                _ = k(_, B, b, E, h, 15, x[62]),
                E = k(E, _, B, b, g, 21, x[63]),
                o[0] = o[0] + b | 0,
                o[1] = o[1] + E | 0,
                o[2] = o[2] + _ | 0,
                o[3] = o[3] + B | 0
            },
            _doFinalize: function() {
                for (var t = this._data, e = t.words, i = 8 * this._nDataBytes, r = 8 * t.sigBytes, n = (e[r >>> 5] |= 128 << 24 - r % 32,
                dt.floor(i / 4294967296)), n = (e[15 + (64 + r >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
                e[14 + (64 + r >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8),
                t.sigBytes = 4 * (e.length + 1),
                this._process(),
                this._hash), o = n.words, s = 0; s < 4; s++) {
                    var a = o[s];
                    o[s] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                }
                return n
            },
            clone: function() {
                var t = gt.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        }),
        d.MD5 = gt._createHelper(p),
        d.HmacMD5 = gt._createHmacHelper(p),
        p = (d = r).lib,
        L = p.WordArray,
        N = p.Hasher,
        p = d.algo,
        u = [],
        p = p.SHA1 = N.extend({
            _doReset: function() {
                this._hash = new L.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(t, e) {
                for (var i = this._hash.words, r = i[0], n = i[1], o = i[2], s = i[3], a = i[4], h = 0; h < 80; h++) {
                    u[h] = h < 16 ? 0 | t[e + h] : (c = u[h - 3] ^ u[h - 8] ^ u[h - 14] ^ u[h - 16]) << 1 | c >>> 31;
                    var c = (r << 5 | r >>> 27) + a + u[h];
                    c += h < 20 ? 1518500249 + (n & o | ~n & s) : h < 40 ? 1859775393 + (n ^ o ^ s) : h < 60 ? (n & o | n & s | o & s) - 1894007588 : (n ^ o ^ s) - 899497514,
                    a = s,
                    s = o,
                    o = n << 30 | n >>> 2,
                    n = r,
                    r = c
                }
                i[0] = i[0] + r | 0,
                i[1] = i[1] + n | 0,
                i[2] = i[2] + o | 0,
                i[3] = i[3] + s | 0,
                i[4] = i[4] + a | 0
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , i = 8 * this._nDataBytes
                  , r = 8 * t.sigBytes;
                return e[r >>> 5] |= 128 << 24 - r % 32,
                e[14 + (64 + r >>> 9 << 4)] = Math.floor(i / 4294967296),
                e[15 + (64 + r >>> 9 << 4)] = i,
                t.sigBytes = 4 * e.length,
                this._process(),
                this._hash
            },
            clone: function() {
                var t = N.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        }),
        d.SHA1 = N._createHelper(p),
        d.HmacSHA1 = N._createHmacHelper(p);
        var mt = Math
          , d = r
          , vt = (p = d.lib).WordArray
          , wt = p.Hasher
          , p = d.algo
          , St = []
          , Tt = [];
        function bt(t) {
            return 4294967296 * (t - (0 | t)) | 0
        }
        for (var Bt = 2, _t = 0; _t < 64; )
            !function(t) {
                for (var e = mt.sqrt(t), i = 2; i <= e; i++)
                    if (!(t % i))
                        return;
                return 1
            }(Bt) || (_t < 8 && (St[_t] = bt(mt.pow(Bt, .5))),
            Tt[_t] = bt(mt.pow(Bt, 1 / 3)),
            _t++),
            Bt++;
        var g = []
          , p = p.SHA256 = wt.extend({
            _doReset: function() {
                this._hash = new vt.init(St.slice(0))
            },
            _doProcessBlock: function(t, e) {
                for (var i = this._hash.words, r = i[0], n = i[1], o = i[2], s = i[3], a = i[4], h = i[5], c = i[6], u = i[7], l = 0; l < 64; l++) {
                    g[l] = l < 16 ? 0 | t[e + l] : (((f = g[l - 15]) << 25 | f >>> 7) ^ (f << 14 | f >>> 18) ^ f >>> 3) + g[l - 7] + (((f = g[l - 2]) << 15 | f >>> 17) ^ (f << 13 | f >>> 19) ^ f >>> 10) + g[l - 16];
                    var f = r & n ^ r & o ^ n & o
                      , d = u + ((a << 26 | a >>> 6) ^ (a << 21 | a >>> 11) ^ (a << 7 | a >>> 25)) + (a & h ^ ~a & c) + Tt[l] + g[l]
                      , u = c
                      , c = h
                      , h = a
                      , a = s + d | 0
                      , s = o
                      , o = n
                      , n = r
                      , r = d + (((r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22)) + f) | 0
                }
                i[0] = i[0] + r | 0,
                i[1] = i[1] + n | 0,
                i[2] = i[2] + o | 0,
                i[3] = i[3] + s | 0,
                i[4] = i[4] + a | 0,
                i[5] = i[5] + h | 0,
                i[6] = i[6] + c | 0,
                i[7] = i[7] + u | 0
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , i = 8 * this._nDataBytes
                  , r = 8 * t.sigBytes;
                return e[r >>> 5] |= 128 << 24 - r % 32,
                e[14 + (64 + r >>> 9 << 4)] = mt.floor(i / 4294967296),
                e[15 + (64 + r >>> 9 << 4)] = i,
                t.sigBytes = 4 * e.length,
                this._process(),
                this._hash
            },
            clone: function() {
                var t = wt.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        })
          , d = (d.SHA256 = wt._createHelper(p),
        d.HmacSHA256 = wt._createHmacHelper(p),
        r)
          , Et = d.lib.WordArray;
        function xt(t) {
            return t << 8 & 4278255360 | t >>> 8 & 16711935
        }
        function At(t, e, i) {
            return t & e | ~t & i
        }
        function Dt(t, e, i) {
            return t & i | e & ~i
        }
        function Ct(t, e) {
            return t << e | t >>> 32 - e
        }
        (d = d.enc).Utf16 = d.Utf16BE = {
            stringify: function(t) {
                for (var e = t.words, i = t.sigBytes, r = [], n = 0; n < i; n += 2) {
                    var o = e[n >>> 2] >>> 16 - n % 4 * 8 & 65535;
                    r.push(String.fromCharCode(o))
                }
                return r.join("")
            },
            parse: function(t) {
                for (var e = t.length, i = [], r = 0; r < e; r++)
                    i[r >>> 1] |= t.charCodeAt(r) << 16 - r % 2 * 16;
                return Et.create(i, 2 * e)
            }
        },
        d.Utf16LE = {
            stringify: function(t) {
                for (var e = t.words, i = t.sigBytes, r = [], n = 0; n < i; n += 2) {
                    var o = xt(e[n >>> 2] >>> 16 - n % 4 * 8 & 65535);
                    r.push(String.fromCharCode(o))
                }
                return r.join("")
            },
            parse: function(t) {
                for (var e = t.length, i = [], r = 0; r < e; r++)
                    i[r >>> 1] |= xt(t.charCodeAt(r) << 16 - r % 2 * 16);
                return Et.create(i, 2 * e)
            }
        },
        "function" == typeof ArrayBuffer && (p = r.lib.WordArray,
        V = p.init,
        (p.init = function(t) {
            if ((t = (t = t instanceof ArrayBuffer ? new Uint8Array(t) : t)instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array ? new Uint8Array(t.buffer,t.byteOffset,t.byteLength) : t)instanceof Uint8Array) {
                for (var e = t.byteLength, i = [], r = 0; r < e; r++)
                    i[r >>> 2] |= t[r] << 24 - r % 4 * 8;
                V.call(this, i, e)
            } else
                V.apply(this, arguments)
        }
        ).prototype = p),
        Math,
        p = (d = r).lib,
        t = p.WordArray,
        H = p.Hasher,
        p = d.algo,
        F = t.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13]),
        U = t.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11]),
        j = t.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6]),
        z = t.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]),
        G = t.create([0, 1518500249, 1859775393, 2400959708, 2840853838]),
        q = t.create([1352829926, 1548603684, 1836072691, 2053994217, 0]),
        p = p.RIPEMD160 = H.extend({
            _doReset: function() {
                this._hash = t.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(t, e) {
                for (var i = 0; i < 16; i++) {
                    var r = e + i
                      , n = t[r];
                    t[r] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8)
                }
                for (var o, s, a, h, c, u, l = this._hash.words, f = G.words, d = q.words, p = F.words, g = U.words, y = j.words, m = z.words, v = o = l[0], w = s = l[1], S = a = l[2], T = h = l[3], b = c = l[4], i = 0; i < 80; i += 1)
                    u = (u = Ct(u = (u = o + t[e + p[i]] | 0) + (i < 16 ? (s ^ a ^ h) + f[0] : i < 32 ? At(s, a, h) + f[1] : i < 48 ? ((s | ~a) ^ h) + f[2] : i < 64 ? Dt(s, a, h) + f[3] : (s ^ (a | ~h)) + f[4]) | 0, y[i])) + c | 0,
                    o = c,
                    c = h,
                    h = Ct(a, 10),
                    a = s,
                    s = u,
                    u = (u = Ct(u = (u = v + t[e + g[i]] | 0) + (i < 16 ? (w ^ (S | ~T)) + d[0] : i < 32 ? Dt(w, S, T) + d[1] : i < 48 ? ((w | ~S) ^ T) + d[2] : i < 64 ? At(w, S, T) + d[3] : (w ^ S ^ T) + d[4]) | 0, m[i])) + b | 0,
                    v = b,
                    b = T,
                    T = Ct(S, 10),
                    S = w,
                    w = u;
                u = l[1] + a + T | 0,
                l[1] = l[2] + h + b | 0,
                l[2] = l[3] + c + v | 0,
                l[3] = l[4] + o + w | 0,
                l[4] = l[0] + s + S | 0,
                l[0] = u
            },
            _doFinalize: function() {
                for (var t = this._data, e = t.words, i = 8 * this._nDataBytes, r = 8 * t.sigBytes, r = (e[r >>> 5] |= 128 << 24 - r % 32,
                e[14 + (64 + r >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8),
                t.sigBytes = 4 * (e.length + 1),
                this._process(),
                this._hash), n = r.words, o = 0; o < 5; o++) {
                    var s = n[o];
                    n[o] = 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8)
                }
                return r
            },
            clone: function() {
                var t = H.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        }),
        d.RIPEMD160 = H._createHelper(p),
        d.HmacRIPEMD160 = H._createHmacHelper(p),
        p = (d = r).lib.Base,
        K = d.enc.Utf8,
        d.algo.HMAC = p.extend({
            init: function(t, e) {
                t = this._hasher = new t.init,
                "string" == typeof e && (e = K.parse(e));
                for (var i = t.blockSize, r = 4 * i, t = ((e = e.sigBytes > r ? t.finalize(e) : e).clamp(),
                this._oKey = e.clone()), e = this._iKey = e.clone(), n = t.words, o = e.words, s = 0; s < i; s++)
                    n[s] ^= 1549556828,
                    o[s] ^= 909522486;
                t.sigBytes = e.sigBytes = r,
                this.reset()
            },
            reset: function() {
                var t = this._hasher;
                t.reset(),
                t.update(this._iKey)
            },
            update: function(t) {
                return this._hasher.update(t),
                this
            },
            finalize: function(t) {
                var e = this._hasher
                  , t = e.finalize(t);
                return e.reset(),
                e.finalize(this._oKey.clone().concat(t))
            }
        }),
        p = (d = r).lib,
        y = p.Base,
        W = p.WordArray,
        p = d.algo,
        m = p.SHA1,
        X = p.HMAC,
        Z = p.PBKDF2 = y.extend({
            cfg: y.extend({
                keySize: 4,
                hasher: m,
                iterations: 1
            }),
            init: function(t) {
                this.cfg = this.cfg.extend(t)
            },
            compute: function(t, e) {
                for (var i = this.cfg, r = X.create(i.hasher, t), n = W.create(), o = W.create([1]), s = n.words, a = o.words, h = i.keySize, c = i.iterations; s.length < h; ) {
                    for (var u = r.update(e).finalize(o), l = (r.reset(),
                    u.words), f = l.length, d = u, p = 1; p < c; p++) {
                        d = r.finalize(d),
                        r.reset();
                        for (var g = d.words, y = 0; y < f; y++)
                            l[y] ^= g[y]
                    }
                    n.concat(u),
                    a[0]++
                }
                return n.sigBytes = 4 * h,
                n
            }
        }),
        d.PBKDF2 = function(t, e, i) {
            return Z.create(i).compute(t, e)
        }
        ,
        y = (p = r).lib,
        m = y.Base,
        J = y.WordArray,
        y = p.algo,
        d = y.MD5,
        Y = y.EvpKDF = m.extend({
            cfg: m.extend({
                keySize: 4,
                hasher: d,
                iterations: 1
            }),
            init: function(t) {
                this.cfg = this.cfg.extend(t)
            },
            compute: function(t, e) {
                for (var i, r = this.cfg, n = r.hasher.create(), o = J.create(), s = o.words, a = r.keySize, h = r.iterations; s.length < a; ) {
                    i && n.update(i),
                    i = n.update(t).finalize(e),
                    n.reset();
                    for (var c = 1; c < h; c++)
                        i = n.finalize(i),
                        n.reset();
                    o.concat(i)
                }
                return o.sigBytes = 4 * a,
                o
            }
        }),
        p.EvpKDF = function(t, e, i) {
            return Y.create(i).compute(t, e)
        }
        ,
        $ = (y = r).lib.WordArray,
        m = y.algo,
        Q = m.SHA256,
        m = m.SHA224 = Q.extend({
            _doReset: function() {
                this._hash = new $.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
            },
            _doFinalize: function() {
                var t = Q._doFinalize.call(this);
                return t.sigBytes -= 4,
                t
            }
        }),
        y.SHA224 = Q._createHelper(m),
        y.HmacSHA224 = Q._createHmacHelper(m),
        p = (d = r).lib,
        tt = p.Base,
        it = p.WordArray,
        (p = d.x64 = {}).Word = tt.extend({
            init: function(t, e) {
                this.high = t,
                this.low = e
            }
        }),
        p.WordArray = tt.extend({
            init: function(t, e) {
                t = this.words = t || [],
                this.sigBytes = null != e ? e : 8 * t.length
            },
            toX32: function() {
                for (var t = this.words, e = t.length, i = [], r = 0; r < e; r++) {
                    var n = t[r];
                    i.push(n.high),
                    i.push(n.low)
                }
                return it.create(i, this.sigBytes)
            },
            clone: function() {
                for (var t = tt.clone.call(this), e = t.words = this.words.slice(0), i = e.length, r = 0; r < i; r++)
                    e[r] = e[r].clone();
                return t
            }
        });
        for (var kt = Math, y = r, Ot = (m = y.lib).WordArray, Rt = m.Hasher, Mt = y.x64.Word, m = y.algo, It = [], Pt = [], Lt = [], v = 1, w = 0, Nt = 0; Nt < 24; Nt++) {
            It[v + 5 * w] = (Nt + 1) * (Nt + 2) / 2 % 64;
            var Vt = (2 * v + 3 * w) % 5;
            v = w % 5,
            w = Vt
        }
        for (v = 0; v < 5; v++)
            for (w = 0; w < 5; w++)
                Pt[v + 5 * w] = w + (2 * v + 3 * w) % 5 * 5;
        for (var Ht = 1, Ft = 0; Ft < 24; Ft++) {
            for (var Ut, jt = 0, zt = 0, Gt = 0; Gt < 7; Gt++)
                1 & Ht && ((Ut = (1 << Gt) - 1) < 32 ? zt ^= 1 << Ut : jt ^= 1 << Ut - 32),
                128 & Ht ? Ht = Ht << 1 ^ 113 : Ht <<= 1;
            Lt[Ft] = Mt.create(jt, zt)
        }
        for (var O = [], qt = 0; qt < 25; qt++)
            O[qt] = Mt.create();
        m = m.SHA3 = Rt.extend({
            cfg: Rt.cfg.extend({
                outputLength: 512
            }),
            _doReset: function() {
                for (var t = this._state = [], e = 0; e < 25; e++)
                    t[e] = new Mt.init;
                this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
            },
            _doProcessBlock: function(t, e) {
                for (var i = this._state, r = this.blockSize / 2, n = 0; n < r; n++) {
                    var o = t[e + 2 * n]
                      , s = t[e + 2 * n + 1]
                      , o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
                    (b = i[n]).high ^= 16711935 & (s << 8 | s >>> 24) | 4278255360 & (s << 24 | s >>> 8),
                    b.low ^= o
                }
                for (var a = 0; a < 24; a++) {
                    for (var h = 0; h < 5; h++) {
                        for (var c = 0, u = 0, l = 0; l < 5; l++)
                            c ^= (b = i[h + 5 * l]).high,
                            u ^= b.low;
                        var f = O[h];
                        f.high = c,
                        f.low = u
                    }
                    for (h = 0; h < 5; h++)
                        for (var d = O[(h + 4) % 5], p = O[(h + 1) % 5], g = p.high, p = p.low, c = d.high ^ (g << 1 | p >>> 31), u = d.low ^ (p << 1 | g >>> 31), l = 0; l < 5; l++)
                            (b = i[h + 5 * l]).high ^= c,
                            b.low ^= u;
                    for (var y = 1; y < 25; y++) {
                        var m = (b = i[y]).high
                          , v = b.low
                          , w = It[y]
                          , m = (u = w < 32 ? (c = m << w | v >>> 32 - w,
                        v << w | m >>> 32 - w) : (c = v << w - 32 | m >>> 64 - w,
                        m << w - 32 | v >>> 64 - w),
                        O[Pt[y]]);
                        m.high = c,
                        m.low = u
                    }
                    var S = O[0]
                      , T = i[0];
                    S.high = T.high,
                    S.low = T.low;
                    for (h = 0; h < 5; h++)
                        for (l = 0; l < 5; l++) {
                            var b = i[y = h + 5 * l]
                              , B = O[y]
                              , _ = O[(h + 1) % 5 + 5 * l]
                              , E = O[(h + 2) % 5 + 5 * l];
                            b.high = B.high ^ ~_.high & E.high,
                            b.low = B.low ^ ~_.low & E.low
                        }
                    b = i[0],
                    S = Lt[a];
                    b.high ^= S.high,
                    b.low ^= S.low
                }
            },
            _doFinalize: function() {
                for (var t = this._data, e = t.words, i = (this._nDataBytes,
                8 * t.sigBytes), r = 32 * this.blockSize, n = (e[i >>> 5] |= 1 << 24 - i % 32,
                e[(kt.ceil((1 + i) / r) * r >>> 5) - 1] |= 128,
                t.sigBytes = 4 * e.length,
                this._process(),
                this._state), i = this.cfg.outputLength / 8, o = i / 8, s = [], a = 0; a < o; a++) {
                    var h = n[a]
                      , c = h.high
                      , h = h.low
                      , c = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8);
                    s.push(16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8)),
                    s.push(c)
                }
                return new Ot.init(s,i)
            },
            clone: function() {
                for (var t = Rt.clone.call(this), e = t._state = this._state.slice(0), i = 0; i < 25; i++)
                    e[i] = e[i].clone();
                return t
            }
        }),
        y.SHA3 = Rt._createHelper(m),
        y.HmacSHA3 = Rt._createHmacHelper(m);
        var d = r
          , Kt = d.lib.Hasher
          , S = (p = d.x64).Word
          , Wt = p.WordArray
          , p = d.algo;
        function T() {
            return S.create.apply(S, arguments)
        }
        for (var Xt = [T(1116352408, 3609767458), T(1899447441, 602891725), T(3049323471, 3964484399), T(3921009573, 2173295548), T(961987163, 4081628472), T(1508970993, 3053834265), T(2453635748, 2937671579), T(2870763221, 3664609560), T(3624381080, 2734883394), T(310598401, 1164996542), T(607225278, 1323610764), T(1426881987, 3590304994), T(1925078388, 4068182383), T(2162078206, 991336113), T(2614888103, 633803317), T(3248222580, 3479774868), T(3835390401, 2666613458), T(4022224774, 944711139), T(264347078, 2341262773), T(604807628, 2007800933), T(770255983, 1495990901), T(1249150122, 1856431235), T(1555081692, 3175218132), T(1996064986, 2198950837), T(2554220882, 3999719339), T(2821834349, 766784016), T(2952996808, 2566594879), T(3210313671, 3203337956), T(3336571891, 1034457026), T(3584528711, 2466948901), T(113926993, 3758326383), T(338241895, 168717936), T(666307205, 1188179964), T(773529912, 1546045734), T(1294757372, 1522805485), T(1396182291, 2643833823), T(1695183700, 2343527390), T(1986661051, 1014477480), T(2177026350, 1206759142), T(2456956037, 344077627), T(2730485921, 1290863460), T(2820302411, 3158454273), T(3259730800, 3505952657), T(3345764771, 106217008), T(3516065817, 3606008344), T(3600352804, 1432725776), T(4094571909, 1467031594), T(275423344, 851169720), T(430227734, 3100823752), T(506948616, 1363258195), T(659060556, 3750685593), T(883997877, 3785050280), T(958139571, 3318307427), T(1322822218, 3812723403), T(1537002063, 2003034995), T(1747873779, 3602036899), T(1955562222, 1575990012), T(2024104815, 1125592928), T(2227730452, 2716904306), T(2361852424, 442776044), T(2428436474, 593698344), T(2756734187, 3733110249), T(3204031479, 2999351573), T(3329325298, 3815920427), T(3391569614, 3928383900), T(3515267271, 566280711), T(3940187606, 3454069534), T(4118630271, 4000239992), T(116418474, 1914138554), T(174292421, 2731055270), T(289380356, 3203993006), T(460393269, 320620315), T(685471733, 587496836), T(852142971, 1086792851), T(1017036298, 365543100), T(1126000580, 2618297676), T(1288033470, 3409855158), T(1501505948, 4234509866), T(1607167915, 987167468), T(1816402316, 1246189591)], et = [], Zt = 0; Zt < 80; Zt++)
            et[Zt] = T();
        function Jt(t) {
            return "string" == typeof t ? ut : n
        }
        function Yt(t, e, i) {
            var r, n = this._iv;
            n ? (r = n,
            this._iv = void 0) : r = this._prevBlock;
            for (var o = 0; o < i; o++)
                t[e + o] ^= r[o]
        }
        function $t(t, e, i, r) {
            var n, o = this._iv;
            o ? (n = o.slice(0),
            this._iv = void 0) : n = this._prevBlock,
            r.encryptBlock(n, 0);
            for (var s = 0; s < i; s++)
                t[e + s] ^= n[s]
        }
        p = p.SHA512 = Kt.extend({
            _doReset: function() {
                this._hash = new Wt.init([new S.init(1779033703,4089235720), new S.init(3144134277,2227873595), new S.init(1013904242,4271175723), new S.init(2773480762,1595750129), new S.init(1359893119,2917565137), new S.init(2600822924,725511199), new S.init(528734635,4215389547), new S.init(1541459225,327033209)])
            },
            _doProcessBlock: function(L, N) {
                for (var t = this._hash.words, e = t[0], i = t[1], r = t[2], n = t[3], o = t[4], s = t[5], a = t[6], t = t[7], V = e.high, h = e.low, H = i.high, c = i.low, F = r.high, u = r.low, U = n.high, l = n.low, j = o.high, f = o.low, z = s.high, d = s.low, G = a.high, p = a.low, q = t.high, g = t.low, y = V, m = h, v = H, w = c, S = F, T = u, K = U, b = l, B = j, _ = f, W = z, E = d, X = G, Z = p, J = q, Y = g, x = 0; x < 80; x++)
                    var A, D, C = et[x], k = (x < 16 ? (D = C.high = 0 | L[N + 2 * x],
                    A = C.low = 0 | L[N + 2 * x + 1]) : (P = (I = et[x - 15]).high,
                    I = I.low,
                    M = (R = et[x - 2]).high,
                    R = R.low,
                    O = (k = et[x - 7]).high,
                    k = k.low,
                    Q = ($ = et[x - 16]).high,
                    D = (D = ((P >>> 1 | I << 31) ^ (P >>> 8 | I << 24) ^ P >>> 7) + O + ((A = (O = (I >>> 1 | P << 31) ^ (I >>> 8 | P << 24) ^ (I >>> 7 | P << 25)) + k) >>> 0 < O >>> 0 ? 1 : 0)) + ((M >>> 19 | R << 13) ^ (M << 3 | R >>> 29) ^ M >>> 6) + ((A += I = (R >>> 19 | M << 13) ^ (R << 3 | M >>> 29) ^ (R >>> 6 | M << 26)) >>> 0 < I >>> 0 ? 1 : 0),
                    A += P = $.low,
                    C.high = D = D + Q + (A >>> 0 < P >>> 0 ? 1 : 0),
                    C.low = A),
                    B & W ^ ~B & X), O = _ & E ^ ~_ & Z, R = y & v ^ y & S ^ v & S, M = (m >>> 28 | y << 4) ^ (m << 30 | y >>> 2) ^ (m << 25 | y >>> 7), I = Xt[x], $ = I.high, Q = I.low, P = Y + ((_ >>> 14 | B << 18) ^ (_ >>> 18 | B << 14) ^ (_ << 23 | B >>> 9)), C = J + ((B >>> 14 | _ << 18) ^ (B >>> 18 | _ << 14) ^ (B << 23 | _ >>> 9)) + (P >>> 0 < Y >>> 0 ? 1 : 0), tt = M + (m & w ^ m & T ^ w & T), J = X, Y = Z, X = W, Z = E, W = B, E = _, B = K + (C = C + k + ((P = P + O) >>> 0 < O >>> 0 ? 1 : 0) + $ + ((P = P + Q) >>> 0 < Q >>> 0 ? 1 : 0) + D + ((P = P + A) >>> 0 < A >>> 0 ? 1 : 0)) + ((_ = b + P | 0) >>> 0 < b >>> 0 ? 1 : 0) | 0, K = S, b = T, S = v, T = w, v = y, w = m, y = C + (((y >>> 28 | m << 4) ^ (y << 30 | m >>> 2) ^ (y << 25 | m >>> 7)) + R + (tt >>> 0 < M >>> 0 ? 1 : 0)) + ((m = P + tt | 0) >>> 0 < P >>> 0 ? 1 : 0) | 0;
                h = e.low = h + m,
                e.high = V + y + (h >>> 0 < m >>> 0 ? 1 : 0),
                c = i.low = c + w,
                i.high = H + v + (c >>> 0 < w >>> 0 ? 1 : 0),
                u = r.low = u + T,
                r.high = F + S + (u >>> 0 < T >>> 0 ? 1 : 0),
                l = n.low = l + b,
                n.high = U + K + (l >>> 0 < b >>> 0 ? 1 : 0),
                f = o.low = f + _,
                o.high = j + B + (f >>> 0 < _ >>> 0 ? 1 : 0),
                d = s.low = d + E,
                s.high = z + W + (d >>> 0 < E >>> 0 ? 1 : 0),
                p = a.low = p + Z,
                a.high = G + X + (p >>> 0 < Z >>> 0 ? 1 : 0),
                g = t.low = g + Y,
                t.high = q + J + (g >>> 0 < Y >>> 0 ? 1 : 0)
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , i = 8 * this._nDataBytes
                  , r = 8 * t.sigBytes;
                return e[r >>> 5] |= 128 << 24 - r % 32,
                e[30 + (128 + r >>> 10 << 5)] = Math.floor(i / 4294967296),
                e[31 + (128 + r >>> 10 << 5)] = i,
                t.sigBytes = 4 * e.length,
                this._process(),
                this._hash.toX32()
            },
            clone: function() {
                var t = Kt.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            },
            blockSize: 32
        }),
        d.SHA512 = Kt._createHelper(p),
        d.HmacSHA512 = Kt._createHmacHelper(p),
        m = (y = r).x64,
        e = m.Word,
        rt = m.WordArray,
        m = y.algo,
        nt = m.SHA512,
        m = m.SHA384 = nt.extend({
            _doReset: function() {
                this._hash = new rt.init([new e.init(3418070365,3238371032), new e.init(1654270250,914150663), new e.init(2438529370,812702999), new e.init(355462360,4144912697), new e.init(1731405415,4290775857), new e.init(2394180231,1750603025), new e.init(3675008525,1694076839), new e.init(1203062813,3204075428)])
            },
            _doFinalize: function() {
                var t = nt._doFinalize.call(this);
                return t.sigBytes -= 16,
                t
            }
        }),
        y.SHA384 = nt._createHelper(m),
        y.HmacSHA384 = nt._createHmacHelper(m),
        r.lib.Cipher || (p = (d = r).lib,
        y = p.Base,
        s = p.WordArray,
        ot = p.BufferedBlockAlgorithm,
        (m = d.enc).Utf8,
        st = m.Base64,
        at = d.algo.EvpKDF,
        ht = p.Cipher = ot.extend({
            cfg: y.extend(),
            createEncryptor: function(t, e) {
                return this.create(this._ENC_XFORM_MODE, t, e)
            },
            createDecryptor: function(t, e) {
                return this.create(this._DEC_XFORM_MODE, t, e)
            },
            init: function(t, e, i) {
                this.cfg = this.cfg.extend(i),
                this._xformMode = t,
                this._key = e,
                this.reset()
            },
            reset: function() {
                ot.reset.call(this),
                this._doReset()
            },
            process: function(t) {
                return this._append(t),
                this._process()
            },
            finalize: function(t) {
                return t && this._append(t),
                this._doFinalize()
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function(r) {
                return {
                    encrypt: function(t, e, i) {
                        return Jt(e).encrypt(r, t, e, i)
                    },
                    decrypt: function(t, e, i) {
                        return Jt(e).decrypt(r, t, e, i)
                    }
                }
            }
        }),
        p.StreamCipher = ht.extend({
            _doFinalize: function() {
                return this._process(!0)
            },
            blockSize: 1
        }),
        m = d.mode = {},
        i = p.BlockCipherMode = y.extend({
            createEncryptor: function(t, e) {
                return this.Encryptor.create(t, e)
            },
            createDecryptor: function(t, e) {
                return this.Decryptor.create(t, e)
            },
            init: function(t, e) {
                this._cipher = t,
                this._iv = e
            }
        }),
        i = m.CBC = ((m = i.extend()).Encryptor = m.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize;
                Yt.call(this, t, e, r),
                i.encryptBlock(t, e),
                this._prevBlock = t.slice(e, e + r)
            }
        }),
        m.Decryptor = m.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize
                  , n = t.slice(e, e + r);
                i.decryptBlock(t, e),
                Yt.call(this, t, e, r),
                this._prevBlock = n
            }
        }),
        m),
        m = (d.pad = {}).Pkcs7 = {
            pad: function(t, e) {
                for (var e = 4 * e, i = e - t.sigBytes % e, r = i << 24 | i << 16 | i << 8 | i, n = [], o = 0; o < i; o += 4)
                    n.push(r);
                e = s.create(n, i);
                t.concat(e)
            },
            unpad: function(t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        },
        p.BlockCipher = ht.extend({
            cfg: ht.cfg.extend({
                mode: i,
                padding: m
            }),
            reset: function() {
                ht.reset.call(this);
                var t, e = this.cfg, i = e.iv, e = e.mode;
                this._xformMode == this._ENC_XFORM_MODE ? t = e.createEncryptor : (t = e.createDecryptor,
                this._minBufferSize = 1),
                this._mode && this._mode.__creator == t ? this._mode.init(this, i && i.words) : (this._mode = t.call(e, this, i && i.words),
                this._mode.__creator = t)
            },
            _doProcessBlock: function(t, e) {
                this._mode.processBlock(t, e)
            },
            _doFinalize: function() {
                var t, e = this.cfg.padding;
                return this._xformMode == this._ENC_XFORM_MODE ? (e.pad(this._data, this.blockSize),
                t = this._process(!0)) : (t = this._process(!0),
                e.unpad(t)),
                t
            },
            blockSize: 4
        }),
        ct = p.CipherParams = y.extend({
            init: function(t) {
                this.mixIn(t)
            },
            toString: function(t) {
                return (t || this.formatter).stringify(this)
            }
        }),
        i = (d.format = {}).OpenSSL = {
            stringify: function(t) {
                var e = t.ciphertext
                  , t = t.salt
                  , t = t ? s.create([1398893684, 1701076831]).concat(t).concat(e) : e;
                return t.toString(st)
            },
            parse: function(t) {
                var e, t = st.parse(t), i = t.words;
                return 1398893684 == i[0] && 1701076831 == i[1] && (e = s.create(i.slice(2, 4)),
                i.splice(0, 4),
                t.sigBytes -= 16),
                ct.create({
                    ciphertext: t,
                    salt: e
                })
            }
        },
        n = p.SerializableCipher = y.extend({
            cfg: y.extend({
                format: i
            }),
            encrypt: function(t, e, i, r) {
                r = this.cfg.extend(r);
                var n = t.createEncryptor(i, r)
                  , e = n.finalize(e)
                  , n = n.cfg;
                return ct.create({
                    ciphertext: e,
                    key: i,
                    iv: n.iv,
                    algorithm: t,
                    mode: n.mode,
                    padding: n.padding,
                    blockSize: t.blockSize,
                    formatter: r.format
                })
            },
            decrypt: function(t, e, i, r) {
                return r = this.cfg.extend(r),
                e = this._parse(e, r.format),
                t.createDecryptor(i, r).finalize(e.ciphertext)
            },
            _parse: function(t, e) {
                return "string" == typeof t ? e.parse(t, this) : t
            }
        }),
        m = (d.kdf = {}).OpenSSL = {
            execute: function(t, e, i, r) {
                r = r || s.random(8);
                t = at.create({
                    keySize: e + i
                }).compute(t, r),
                i = s.create(t.words.slice(e), 4 * i);
                return t.sigBytes = 4 * e,
                ct.create({
                    key: t,
                    iv: i,
                    salt: r
                })
            }
        },
        ut = p.PasswordBasedCipher = n.extend({
            cfg: n.cfg.extend({
                kdf: m
            }),
            encrypt: function(t, e, i, r) {
                i = (r = this.cfg.extend(r)).kdf.execute(i, t.keySize, t.ivSize),
                r.iv = i.iv,
                t = n.encrypt.call(this, t, e, i.key, r);
                return t.mixIn(i),
                t
            },
            decrypt: function(t, e, i, r) {
                r = this.cfg.extend(r),
                e = this._parse(e, r.format);
                i = r.kdf.execute(i, t.keySize, t.ivSize, e.salt);
                return r.iv = i.iv,
                n.decrypt.call(this, t, e, i.key, r)
            }
        })),
        r.mode.CFB = ((y = r.lib.BlockCipherMode.extend()).Encryptor = y.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize;
                $t.call(this, t, e, r, i),
                this._prevBlock = t.slice(e, e + r)
            }
        }),
        y.Decryptor = y.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize
                  , n = t.slice(e, e + r);
                $t.call(this, t, e, r, i),
                this._prevBlock = n
            }
        }),
        y),
        r.mode.ECB = ((i = r.lib.BlockCipherMode.extend()).Encryptor = i.extend({
            processBlock: function(t, e) {
                this._cipher.encryptBlock(t, e)
            }
        }),
        i.Decryptor = i.extend({
            processBlock: function(t, e) {
                this._cipher.decryptBlock(t, e)
            }
        }),
        i),
        r.pad.AnsiX923 = {
            pad: function(t, e) {
                var i = t.sigBytes
                  , e = 4 * e
                  , e = e - i % e
                  , i = i + e - 1;
                t.clamp(),
                t.words[i >>> 2] |= e << 24 - i % 4 * 8,
                t.sigBytes += e
            },
            unpad: function(t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        },
        r.pad.Iso10126 = {
            pad: function(t, e) {
                e *= 4,
                e -= t.sigBytes % e;
                t.concat(r.lib.WordArray.random(e - 1)).concat(r.lib.WordArray.create([e << 24], 1))
            },
            unpad: function(t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        },
        r.pad.Iso97971 = {
            pad: function(t, e) {
                t.concat(r.lib.WordArray.create([2147483648], 1)),
                r.pad.ZeroPadding.pad(t, e)
            },
            unpad: function(t) {
                r.pad.ZeroPadding.unpad(t),
                t.sigBytes--
            }
        },
        r.mode.OFB = (d = r.lib.BlockCipherMode.extend(),
        p = d.Encryptor = d.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize
                  , n = this._iv
                  , o = this._keystream;
                n && (o = this._keystream = n.slice(0),
                this._iv = void 0),
                i.encryptBlock(o, 0);
                for (var s = 0; s < r; s++)
                    t[e + s] ^= o[s]
            }
        }),
        d.Decryptor = p,
        d),
        r.pad.NoPadding = {
            pad: function() {},
            unpad: function() {}
        },
        lt = (m = r).lib.CipherParams,
        ft = m.enc.Hex,
        m.format.Hex = {
            stringify: function(t) {
                return t.ciphertext.toString(ft)
            },
            parse: function(t) {
                t = ft.parse(t);
                return lt.create({
                    ciphertext: t
                })
            }
        };
        for (var y = r, p = y.lib.BlockCipher, d = y.algo, b = [], Qt = [], te = [], ee = [], ie = [], re = [], ne = [], oe = [], se = [], ae = [], B = [], _ = 0; _ < 256; _++)
            B[_] = _ < 128 ? _ << 1 : _ << 1 ^ 283;
        for (var E = 0, R = 0, _ = 0; _ < 256; _++) {
            var M = R ^ R << 1 ^ R << 2 ^ R << 3 ^ R << 4
              , he = B[Qt[b[E] = M = M >>> 8 ^ 255 & M ^ 99] = E]
              , ce = B[he]
              , ue = B[ce]
              , I = 257 * B[M] ^ 16843008 * M;
            te[E] = I << 24 | I >>> 8,
            ee[E] = I << 16 | I >>> 16,
            ie[E] = I << 8 | I >>> 24,
            re[E] = I,
            ne[M] = (I = 16843009 * ue ^ 65537 * ce ^ 257 * he ^ 16843008 * E) << 24 | I >>> 8,
            oe[M] = I << 16 | I >>> 16,
            se[M] = I << 8 | I >>> 24,
            ae[M] = I,
            E ? (E = he ^ B[B[B[ue ^ he]]],
            R ^= B[B[R]]) : E = R = 1
        }
        var le = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
          , d = d.AES = p.extend({
            _doReset: function() {
                if (!this._nRounds || this._keyPriorReset !== this._key) {
                    for (var t = this._keyPriorReset = this._key, e = t.words, i = t.sigBytes / 4, r = 4 * (1 + (this._nRounds = 6 + i)), n = this._keySchedule = [], o = 0; o < r; o++)
                        o < i ? n[o] = e[o] : (h = n[o - 1],
                        o % i ? 6 < i && o % i == 4 && (h = b[h >>> 24] << 24 | b[h >>> 16 & 255] << 16 | b[h >>> 8 & 255] << 8 | b[255 & h]) : (h = b[(h = h << 8 | h >>> 24) >>> 24] << 24 | b[h >>> 16 & 255] << 16 | b[h >>> 8 & 255] << 8 | b[255 & h],
                        h ^= le[o / i | 0] << 24),
                        n[o] = n[o - i] ^ h);
                    for (var s = this._invKeySchedule = [], a = 0; a < r; a++) {
                        var h, o = r - a;
                        h = a % 4 ? n[o] : n[o - 4],
                        s[a] = a < 4 || o <= 4 ? h : ne[b[h >>> 24]] ^ oe[b[h >>> 16 & 255]] ^ se[b[h >>> 8 & 255]] ^ ae[b[255 & h]]
                    }
                }
            },
            encryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._keySchedule, te, ee, ie, re, b)
            },
            decryptBlock: function(t, e) {
                var i = t[e + 1]
                  , i = (t[e + 1] = t[e + 3],
                t[e + 3] = i,
                this._doCryptBlock(t, e, this._invKeySchedule, ne, oe, se, ae, Qt),
                t[e + 1]);
                t[e + 1] = t[e + 3],
                t[e + 3] = i
            },
            _doCryptBlock: function(t, e, i, r, n, o, s, a) {
                for (var h = this._nRounds, c = t[e] ^ i[0], u = t[e + 1] ^ i[1], l = t[e + 2] ^ i[2], f = t[e + 3] ^ i[3], d = 4, p = 1; p < h; p++)
                    var g = r[c >>> 24] ^ n[u >>> 16 & 255] ^ o[l >>> 8 & 255] ^ s[255 & f] ^ i[d++]
                      , y = r[u >>> 24] ^ n[l >>> 16 & 255] ^ o[f >>> 8 & 255] ^ s[255 & c] ^ i[d++]
                      , m = r[l >>> 24] ^ n[f >>> 16 & 255] ^ o[c >>> 8 & 255] ^ s[255 & u] ^ i[d++]
                      , v = r[f >>> 24] ^ n[c >>> 16 & 255] ^ o[u >>> 8 & 255] ^ s[255 & l] ^ i[d++]
                      , c = g
                      , u = y
                      , l = m
                      , f = v;
                g = (a[c >>> 24] << 24 | a[u >>> 16 & 255] << 16 | a[l >>> 8 & 255] << 8 | a[255 & f]) ^ i[d++],
                y = (a[u >>> 24] << 24 | a[l >>> 16 & 255] << 16 | a[f >>> 8 & 255] << 8 | a[255 & c]) ^ i[d++],
                m = (a[l >>> 24] << 24 | a[f >>> 16 & 255] << 16 | a[c >>> 8 & 255] << 8 | a[255 & u]) ^ i[d++],
                v = (a[f >>> 24] << 24 | a[c >>> 16 & 255] << 16 | a[u >>> 8 & 255] << 8 | a[255 & l]) ^ i[d++];
                t[e] = g,
                t[e + 1] = y,
                t[e + 2] = m,
                t[e + 3] = v
            },
            keySize: 8
        })
          , m = (y.AES = p._createHelper(d),
        r)
          , fe = (y = m.lib).WordArray
          , y = y.BlockCipher
          , p = m.algo
          , de = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]
          , pe = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]
          , ge = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]
          , ye = [{
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
        }, {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
        }, {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
        }, {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
        }, {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
        }, {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
        }, {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
        }, {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
        }]
          , me = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679]
          , ve = p.DES = y.extend({
            _doReset: function() {
                for (var t = this._key.words, e = [], i = 0; i < 56; i++) {
                    var r = de[i] - 1;
                    e[i] = t[r >>> 5] >>> 31 - r % 32 & 1
                }
                for (var n = this._subKeys = [], o = 0; o < 16; o++) {
                    for (var s = n[o] = [], a = ge[o], i = 0; i < 24; i++)
                        s[i / 6 | 0] |= e[(pe[i] - 1 + a) % 28] << 31 - i % 6,
                        s[4 + (i / 6 | 0)] |= e[28 + (pe[i + 24] - 1 + a) % 28] << 31 - i % 6;
                    s[0] = s[0] << 1 | s[0] >>> 31;
                    for (i = 1; i < 7; i++)
                        s[i] = s[i] >>> 4 * (i - 1) + 3;
                    s[7] = s[7] << 5 | s[7] >>> 27
                }
                for (var h = this._invSubKeys = [], i = 0; i < 16; i++)
                    h[i] = n[15 - i]
            },
            encryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._subKeys)
            },
            decryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._invSubKeys)
            },
            _doCryptBlock: function(t, e, i) {
                this._lBlock = t[e],
                this._rBlock = t[e + 1],
                we.call(this, 4, 252645135),
                we.call(this, 16, 65535),
                Se.call(this, 2, 858993459),
                Se.call(this, 8, 16711935),
                we.call(this, 1, 1431655765);
                for (var r = 0; r < 16; r++) {
                    for (var n = i[r], o = this._lBlock, s = this._rBlock, a = 0, h = 0; h < 8; h++)
                        a |= ye[h][((s ^ n[h]) & me[h]) >>> 0];
                    this._lBlock = s,
                    this._rBlock = o ^ a
                }
                var c = this._lBlock;
                this._lBlock = this._rBlock,
                this._rBlock = c,
                we.call(this, 1, 1431655765),
                Se.call(this, 8, 16711935),
                Se.call(this, 2, 858993459),
                we.call(this, 16, 65535),
                we.call(this, 4, 252645135),
                t[e] = this._lBlock,
                t[e + 1] = this._rBlock
            },
            keySize: 2,
            ivSize: 2,
            blockSize: 2
        });
        function we(t, e) {
            e = (this._lBlock >>> t ^ this._rBlock) & e;
            this._rBlock ^= e,
            this._lBlock ^= e << t
        }
        function Se(t, e) {
            e = (this._rBlock >>> t ^ this._lBlock) & e;
            this._lBlock ^= e,
            this._rBlock ^= e << t
        }
        m.DES = y._createHelper(ve),
        p = p.TripleDES = y.extend({
            _doReset: function() {
                var t = this._key.words;
                if (2 !== t.length && 4 !== t.length && t.length < 6)
                    throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
                var e = t.slice(0, 2)
                  , i = t.length < 4 ? t.slice(0, 2) : t.slice(2, 4)
                  , t = t.length < 6 ? t.slice(0, 2) : t.slice(4, 6);
                this._des1 = ve.createEncryptor(fe.create(e)),
                this._des2 = ve.createEncryptor(fe.create(i)),
                this._des3 = ve.createEncryptor(fe.create(t))
            },
            encryptBlock: function(t, e) {
                this._des1.encryptBlock(t, e),
                this._des2.decryptBlock(t, e),
                this._des3.encryptBlock(t, e)
            },
            decryptBlock: function(t, e) {
                this._des3.decryptBlock(t, e),
                this._des2.encryptBlock(t, e),
                this._des1.decryptBlock(t, e)
            },
            keySize: 6,
            ivSize: 2,
            blockSize: 2
        }),
        m.TripleDES = y._createHelper(p);
        var d = r
          , m = d.lib.StreamCipher
          , y = d.algo
          , Te = y.RC4 = m.extend({
            _doReset: function() {
                for (var t = this._key, e = t.words, i = t.sigBytes, r = this._S = [], n = 0; n < 256; n++)
                    r[n] = n;
                for (var n = 0, o = 0; n < 256; n++) {
                    var s = n % i
                      , s = e[s >>> 2] >>> 24 - s % 4 * 8 & 255
                      , o = (o + r[n] + s) % 256
                      , s = r[n];
                    r[n] = r[o],
                    r[o] = s
                }
                this._i = this._j = 0
            },
            _doProcessBlock: function(t, e) {
                t[e] ^= be.call(this)
            },
            keySize: 8,
            ivSize: 0
        });
        function be() {
            for (var t = this._S, e = this._i, i = this._j, r = 0, n = 0; n < 4; n++) {
                var i = (i + t[e = (e + 1) % 256]) % 256
                  , o = t[e];
                t[e] = t[i],
                t[i] = o,
                r |= t[(t[e] + t[i]) % 256] << 24 - 8 * n
            }
            return this._i = e,
            this._j = i,
            r
        }
        function Be(t) {
            var e, i, r;
            return 255 == (t >> 24 & 255) ? (i = t >> 8 & 255,
            r = 255 & t,
            255 === (e = t >> 16 & 255) ? (e = 0,
            255 === i ? (i = 0,
            255 === r ? r = 0 : ++r) : ++i) : ++e,
            t = 0,
            t = (t += e << 16) + (i << 8) + r) : t += 1 << 24,
            t
        }
        function _e() {
            for (var t = this._X, e = this._C, i = 0; i < 8; i++)
                a[i] = e[i];
            e[0] = e[0] + 1295307597 + this._b | 0,
            e[1] = e[1] + 3545052371 + (e[0] >>> 0 < a[0] >>> 0 ? 1 : 0) | 0,
            e[2] = e[2] + 886263092 + (e[1] >>> 0 < a[1] >>> 0 ? 1 : 0) | 0,
            e[3] = e[3] + 1295307597 + (e[2] >>> 0 < a[2] >>> 0 ? 1 : 0) | 0,
            e[4] = e[4] + 3545052371 + (e[3] >>> 0 < a[3] >>> 0 ? 1 : 0) | 0,
            e[5] = e[5] + 886263092 + (e[4] >>> 0 < a[4] >>> 0 ? 1 : 0) | 0,
            e[6] = e[6] + 1295307597 + (e[5] >>> 0 < a[5] >>> 0 ? 1 : 0) | 0,
            e[7] = e[7] + 3545052371 + (e[6] >>> 0 < a[6] >>> 0 ? 1 : 0) | 0,
            this._b = e[7] >>> 0 < a[7] >>> 0 ? 1 : 0;
            for (i = 0; i < 8; i++) {
                var r = t[i] + e[i]
                  , n = 65535 & r
                  , o = r >>> 16;
                h[i] = ((n * n >>> 17) + n * o >>> 15) + o * o ^ ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0)
            }
            t[0] = h[0] + (h[7] << 16 | h[7] >>> 16) + (h[6] << 16 | h[6] >>> 16) | 0,
            t[1] = h[1] + (h[0] << 8 | h[0] >>> 24) + h[7] | 0,
            t[2] = h[2] + (h[1] << 16 | h[1] >>> 16) + (h[0] << 16 | h[0] >>> 16) | 0,
            t[3] = h[3] + (h[2] << 8 | h[2] >>> 24) + h[1] | 0,
            t[4] = h[4] + (h[3] << 16 | h[3] >>> 16) + (h[2] << 16 | h[2] >>> 16) | 0,
            t[5] = h[5] + (h[4] << 8 | h[4] >>> 24) + h[3] | 0,
            t[6] = h[6] + (h[5] << 16 | h[5] >>> 16) + (h[4] << 16 | h[4] >>> 16) | 0,
            t[7] = h[7] + (h[6] << 8 | h[6] >>> 24) + h[5] | 0
        }
        function Ee() {
            for (var t = this._X, e = this._C, i = 0; i < 8; i++)
                l[i] = e[i];
            e[0] = e[0] + 1295307597 + this._b | 0,
            e[1] = e[1] + 3545052371 + (e[0] >>> 0 < l[0] >>> 0 ? 1 : 0) | 0,
            e[2] = e[2] + 886263092 + (e[1] >>> 0 < l[1] >>> 0 ? 1 : 0) | 0,
            e[3] = e[3] + 1295307597 + (e[2] >>> 0 < l[2] >>> 0 ? 1 : 0) | 0,
            e[4] = e[4] + 3545052371 + (e[3] >>> 0 < l[3] >>> 0 ? 1 : 0) | 0,
            e[5] = e[5] + 886263092 + (e[4] >>> 0 < l[4] >>> 0 ? 1 : 0) | 0,
            e[6] = e[6] + 1295307597 + (e[5] >>> 0 < l[5] >>> 0 ? 1 : 0) | 0,
            e[7] = e[7] + 3545052371 + (e[6] >>> 0 < l[6] >>> 0 ? 1 : 0) | 0,
            this._b = e[7] >>> 0 < l[7] >>> 0 ? 1 : 0;
            for (i = 0; i < 8; i++) {
                var r = t[i] + e[i]
                  , n = 65535 & r
                  , o = r >>> 16;
                f[i] = ((n * n >>> 17) + n * o >>> 15) + o * o ^ ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0)
            }
            t[0] = f[0] + (f[7] << 16 | f[7] >>> 16) + (f[6] << 16 | f[6] >>> 16) | 0,
            t[1] = f[1] + (f[0] << 8 | f[0] >>> 24) + f[7] | 0,
            t[2] = f[2] + (f[1] << 16 | f[1] >>> 16) + (f[0] << 16 | f[0] >>> 16) | 0,
            t[3] = f[3] + (f[2] << 8 | f[2] >>> 24) + f[1] | 0,
            t[4] = f[4] + (f[3] << 16 | f[3] >>> 16) + (f[2] << 16 | f[2] >>> 16) | 0,
            t[5] = f[5] + (f[4] << 8 | f[4] >>> 24) + f[3] | 0,
            t[6] = f[6] + (f[5] << 16 | f[5] >>> 16) + (f[4] << 16 | f[4] >>> 16) | 0,
            t[7] = f[7] + (f[6] << 8 | f[6] >>> 24) + f[5] | 0
        }
        return d.RC4 = m._createHelper(Te),
        y = y.RC4Drop = Te.extend({
            cfg: Te.cfg.extend({
                drop: 192
            }),
            _doReset: function() {
                Te._doReset.call(this);
                for (var t = this.cfg.drop; 0 < t; t--)
                    be.call(this)
            }
        }),
        d.RC4Drop = m._createHelper(y),
        r.mode.CTRGladman = (p = r.lib.BlockCipherMode.extend(),
        d = p.Encryptor = p.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize
                  , n = this._iv
                  , o = this._counter
                  , s = (n && (o = this._counter = n.slice(0),
                this._iv = void 0),
                0 === ((n = o)[0] = Be(n[0])) && (n[1] = Be(n[1])),
                o.slice(0));
                i.encryptBlock(s, 0);
                for (var a = 0; a < r; a++)
                    t[e + a] ^= s[a]
            }
        }),
        p.Decryptor = d,
        p),
        y = (m = r).lib.StreamCipher,
        d = m.algo,
        o = [],
        a = [],
        h = [],
        d = d.Rabbit = y.extend({
            _doReset: function() {
                for (var t = this._key.words, e = this.cfg.iv, i = 0; i < 4; i++)
                    t[i] = 16711935 & (t[i] << 8 | t[i] >>> 24) | 4278255360 & (t[i] << 24 | t[i] >>> 8);
                for (var r = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], n = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]], i = this._b = 0; i < 4; i++)
                    _e.call(this);
                for (i = 0; i < 8; i++)
                    n[i] ^= r[i + 4 & 7];
                if (e) {
                    var e = e.words
                      , o = e[0]
                      , e = e[1]
                      , o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8)
                      , e = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8)
                      , s = o >>> 16 | 4294901760 & e
                      , a = e << 16 | 65535 & o;
                    n[0] ^= o,
                    n[1] ^= s,
                    n[2] ^= e,
                    n[3] ^= a,
                    n[4] ^= o,
                    n[5] ^= s,
                    n[6] ^= e,
                    n[7] ^= a;
                    for (i = 0; i < 4; i++)
                        _e.call(this)
                }
            },
            _doProcessBlock: function(t, e) {
                var i = this._X;
                _e.call(this),
                o[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16,
                o[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16,
                o[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16,
                o[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16;
                for (var r = 0; r < 4; r++)
                    o[r] = 16711935 & (o[r] << 8 | o[r] >>> 24) | 4278255360 & (o[r] << 24 | o[r] >>> 8),
                    t[e + r] ^= o[r]
            },
            blockSize: 4,
            ivSize: 2
        }),
        m.Rabbit = y._createHelper(d),
        r.mode.CTR = (p = r.lib.BlockCipherMode.extend(),
        m = p.Encryptor = p.extend({
            processBlock: function(t, e) {
                var i = this._cipher
                  , r = i.blockSize
                  , n = this._iv
                  , o = this._counter
                  , s = (n && (o = this._counter = n.slice(0),
                this._iv = void 0),
                o.slice(0));
                i.encryptBlock(s, 0),
                o[r - 1] = o[r - 1] + 1 | 0;
                for (var a = 0; a < r; a++)
                    t[e + a] ^= s[a]
            }
        }),
        p.Decryptor = m,
        p),
        d = (y = r).lib.StreamCipher,
        m = y.algo,
        c = [],
        l = [],
        f = [],
        m = m.RabbitLegacy = d.extend({
            _doReset: function() {
                for (var t = this._key.words, e = this.cfg.iv, i = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16], r = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]], n = this._b = 0; n < 4; n++)
                    Ee.call(this);
                for (n = 0; n < 8; n++)
                    r[n] ^= i[n + 4 & 7];
                if (e) {
                    var t = e.words
                      , e = t[0]
                      , t = t[1]
                      , e = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8)
                      , t = 16711935 & (t << 8 | t >>> 24) | 4278255360 & (t << 24 | t >>> 8)
                      , o = e >>> 16 | 4294901760 & t
                      , s = t << 16 | 65535 & e;
                    r[0] ^= e,
                    r[1] ^= o,
                    r[2] ^= t,
                    r[3] ^= s,
                    r[4] ^= e,
                    r[5] ^= o,
                    r[6] ^= t,
                    r[7] ^= s;
                    for (n = 0; n < 4; n++)
                        Ee.call(this)
                }
            },
            _doProcessBlock: function(t, e) {
                var i = this._X;
                Ee.call(this),
                c[0] = i[0] ^ i[5] >>> 16 ^ i[3] << 16,
                c[1] = i[2] ^ i[7] >>> 16 ^ i[5] << 16,
                c[2] = i[4] ^ i[1] >>> 16 ^ i[7] << 16,
                c[3] = i[6] ^ i[3] >>> 16 ^ i[1] << 16;
                for (var r = 0; r < 4; r++)
                    c[r] = 16711935 & (c[r] << 8 | c[r] >>> 24) | 4278255360 & (c[r] << 24 | c[r] >>> 8),
                    t[e + r] ^= c[r]
            },
            blockSize: 4,
            ivSize: 2
        }),
        y.RabbitLegacy = d._createHelper(m),
        r.pad.ZeroPadding = {
            pad: function(t, e) {
                e *= 4;
                t.clamp(),
                t.sigBytes += e - (t.sigBytes % e || e)
            },
            unpad: function(t) {
                for (var e = t.words, i = t.sigBytes - 1, i = t.sigBytes - 1; 0 <= i; i--)
                    if (e[i >>> 2] >>> 24 - i % 4 * 8 & 255) {
                        t.sigBytes = i + 1;
                        break
                    }
            }
        },
        r
    }();
    !function(t, e) {
        "use strict";
        "undefined" != typeof window && "function" == typeof define && define.amd ? define(e) : "undefined" != typeof module && module.exports ? module.exports = e() : t.exports ? t.exports = e() : t.Fingerprint2 = e()
    }(this, function() {
        "use strict";
        void 0 === Array.isArray && (Array.isArray = function(t) {
            return "[object Array]" === Object.prototype.toString.call(t)
        }
        );
        function l(t, e) {
            t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]],
            e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]];
            var i = [0, 0, 0, 0];
            return i[3] += t[3] + e[3],
            i[2] += i[3] >>> 16,
            i[3] &= 65535,
            i[2] += t[2] + e[2],
            i[1] += i[2] >>> 16,
            i[2] &= 65535,
            i[1] += t[1] + e[1],
            i[0] += i[1] >>> 16,
            i[1] &= 65535,
            i[0] += t[0] + e[0],
            i[0] &= 65535,
            [i[0] << 16 | i[1], i[2] << 16 | i[3]]
        }
        function f(t, e) {
            return 32 === (e %= 64) ? [t[1], t[0]] : e < 32 ? [t[0] << e | t[1] >>> 32 - e, t[1] << e | t[0] >>> 32 - e] : [t[1] << (e -= 32) | t[0] >>> 32 - e, t[0] << e | t[1] >>> 32 - e]
        }
        function d(t, e) {
            return 0 === (e %= 64) ? t : e < 32 ? [t[0] << e | t[1] >>> 32 - e, t[1] << e] : [t[1] << e - 32, 0]
        }
        function p(t) {
            return t = y(t, [0, t[0] >>> 1]),
            t = g(t, [4283543511, 3981806797]),
            t = y(t, [0, t[0] >>> 1]),
            t = g(t, [3301882366, 444984403]),
            t = y(t, [0, t[0] >>> 1])
        }
        function a(t, e) {
            for (var i = (t = t || "").length % 16, r = t.length - i, n = [0, e = e || 0], o = [0, e], s = [0, 0], a = [0, 0], h = [2277735313, 289559509], c = [1291169091, 658871167], u = 0; u < r; u += 16)
                s = [255 & t.charCodeAt(u + 4) | (255 & t.charCodeAt(u + 5)) << 8 | (255 & t.charCodeAt(u + 6)) << 16 | (255 & t.charCodeAt(u + 7)) << 24, 255 & t.charCodeAt(u) | (255 & t.charCodeAt(u + 1)) << 8 | (255 & t.charCodeAt(u + 2)) << 16 | (255 & t.charCodeAt(u + 3)) << 24],
                a = [255 & t.charCodeAt(u + 12) | (255 & t.charCodeAt(u + 13)) << 8 | (255 & t.charCodeAt(u + 14)) << 16 | (255 & t.charCodeAt(u + 15)) << 24, 255 & t.charCodeAt(u + 8) | (255 & t.charCodeAt(u + 9)) << 8 | (255 & t.charCodeAt(u + 10)) << 16 | (255 & t.charCodeAt(u + 11)) << 24],
                s = g(s, h),
                s = f(s, 31),
                s = g(s, c),
                n = y(n, s),
                n = f(n, 27),
                n = l(n, o),
                n = l(g(n, [0, 5]), [0, 1390208809]),
                a = g(a, c),
                a = f(a, 33),
                a = g(a, h),
                o = y(o, a),
                o = f(o, 31),
                o = l(o, n),
                o = l(g(o, [0, 5]), [0, 944331445]);
            switch (s = [0, 0],
            a = [0, 0],
            i) {
            case 15:
                a = y(a, d([0, t.charCodeAt(u + 14)], 48));
            case 14:
                a = y(a, d([0, t.charCodeAt(u + 13)], 40));
            case 13:
                a = y(a, d([0, t.charCodeAt(u + 12)], 32));
            case 12:
                a = y(a, d([0, t.charCodeAt(u + 11)], 24));
            case 11:
                a = y(a, d([0, t.charCodeAt(u + 10)], 16));
            case 10:
                a = y(a, d([0, t.charCodeAt(u + 9)], 8));
            case 9:
                a = y(a, [0, t.charCodeAt(u + 8)]),
                a = g(a, c),
                a = f(a, 33),
                a = g(a, h),
                o = y(o, a);
            case 8:
                s = y(s, d([0, t.charCodeAt(u + 7)], 56));
            case 7:
                s = y(s, d([0, t.charCodeAt(u + 6)], 48));
            case 6:
                s = y(s, d([0, t.charCodeAt(u + 5)], 40));
            case 5:
                s = y(s, d([0, t.charCodeAt(u + 4)], 32));
            case 4:
                s = y(s, d([0, t.charCodeAt(u + 3)], 24));
            case 3:
                s = y(s, d([0, t.charCodeAt(u + 2)], 16));
            case 2:
                s = y(s, d([0, t.charCodeAt(u + 1)], 8));
            case 1:
                s = y(s, [0, t.charCodeAt(u)]),
                s = g(s, h),
                s = f(s, 31),
                s = g(s, c),
                n = y(n, s)
            }
            return n = y(n, [0, t.length]),
            o = y(o, [0, t.length]),
            n = l(n, o),
            o = l(o, n),
            n = p(n),
            o = p(o),
            n = l(n, o),
            o = l(o, n),
            ("00000000" + (n[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (n[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (o[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (o[1] >>> 0).toString(16)).slice(-8)
        }
        function i() {
            var t, e;
            return !!s() && (t = v(),
            e = !!window.WebGLRenderingContext && !!t,
            w(t),
            e)
        }
        function r(t) {
            throw new Error("'new Fingerprint()' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200")
        }
        var g = function(t, e) {
            t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]],
            e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]];
            var i = [0, 0, 0, 0];
            return i[3] += t[3] * e[3],
            i[2] += i[3] >>> 16,
            i[3] &= 65535,
            i[2] += t[2] * e[3],
            i[1] += i[2] >>> 16,
            i[2] &= 65535,
            i[2] += t[3] * e[2],
            i[1] += i[2] >>> 16,
            i[2] &= 65535,
            i[1] += t[1] * e[3],
            i[0] += i[1] >>> 16,
            i[1] &= 65535,
            i[1] += t[2] * e[2],
            i[0] += i[1] >>> 16,
            i[1] &= 65535,
            i[1] += t[3] * e[1],
            i[0] += i[1] >>> 16,
            i[1] &= 65535,
            i[0] += t[0] * e[3] + t[1] * e[2] + t[2] * e[1] + t[3] * e[0],
            i[0] &= 65535,
            [i[0] << 16 | i[1], i[2] << 16 | i[3]]
        }
          , y = function(t, e) {
            return [t[0] ^ e[0], t[1] ^ e[1]]
        }
          , c = {
            preprocessor: null,
            audio: {
                timeout: 1e3,
                excludeIOS11: !0
            },
            fonts: {
                swfContainerId: "fingerprintjs2",
                swfPath: "flash/compiled/FontList.swf",
                userDefinedFonts: [],
                extendedJsFonts: !1
            },
            screen: {
                detectScreenOrientation: !0
            },
            plugins: {
                sortPluginsFor: [/palemoon/i],
                excludeIE: !1
            },
            extraComponents: [],
            excludes: {
                enumerateDevices: !0,
                pixelRatio: !0,
                doNotTrack: !0,
                fontsFlash: !0
            },
            NOT_AVAILABLE: "not available",
            ERROR: "error",
            EXCLUDED: "excluded"
        }
          , m = function(t, e) {
            if (Array.prototype.forEach && t.forEach === Array.prototype.forEach)
                t.forEach(e);
            else if (t.length === +t.length)
                for (var i = 0, r = t.length; i < r; i++)
                    e(t[i], i, t);
            else
                for (var n in t)
                    t.hasOwnProperty(n) && e(t[n], n, t)
        }
          , h = function(t, r) {
            var n = [];
            if (null != t) {
                if (Array.prototype.map && t.map === Array.prototype.map)
                    return t.map(r);
                m(t, function(t, e, i) {
                    n.push(r(t, e, i))
                })
            }
            return n
        }
          , n = function(t) {
            if (null == navigator.plugins)
                return t.NOT_AVAILABLE;
            for (var e = [], i = 0, r = navigator.plugins.length; i < r; i++)
                navigator.plugins[i] && e.push(navigator.plugins[i]);
            return o(t) && (e = e.sort(function(t, e) {
                return t.name > e.name ? 1 : t.name < e.name ? -1 : 0
            })),
            h(e, function(t) {
                var e = h(t, function(t) {
                    return [t.type, t.suffixes]
                });
                return [t.name, t.description, e]
            })
        }
          , o = function(t) {
            for (var e = !1, i = 0, r = t.plugins.sortPluginsFor.length; i < r; i++) {
                var n = t.plugins.sortPluginsFor[i];
                if (navigator.userAgent.match(n)) {
                    e = !0;
                    break
                }
            }
            return e
        }
          , s = function() {
            var t = document.createElement("canvas");
            return !(!t.getContext || !t.getContext("2d"))
        }
          , u = function(t) {
            var e = document.createElement("div");
            e.setAttribute("id", t.fonts.swfContainerId),
            document.body.appendChild(e)
        }
          , v = function() {
            var t = document.createElement("canvas")
              , e = null;
            try {
                e = t.getContext("webgl") || t.getContext("experimental-webgl")
            } catch (t) {}
            return e = e || null
        }
          , w = function(t) {
            t = t.getExtension("WEBGL_lose_context");
            null != t && t.loseContext()
        }
          , S = [{
            key: "userAgent",
            getData: function(t) {
                t(navigator.userAgent)
            }
        }, {
            key: "webdriver",
            getData: function(t, e) {
                t(null == navigator.webdriver ? e.NOT_AVAILABLE : navigator.webdriver)
            }
        }, {
            key: "language",
            getData: function(t, e) {
                t(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || e.NOT_AVAILABLE)
            }
        }, {
            key: "colorDepth",
            getData: function(t, e) {
                t(window.screen.colorDepth || e.NOT_AVAILABLE)
            }
        }, {
            key: "deviceMemory",
            getData: function(t, e) {
                t(navigator.deviceMemory || e.NOT_AVAILABLE)
            }
        }, {
            key: "pixelRatio",
            getData: function(t, e) {
                t(window.devicePixelRatio || e.NOT_AVAILABLE)
            }
        }, {
            key: "hardwareConcurrency",
            getData: function(t, e) {
                t(function(t) {
                    if (navigator.hardwareConcurrency)
                        return navigator.hardwareConcurrency;
                    return t.NOT_AVAILABLE
                }(e))
            }
        }, {
            key: "screenResolution",
            getData: function(t, e) {
                t(function(t) {
                    var e = [window.screen.width, window.screen.height];
                    if (t.screen.detectScreenOrientation)
                        e.sort().reverse();
                    return e
                }(e))
            }
        }, {
            key: "availableScreenResolution",
            getData: function(t, e) {
                t(function(t) {
                    if (window.screen.availWidth && window.screen.availHeight) {
                        var e = [window.screen.availHeight, window.screen.availWidth];
                        if (t.screen.detectScreenOrientation)
                            e.sort().reverse();
                        return e
                    }
                    return t.NOT_AVAILABLE
                }(e))
            }
        }, {
            key: "timezoneOffset",
            getData: function(t) {
                t((new Date).getTimezoneOffset())
            }
        }, {
            key: "timezone",
            getData: function(t, e) {
                window.Intl && window.Intl.DateTimeFormat ? t((new window.Intl.DateTimeFormat).resolvedOptions().timeZone) : t(e.NOT_AVAILABLE)
            }
        }, {
            key: "sessionStorage",
            getData: function(t, e) {
                t(function(e) {
                    try {
                        return !!window.sessionStorage
                    } catch (t) {
                        return e.ERROR
                    }
                }(e))
            }
        }, {
            key: "localStorage",
            getData: function(t, e) {
                t(function(e) {
                    try {
                        return !!window.localStorage
                    } catch (t) {
                        return e.ERROR
                    }
                }(e))
            }
        }, {
            key: "indexedDb",
            getData: function(t, e) {
                t(function(e) {
                    try {
                        return !!window.indexedDB
                    } catch (t) {
                        return e.ERROR
                    }
                }(e))
            }
        }, {
            key: "addBehavior",
            getData: function(t) {
                t(!(!document.body || !document.body.addBehavior))
            }
        }, {
            key: "openDatabase",
            getData: function(t) {
                t(!!window.openDatabase)
            }
        }, {
            key: "cpuClass",
            getData: function(t, e) {
                t((t = e,
                navigator.cpuClass || t.NOT_AVAILABLE))
            }
        }, {
            key: "platform",
            getData: function(t, e) {
                t(function(t) {
                    if (navigator.platform)
                        return navigator.platform;
                    else
                        return t.NOT_AVAILABLE
                }(e))
            }
        }, {
            key: "doNotTrack",
            getData: function(t, e) {
                t(function(t) {
                    if (navigator.doNotTrack)
                        return navigator.doNotTrack;
                    else if (navigator.msDoNotTrack)
                        return navigator.msDoNotTrack;
                    else if (window.doNotTrack)
                        return window.doNotTrack;
                    else
                        return t.NOT_AVAILABLE
                }(e))
            }
        }, {
            key: "plugins",
            getData: function(t, e) {
                !function() {
                    if (navigator.appName === "Microsoft Internet Explorer")
                        return true;
                    else if (navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent))
                        return true;
                    return false
                }() ? t(n(e)) : e.plugins.excludeIE ? t(e.EXCLUDED) : t(function(e) {
                    var t = [];
                    if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject") || "ActiveXObject"in window) {
                        var i = ["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"];
                        t = h(i, function(t) {
                            try {
                                new window.ActiveXObject(t);
                                return t
                            } catch (t) {
                                return e.ERROR
                            }
                        })
                    } else
                        t.push(e.NOT_AVAILABLE);
                    if (navigator.plugins)
                        t = t.concat(n(e));
                    return t
                }(e))
            }
        }, {
            key: "canvas",
            getData: function(t, e) {
                s() ? t(function(t) {
                    var e = []
                      , i = document.createElement("canvas")
                      , r = (i.width = 2e3,
                    i.height = 200,
                    i.style.display = "inline",
                    i.getContext("2d"));
                    if (r.rect(0, 0, 10, 10),
                    r.rect(2, 2, 6, 6),
                    e.push("canvas winding:" + (r.isPointInPath(5, 5, "evenodd") === false ? "yes" : "no")),
                    r.textBaseline = "alphabetic",
                    r.fillStyle = "#f60",
                    r.fillRect(125, 1, 62, 20),
                    r.fillStyle = "#069",
                    t.dontUseFakeFontInCanvas)
                        r.font = "11pt Arial";
                    else
                        r.font = "11pt no-real-font-123";
                    if (r.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15),
                    r.fillStyle = "rgba(102, 204, 0, 0.2)",
                    r.font = "18pt Arial",
                    r.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45),
                    r.globalCompositeOperation = "multiply",
                    r.fillStyle = "rgb(255,0,255)",
                    r.beginPath(),
                    r.arc(50, 50, 50, 0, Math.PI * 2, true),
                    r.closePath(),
                    r.fill(),
                    r.fillStyle = "rgb(0,255,255)",
                    r.beginPath(),
                    r.arc(100, 50, 50, 0, Math.PI * 2, true),
                    r.closePath(),
                    r.fill(),
                    r.fillStyle = "rgb(255,255,0)",
                    r.beginPath(),
                    r.arc(75, 100, 50, 0, Math.PI * 2, true),
                    r.closePath(),
                    r.fill(),
                    r.fillStyle = "rgb(255,0,255)",
                    r.arc(75, 75, 75, 0, Math.PI * 2, true),
                    r.arc(75, 75, 25, 0, Math.PI * 2, true),
                    r.fill("evenodd"),
                    i.toDataURL)
                        e.push("canvas fp:" + i.toDataURL());
                    return e
                }(e)) : t(e.NOT_AVAILABLE)
            }
        }, {
            key: "webgl",
            getData: function(t, e) {
                i() ? t(function() {
                    var o, t = function(t) {
                        o.clearColor(0, 0, 0, 1);
                        o.enable(o.DEPTH_TEST);
                        o.depthFunc(o.LEQUAL);
                        o.clear(o.COLOR_BUFFER_BIT | o.DEPTH_BUFFER_BIT);
                        return "[" + t[0] + ", " + t[1] + "]"
                    }, e = function(t) {
                        var e = t.getExtension("EXT_texture_filter_anisotropic") || t.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || t.getExtension("MOZ_EXT_texture_filter_anisotropic");
                        if (e) {
                            var i = t.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                            if (i === 0)
                                i = 2;
                            return i
                        } else
                            return null
                    }, o = v();
                    if (!o)
                        return null;
                    var s = []
                      , i = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
                      , r = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
                      , n = o.createBuffer()
                      , a = (o.bindBuffer(o.ARRAY_BUFFER, n),
                    new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]))
                      , h = (o.bufferData(o.ARRAY_BUFFER, a, o.STATIC_DRAW),
                    n.itemSize = 3,
                    n.numItems = 3,
                    o.createProgram())
                      , c = o.createShader(o.VERTEX_SHADER)
                      , u = (o.shaderSource(c, i),
                    o.compileShader(c),
                    o.createShader(o.FRAGMENT_SHADER));
                    o.shaderSource(u, r),
                    o.compileShader(u),
                    o.attachShader(h, c),
                    o.attachShader(h, u),
                    o.linkProgram(h),
                    o.useProgram(h),
                    h.vertexPosAttrib = o.getAttribLocation(h, "attrVertex"),
                    h.offsetUniform = o.getUniformLocation(h, "uniformOffset"),
                    o.enableVertexAttribArray(h.vertexPosArray),
                    o.vertexAttribPointer(h.vertexPosAttrib, n.itemSize, o.FLOAT, !1, 0, 0),
                    o.uniform2f(h.offsetUniform, 1, 1),
                    o.drawArrays(o.TRIANGLE_STRIP, 0, n.numItems);
                    try {
                        s.push(o.canvas.toDataURL())
                    } catch (t) {}
                    s.push("extensions:" + (o.getSupportedExtensions() || []).join(";")),
                    s.push("webgl aliased line width range:" + t(o.getParameter(o.ALIASED_LINE_WIDTH_RANGE))),
                    s.push("webgl aliased point size range:" + t(o.getParameter(o.ALIASED_POINT_SIZE_RANGE))),
                    s.push("webgl alpha bits:" + o.getParameter(o.ALPHA_BITS)),
                    s.push("webgl antialiasing:" + (o.getContextAttributes().antialias ? "yes" : "no")),
                    s.push("webgl blue bits:" + o.getParameter(o.BLUE_BITS)),
                    s.push("webgl depth bits:" + o.getParameter(o.DEPTH_BITS)),
                    s.push("webgl green bits:" + o.getParameter(o.GREEN_BITS)),
                    s.push("webgl max anisotropy:" + e(o)),
                    s.push("webgl max combined texture image units:" + o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
                    s.push("webgl max cube map texture size:" + o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE)),
                    s.push("webgl max fragment uniform vectors:" + o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS)),
                    s.push("webgl max render buffer size:" + o.getParameter(o.MAX_RENDERBUFFER_SIZE)),
                    s.push("webgl max texture image units:" + o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS)),
                    s.push("webgl max texture size:" + o.getParameter(o.MAX_TEXTURE_SIZE)),
                    s.push("webgl max varying vectors:" + o.getParameter(o.MAX_VARYING_VECTORS)),
                    s.push("webgl max vertex attribs:" + o.getParameter(o.MAX_VERTEX_ATTRIBS)),
                    s.push("webgl max vertex texture image units:" + o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS)),
                    s.push("webgl max vertex uniform vectors:" + o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS)),
                    s.push("webgl max viewport dims:" + t(o.getParameter(o.MAX_VIEWPORT_DIMS))),
                    s.push("webgl red bits:" + o.getParameter(o.RED_BITS)),
                    s.push("webgl renderer:" + o.getParameter(o.RENDERER)),
                    s.push("webgl shading language version:" + o.getParameter(o.SHADING_LANGUAGE_VERSION)),
                    s.push("webgl stencil bits:" + o.getParameter(o.STENCIL_BITS)),
                    s.push("webgl vendor:" + o.getParameter(o.VENDOR)),
                    s.push("webgl version:" + o.getParameter(o.VERSION));
                    try {
                        var l = o.getExtension("WEBGL_debug_renderer_info");
                        if (l) {
                            s.push("webgl unmasked vendor:" + o.getParameter(l.UNMASKED_VENDOR_WEBGL));
                            s.push("webgl unmasked renderer:" + o.getParameter(l.UNMASKED_RENDERER_WEBGL))
                        }
                    } catch (t) {}
                    return o.getShaderPrecisionFormat ? (m(["FLOAT", "INT"], function(n) {
                        m(["VERTEX", "FRAGMENT"], function(r) {
                            m(["HIGH", "MEDIUM", "LOW"], function(i) {
                                m(["precision", "rangeMin", "rangeMax"], function(t) {
                                    var e = o.getShaderPrecisionFormat(o[r + "_SHADER"], o[i + "_" + n])[t]
                                      , t = ("precision" !== t && (t = "precision " + t),
                                    ["webgl ", r.toLowerCase(), " shader ", i.toLowerCase(), " ", n.toLowerCase(), " ", t, ":", e].join(""));
                                    s.push(t)
                                })
                            })
                        })
                    }),
                    w(o)) : w(o),
                    s
                }()) : t(e.NOT_AVAILABLE)
            }
        }, {
            key: "webglVendorAndRenderer",
            getData: function(t) {
                i() ? t(function() {
                    try {
                        var t = v();
                        var e = t.getExtension("WEBGL_debug_renderer_info");
                        var i = t.getParameter(e.UNMASKED_VENDOR_WEBGL) + "~" + t.getParameter(e.UNMASKED_RENDERER_WEBGL);
                        w(t);
                        return i
                    } catch (t) {
                        return null
                    }
                }()) : t()
            }
        }, {
            key: "adBlock",
            getData: function(t) {
                t(function() {
                    var t = document.createElement("div")
                      , e = (t.innerHTML = "&nbsp;",
                    t.className = "adsbox",
                    false);
                    try {
                        document.body.appendChild(t);
                        e = document.getElementsByClassName("adsbox")[0].offsetHeight === 0;
                        document.body.removeChild(t)
                    } catch (t) {
                        e = false
                    }
                    return e
                }())
            }
        }, {
            key: "hasLiedLanguages",
            getData: function(t) {
                t(function() {
                    if (typeof navigator.languages !== "undefined")
                        try {
                            var t = navigator.languages[0].substr(0, 2);
                            if (t !== navigator.language.substr(0, 2))
                                return true
                        } catch (t) {
                            return true
                        }
                    return false
                }())
            }
        }, {
            key: "hasLiedResolution",
            getData: function(t) {
                t(window.screen.width < window.screen.availWidth || window.screen.height < window.screen.availHeight)
            }
        }, {
            key: "hasLiedOs",
            getData: function(t) {
                t(function() {
                    var t = navigator.userAgent.toLowerCase(), e = navigator.oscpu, i = navigator.platform.toLowerCase(), r, n;
                    if (t.indexOf("windows phone") >= 0)
                        r = "Windows Phone";
                    else if (t.indexOf("windows") >= 0 || t.indexOf("win16") >= 0 || t.indexOf("win32") >= 0 || t.indexOf("win64") >= 0 || t.indexOf("win95") >= 0 || t.indexOf("win98") >= 0 || t.indexOf("winnt") >= 0 || t.indexOf("wow64") >= 0)
                        r = "Windows";
                    else if (t.indexOf("android") >= 0)
                        r = "Android";
                    else if (t.indexOf("linux") >= 0 || t.indexOf("cros") >= 0 || t.indexOf("x11") >= 0)
                        r = "Linux";
                    else if (t.indexOf("iphone") >= 0 || t.indexOf("ipad") >= 0 || t.indexOf("ipod") >= 0 || t.indexOf("crios") >= 0 || t.indexOf("fxios") >= 0)
                        r = "iOS";
                    else if (t.indexOf("macintosh") >= 0 || t.indexOf("mac_powerpc)") >= 0)
                        r = "Mac";
                    else
                        r = "Other";
                    if (("ontouchstart"in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) && r !== "Windows" && r !== "Windows Phone" && r !== "Android" && r !== "iOS" && r !== "Other" && t.indexOf("cros") === -1)
                        return true;
                    if (typeof e !== "undefined") {
                        e = e.toLowerCase();
                        if (e.indexOf("win") >= 0 && r !== "Windows" && r !== "Windows Phone")
                            return true;
                        else if (e.indexOf("linux") >= 0 && r !== "Linux" && r !== "Android")
                            return true;
                        else if (e.indexOf("mac") >= 0 && r !== "Mac" && r !== "iOS")
                            return true;
                        else if ((e.indexOf("win") === -1 && e.indexOf("linux") === -1 && e.indexOf("mac") === -1) !== (r === "Other"))
                            return true
                    }
                    if (i.indexOf("win") >= 0 && r !== "Windows" && r !== "Windows Phone")
                        return true;
                    else if ((i.indexOf("linux") >= 0 || i.indexOf("android") >= 0 || i.indexOf("pike") >= 0) && r !== "Linux" && r !== "Android")
                        return true;
                    else if ((i.indexOf("mac") >= 0 || i.indexOf("ipad") >= 0 || i.indexOf("ipod") >= 0 || i.indexOf("iphone") >= 0) && r !== "Mac" && r !== "iOS")
                        return true;
                    else if (i.indexOf("arm") >= 0 && r === "Windows Phone")
                        return false;
                    else if (i.indexOf("pike") >= 0 && t.indexOf("opera mini") >= 0)
                        return false;
                    else {
                        var o = i.indexOf("win") < 0 && i.indexOf("linux") < 0 && i.indexOf("mac") < 0 && i.indexOf("iphone") < 0 && i.indexOf("ipad") < 0 && i.indexOf("ipod") < 0;
                        if (o !== (r === "Other"))
                            return true
                    }
                    return typeof navigator.plugins === "undefined" && r !== "Windows" && r !== "Windows Phone"
                }())
            }
        }, {
            key: "hasLiedBrowser",
            getData: function(t) {
                t(function() {
                    var t = navigator.userAgent.toLowerCase(), e = navigator.productSub, i;
                    if (t.indexOf("edge/") >= 0 || t.indexOf("iemobile/") >= 0)
                        return false;
                    else if (t.indexOf("opera mini") >= 0)
                        return false;
                    else if (t.indexOf("firefox/") >= 0)
                        i = "Firefox";
                    else if (t.indexOf("opera/") >= 0 || t.indexOf(" opr/") >= 0)
                        i = "Opera";
                    else if (t.indexOf("chrome/") >= 0)
                        i = "Chrome";
                    else if (t.indexOf("safari/") >= 0)
                        if (t.indexOf("android 1.") >= 0 || t.indexOf("android 2.") >= 0 || t.indexOf("android 3.") >= 0 || t.indexOf("android 4.") >= 0)
                            i = "AOSP";
                        else
                            i = "Safari";
                    else if (t.indexOf("trident/") >= 0)
                        i = "Internet Explorer";
                    else
                        i = "Other";
                    if ((i === "Chrome" || i === "Safari" || i === "Opera") && e !== "20030107")
                        return true;
                    var r = eval.toString().length, n;
                    if (r === 37 && i !== "Safari" && i !== "Firefox" && i !== "Other")
                        return true;
                    else if (r === 39 && i !== "Internet Explorer" && i !== "Other")
                        return true;
                    else if (r === 33 && i !== "Chrome" && i !== "AOSP" && i !== "Opera" && i !== "Other")
                        return true;
                    try {
                        throw "a"
                    } catch (t) {
                        try {
                            t.toSource();
                            n = true
                        } catch (t) {
                            n = false
                        }
                    }
                    return n && i !== "Firefox" && i !== "Other"
                }())
            }
        }, {
            key: "touchSupport",
            getData: function(t) {
                t(function() {
                    var t = 0, e, i;
                    if (typeof navigator.maxTouchPoints !== "undefined")
                        t = navigator.maxTouchPoints;
                    else if (typeof navigator.msMaxTouchPoints !== "undefined")
                        t = navigator.msMaxTouchPoints;
                    try {
                        document.createEvent("TouchEvent");
                        e = true
                    } catch (t) {
                        e = false
                    }
                    return [t, e, "ontouchstart"in window]
                }())
            }
        }, {
            key: "fonts",
            getData: function(t, e) {
                var c = ["monospace", "sans-serif", "serif"]
                  , u = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"]
                  , i = (e.fonts.extendedJsFonts && (u = u.concat(["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"])),
                u = (u = u.concat(e.fonts.userDefinedFonts)).filter(function(t, e) {
                    return u.indexOf(t) === e
                }),
                "mmmmmmmmmmlli")
                  , r = "72px"
                  , e = document.getElementsByTagName("body")[0]
                  , n = document.createElement("div")
                  , l = document.createElement("div")
                  , o = {}
                  , s = {}
                  , f = function() {
                    var t = document.createElement("span");
                    return t.style.position = "absolute",
                    t.style.left = "-9999px",
                    t.style.fontSize = r,
                    t.style.fontStyle = "normal",
                    t.style.fontWeight = "normal",
                    t.style.letterSpacing = "normal",
                    t.style.lineBreak = "auto",
                    t.style.lineHeight = "normal",
                    t.style.textTransform = "none",
                    t.style.textAlign = "left",
                    t.style.textDecoration = "none",
                    t.style.textShadow = "none",
                    t.style.whiteSpace = "normal",
                    t.style.wordBreak = "normal",
                    t.style.wordSpacing = "normal",
                    t.innerHTML = i,
                    t
                }
                  , a = function() {
                    for (var t = [], e = 0, i = c.length; e < i; e++) {
                        var r = f();
                        r.style.fontFamily = c[e],
                        n.appendChild(r),
                        t.push(r)
                    }
                    return t
                }();
                e.appendChild(n);
                for (var h = 0, d = c.length; h < d; h++)
                    o[c[h]] = a[h].offsetWidth,
                    s[c[h]] = a[h].offsetHeight;
                for (var p = function() {
                    for (var t, e, i = {}, r = 0, n = u.length; r < n; r++) {
                        for (var o = [], s = 0, a = c.length; s < a; s++) {
                            h = u[r],
                            t = c[s],
                            e = void 0,
                            (e = f()).style.fontFamily = "'" + h + "'," + t;
                            var h = e;
                            l.appendChild(h),
                            o.push(h)
                        }
                        i[u[r]] = o
                    }
                    return i
                }(), g = (e.appendChild(l),
                []), y = 0, m = u.length; y < m; y++)
                    !function(t) {
                        for (var e = !1, i = 0; i < c.length; i++)
                            if (e = t[i].offsetWidth !== o[c[i]] || t[i].offsetHeight !== s[c[i]])
                                return e;
                        return e
                    }(p[u[y]]) || g.push(u[y]);
                e.removeChild(l),
                e.removeChild(n),
                t(g)
            },
            pauseBefore: !0
        }, {
            key: "fontsFlash",
            getData: function(e, t) {
                var i, r, n;
                return void 0 === window.swfobject ? e("swf object not loaded") : window.swfobject.hasFlashPlayerVersion("9.0.0") ? t.fonts.swfPath ? (i = function(t) {
                    e(t)
                }
                ,
                t = t,
                r = "___fp_swf_loaded",
                window[r] = function(t) {
                    i(t)
                }
                ,
                n = t.fonts.swfContainerId,
                u(),
                void window.swfobject.embedSWF(t.fonts.swfPath, n, "1", "1", "9.0.0", !1, {
                    onReady: r
                }, {
                    allowScriptAccess: "always",
                    menu: "false"
                }, {})) : e("missing options.fonts.swfPath") : e("flash not installed")
            },
            pauseBefore: !0
        }, {
            key: "audio",
            getData: function(i, t) {
                var e, r, n, o, s, a = t.audio;
                return a.excludeIOS11 && navigator.userAgent.match(/OS 11.+Version\/11.+Safari/) ? i(t.EXCLUDED) : null == (e = window.OfflineAudioContext || window.webkitOfflineAudioContext) ? i(t.NOT_AVAILABLE) : (r = new e(1,44100,44100),
                (n = r.createOscillator()).type = "triangle",
                n.frequency.setValueAtTime(1e4, r.currentTime),
                o = r.createDynamicsCompressor(),
                m([["threshold", -50], ["knee", 40], ["ratio", 12], ["reduction", -20], ["attack", 0], ["release", .25]], function(t) {
                    void 0 !== o[t[0]] && "function" == typeof o[t[0]].setValueAtTime && o[t[0]].setValueAtTime(t[1], r.currentTime)
                }),
                n.connect(o),
                o.connect(r.destination),
                n.start(0),
                r.startRendering(),
                s = setTimeout(function() {
                    return console.warn('Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' + navigator.userAgent + '".'),
                    r.oncomplete = function() {}
                    ,
                    r = null,
                    i("audioTimeout")
                }, a.timeout),
                void (r.oncomplete = function(t) {
                    var e;
                    try {
                        clearTimeout(s),
                        e = t.renderedBuffer.getChannelData(0).slice(4500, 5e3).reduce(function(t, e) {
                            return t + Math.abs(e)
                        }, 0).toString(),
                        n.disconnect(),
                        o.disconnect()
                    } catch (t) {
                        return void i(t)
                    }
                    i(e)
                }
                ))
            }
        }, {
            key: "enumerateDevices",
            getData: function(e, t) {
                if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices)
                    return e(t.NOT_AVAILABLE);
                navigator.mediaDevices.enumerateDevices().then(function(t) {
                    e(t.map(function(t) {
                        return "id=" + t.deviceId + ";gid=" + t.groupId + ";" + t.kind + ";" + t.label
                    }))
                }).catch(function(t) {
                    e(t)
                })
            }
        }];
        return r.get = function(i, r) {
            var t, e, n = i = r ? i || {} : (r = i,
            {}), o = c;
            if (null != o)
                for (e in o)
                    null == (t = o[e]) || Object.prototype.hasOwnProperty.call(n, e) || (n[e] = t);
            i.components = i.extraComponents.concat(S);
            function s(t) {
                if ((h += 1) >= i.components.length)
                    r(a.data);
                else {
                    var e = i.components[h];
                    if (i.excludes[e.key])
                        s(!1);
                    else if (!t && e.pauseBefore)
                        --h,
                        setTimeout(function() {
                            s(!0)
                        }, 1);
                    else
                        try {
                            e.getData(function(t) {
                                a.addPreprocessedComponent(e.key, t),
                                s(!1)
                            }, i)
                        } catch (t) {
                            a.addPreprocessedComponent(e.key, String(t)),
                            s(!1)
                        }
                }
            }
            var a = {
                data: [],
                addPreprocessedComponent: function(t, e) {
                    "function" == typeof i.preprocessor && (e = i.preprocessor(t, e)),
                    a.data.push({
                        key: t,
                        value: e
                    })
                }
            }
              , h = -1;
            s(!1)
        }
        ,
        r.getPromise = function(i) {
            return new Promise(function(t, e) {
                r.get(i, t)
            }
            )
        }
        ,
        r.getV18 = function(o, s) {
            return null == s && (s = o,
            o = {}),
            r.get(o, function(t) {
                for (var e = [], i = 0; i < t.length; i++) {
                    var r = t[i];
                    r.value === (o.NOT_AVAILABLE || "not available") ? e.push({
                        key: r.key,
                        value: "unknown"
                    }) : "plugins" === r.key ? e.push({
                        key: "plugins",
                        value: h(r.value, function(t) {
                            var e = h(t[2], function(t) {
                                return t.join ? t.join("~") : t
                            }).join(",");
                            return [t[0], t[1], e].join("::")
                        })
                    }) : -1 !== ["canvas", "webgl"].indexOf(r.key) && Array.isArray(r.value) ? e.push({
                        key: r.key,
                        value: r.value.join("~")
                    }) : -1 !== ["sessionStorage", "localStorage", "indexedDb", "addBehavior", "openDatabase"].indexOf(r.key) ? r.value && e.push({
                        key: r.key,
                        value: 1
                    }) : r.value ? e.push(r.value.join ? {
                        key: r.key,
                        value: r.value.join(";")
                    } : r) : e.push({
                        key: r.key,
                        value: r.value
                    })
                }
                var n = a(h(e, function(t) {
                    return t.value
                }).join("~~~"), 31);
                s(n, e)
            })
        }
        ,
        r.x64hash128 = a,
        r.VERSION = "2.1.2",
        r
    }),
    function(L) {
        "use strict";
        function h(t) {
            return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)
        }
        function N(t, e) {
            return t & e
        }
        function a(t, e) {
            return t | e
        }
        function V(t, e) {
            return t ^ e
        }
        function H(t, e) {
            return t & ~e
        }
        var s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        function r(t) {
            for (var e, i = "", r = 0; r + 3 <= t.length; r += 3)
                e = parseInt(t.substring(r, r + 3), 16),
                i += s.charAt(e >> 6) + s.charAt(63 & e);
            for (r + 1 == t.length ? (e = parseInt(t.substring(r, r + 1), 16),
            i += s.charAt(e << 2)) : r + 2 == t.length && (e = parseInt(t.substring(r, r + 2), 16),
            i += s.charAt(e >> 2) + s.charAt((3 & e) << 4)); 0 < (3 & i.length); )
                i += "=";
            return i
        }
        function F(t) {
            for (var e = "", i = 0, r = 0, n = 0; n < t.length && "=" != t.charAt(n); ++n) {
                var o = s.indexOf(t.charAt(n));
                o < 0 || (i = 0 == i ? (e += h(o >> 2),
                r = 3 & o,
                1) : 1 == i ? (e += h(r << 2 | o >> 4),
                r = 15 & o,
                2) : 2 == i ? (e = (e += h(r)) + h(o >> 2),
                r = 3 & o,
                3) : (e = (e += h(r << 2 | o >> 4)) + h(15 & o),
                0))
            }
            return 1 == i && (e += h(r << 2)),
            e
        }
        var f, c, U = function(t, e) {
            return (U = Object.setPrototypeOf || ({
                __proto__: []
            }instanceof Array ? function(t, e) {
                t.__proto__ = e
            }
            : function(t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            ))(t, e)
        }, j = {
            decode: function(t) {
                if (void 0 === c) {
                    var e = "= \f\n\r\t \u2028\u2029";
                    for (c = Object.create(null),
                    o = 0; o < 64; ++o)
                        c["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(o)] = o;
                    for (o = 0; o < e.length; ++o)
                        c[e.charAt(o)] = -1
                }
                for (var i = [], r = 0, n = 0, o = 0; o < t.length; ++o) {
                    var s = t.charAt(o);
                    if ("=" == s)
                        break;
                    if (-1 != (s = c[s])) {
                        if (void 0 === s)
                            throw new Error("Illegal character at offset " + o);
                        r |= s,
                        4 <= ++n ? (i[i.length] = r >> 16,
                        i[i.length] = r >> 8 & 255,
                        i[i.length] = 255 & r,
                        n = r = 0) : r <<= 6
                    }
                }
                switch (n) {
                case 1:
                    throw new Error("Base64 encoding incomplete: at least 2 bits missing");
                case 2:
                    i[i.length] = r >> 10;
                    break;
                case 3:
                    i[i.length] = r >> 16,
                    i[i.length] = r >> 8 & 255
                }
                return i
            },
            re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
            unarmor: function(t) {
                var e = j.re.exec(t);
                if (e)
                    if (e[1])
                        t = e[1];
                    else {
                        if (!e[2])
                            throw new Error("RegExp out of sync");
                        t = e[2]
                    }
                return j.decode(t)
            }
        }, u = 1e13, l = (t.prototype.mulAdd = function(t, e) {
            for (var i, r = this.buf, n = r.length, o = 0; o < n; ++o)
                (i = r[o] * t + e) < u ? e = 0 : i -= (e = 0 | i / u) * u,
                r[o] = i;
            0 < e && (r[o] = e)
        }
        ,
        t.prototype.sub = function(t) {
            for (var e, i = this.buf, r = i.length, n = 0; n < r; ++n)
                t = (e = i[n] - t) < 0 ? (e += u,
                1) : 0,
                i[n] = e;
            for (; 0 === i[i.length - 1]; )
                i.pop()
        }
        ,
        t.prototype.toString = function(t) {
            if (10 != (t || 10))
                throw new Error("only base 10 is supported");
            for (var e = this.buf, i = e[e.length - 1].toString(), r = e.length - 2; 0 <= r; --r)
                i += (u + e[r]).toString().substring(1);
            return i
        }
        ,
        t.prototype.valueOf = function() {
            for (var t = this.buf, e = 0, i = t.length - 1; 0 <= i; --i)
                e = e * u + t[i];
            return e
        }
        ,
        t.prototype.simplify = function() {
            var t = this.buf;
            return 1 == t.length ? t[0] : this
        }
        ,
        t), z = /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/, G = /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
        function t(t) {
            this.buf = [+t || 0]
        }
        function d(t, e) {
            return t = t.length > e ? t.substring(0, e) + "…" : t
        }
        v.prototype.get = function(t) {
            if ((t = void 0 === t ? this.pos++ : t) >= this.enc.length)
                throw new Error("Requesting byte offset " + t + " on a stream of length " + this.enc.length);
            return "string" == typeof this.enc ? this.enc.charCodeAt(t) : this.enc[t]
        }
        ,
        v.prototype.hexByte = function(t) {
            return this.hexDigits.charAt(t >> 4 & 15) + this.hexDigits.charAt(15 & t)
        }
        ,
        v.prototype.hexDump = function(t, e, i) {
            for (var r = "", n = t; n < e; ++n)
                if (r += this.hexByte(this.get(n)),
                !0 !== i)
                    switch (15 & n) {
                    case 7:
                        r += "  ";
                        break;
                    case 15:
                        r += "\n";
                        break;
                    default:
                        r += " "
                    }
            return r
        }
        ,
        v.prototype.isASCII = function(t, e) {
            for (var i = t; i < e; ++i) {
                var r = this.get(i);
                if (r < 32 || 176 < r)
                    return !1
            }
            return !0
        }
        ,
        v.prototype.parseStringISO = function(t, e) {
            for (var i = "", r = t; r < e; ++r)
                i += String.fromCharCode(this.get(r));
            return i
        }
        ,
        v.prototype.parseStringUTF = function(t, e) {
            for (var i = "", r = t; r < e; ) {
                var n = this.get(r++);
                i += n < 128 ? String.fromCharCode(n) : 191 < n && n < 224 ? String.fromCharCode((31 & n) << 6 | 63 & this.get(r++)) : String.fromCharCode((15 & n) << 12 | (63 & this.get(r++)) << 6 | 63 & this.get(r++))
            }
            return i
        }
        ,
        v.prototype.parseStringBMP = function(t, e) {
            for (var i, r, n = "", o = t; o < e; )
                i = this.get(o++),
                r = this.get(o++),
                n += String.fromCharCode(i << 8 | r);
            return n
        }
        ,
        v.prototype.parseTime = function(t, e, i) {
            t = this.parseStringISO(t, e),
            e = (i ? z : G).exec(t);
            return e ? (i && (e[1] = +e[1],
            e[1] += +e[1] < 70 ? 2e3 : 1900),
            t = e[1] + "-" + e[2] + "-" + e[3] + " " + e[4],
            e[5] && (t += ":" + e[5],
            e[6]) && (t += ":" + e[6],
            e[7]) && (t += "." + e[7]),
            e[8] && (t += " UTC",
            "Z" != e[8]) && (t += e[8],
            e[9]) && (t += ":" + e[9]),
            t) : "Unrecognized time: " + t
        }
        ,
        v.prototype.parseInteger = function(t, e) {
            for (var i, r = this.get(t), n = 127 < r, o = n ? 255 : 0, s = ""; r == o && ++t < e; )
                r = this.get(t);
            if (0 == (i = e - t))
                return n ? -1 : 0;
            if (4 < i) {
                for (s = r,
                i <<= 3; 0 == (128 & (+s ^ o)); )
                    s = +s << 1,
                    --i;
                s = "(" + i + " bit)\n"
            }
            n && (r -= 256);
            for (var a = new l(r), h = t + 1; h < e; ++h)
                a.mulAdd(256, this.get(h));
            return s + a.toString()
        }
        ,
        v.prototype.parseBitString = function(t, e, i) {
            for (var r = this.get(t), n = "(" + ((e - t - 1 << 3) - r) + " bit)\n", o = "", s = t + 1; s < e; ++s) {
                for (var a = this.get(s), h = s == e - 1 ? r : 0, c = 7; h <= c; --c)
                    o += a >> c & 1 ? "1" : "0";
                if (o.length > i)
                    return n + d(o, i)
            }
            return n + o
        }
        ,
        v.prototype.parseOctetString = function(t, e, i) {
            if (this.isASCII(t, e))
                return d(this.parseStringISO(t, e), i);
            var r = e - t
              , n = "(" + r + " byte)\n";
            (i /= 2) < r && (e = t + i);
            for (var o = t; o < e; ++o)
                n += this.hexByte(this.get(o));
            return i < r && (n += "…"),
            n
        }
        ,
        v.prototype.parseOID = function(t, e, i) {
            for (var r = "", n = new l, o = 0, s = t; s < e; ++s) {
                var a = this.get(s);
                if (n.mulAdd(128, 127 & a),
                o += 7,
                !(128 & a)) {
                    if ("" === r ? r = (n = n.simplify())instanceof l ? (n.sub(80),
                    "2." + n.toString()) : (a = n < 80 ? n < 40 ? 0 : 1 : 2) + "." + (n - 40 * a) : r += "." + n.toString(),
                    r.length > i)
                        return d(r, i);
                    n = new l,
                    o = 0
                }
            }
            return 0 < o && (r += ".incomplete"),
            r
        }
        ;
        var q = v
          , K = (y.prototype.typeName = function() {
            switch (this.tag.tagClass) {
            case 0:
                switch (this.tag.tagNumber) {
                case 0:
                    return "EOC";
                case 1:
                    return "BOOLEAN";
                case 2:
                    return "INTEGER";
                case 3:
                    return "BIT_STRING";
                case 4:
                    return "OCTET_STRING";
                case 5:
                    return "NULL";
                case 6:
                    return "OBJECT_IDENTIFIER";
                case 7:
                    return "ObjectDescriptor";
                case 8:
                    return "EXTERNAL";
                case 9:
                    return "REAL";
                case 10:
                    return "ENUMERATED";
                case 11:
                    return "EMBEDDED_PDV";
                case 12:
                    return "UTF8String";
                case 16:
                    return "SEQUENCE";
                case 17:
                    return "SET";
                case 18:
                    return "NumericString";
                case 19:
                    return "PrintableString";
                case 20:
                    return "TeletexString";
                case 21:
                    return "VideotexString";
                case 22:
                    return "IA5String";
                case 23:
                    return "UTCTime";
                case 24:
                    return "GeneralizedTime";
                case 25:
                    return "GraphicString";
                case 26:
                    return "VisibleString";
                case 27:
                    return "GeneralString";
                case 28:
                    return "UniversalString";
                case 30:
                    return "BMPString"
                }
                return "Universal_" + this.tag.tagNumber.toString();
            case 1:
                return "Application_" + this.tag.tagNumber.toString();
            case 2:
                return "[" + this.tag.tagNumber.toString() + "]";
            case 3:
                return "Private_" + this.tag.tagNumber.toString()
            }
        }
        ,
        y.prototype.content = function(t) {
            if (void 0 !== this.tag) {
                void 0 === t && (t = 1 / 0);
                var e = this.posContent()
                  , i = Math.abs(this.length);
                if (!this.tag.isUniversal())
                    return null !== this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e, e + i, t);
                switch (this.tag.tagNumber) {
                case 1:
                    return 0 === this.stream.get(e) ? "false" : "true";
                case 2:
                    return this.stream.parseInteger(e, e + i);
                case 3:
                    return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(e, e + i, t);
                case 4:
                    return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(e, e + i, t);
                case 6:
                    return this.stream.parseOID(e, e + i, t);
                case 16:
                case 17:
                    return null !== this.sub ? "(" + this.sub.length + " elem)" : "(no elem)";
                case 12:
                    return d(this.stream.parseStringUTF(e, e + i), t);
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 26:
                    return d(this.stream.parseStringISO(e, e + i), t);
                case 30:
                    return d(this.stream.parseStringBMP(e, e + i), t);
                case 23:
                case 24:
                    return this.stream.parseTime(e, e + i, 23 == this.tag.tagNumber)
                }
            }
            return null
        }
        ,
        y.prototype.toString = function() {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null" : this.sub.length) + "]"
        }
        ,
        y.prototype.toPrettyString = function(t) {
            var e = (t = void 0 === t ? "" : t) + this.typeName() + " @" + this.stream.pos;
            if (0 <= this.length && (e += "+"),
            e += this.length,
            this.tag.tagConstructed ? e += " (constructed)" : !this.tag.isUniversal() || 3 != this.tag.tagNumber && 4 != this.tag.tagNumber || null === this.sub || (e += " (encapsulates)"),
            e += "\n",
            null !== this.sub) {
                t += "  ";
                for (var i = 0, r = this.sub.length; i < r; ++i)
                    e += this.sub[i].toPrettyString(t)
            }
            return e
        }
        ,
        y.prototype.posStart = function() {
            return this.stream.pos
        }
        ,
        y.prototype.posContent = function() {
            return this.stream.pos + this.header
        }
        ,
        y.prototype.posEnd = function() {
            return this.stream.pos + this.header + Math.abs(this.length)
        }
        ,
        y.prototype.toHexString = function() {
            return this.stream.hexDump(this.posStart(), this.posEnd(), !0)
        }
        ,
        y.decodeLength = function(t) {
            var e = t.get()
              , i = 127 & e;
            if (i == e)
                return i;
            if (6 < i)
                throw new Error("Length over 48 bits not supported at position " + (t.pos - 1));
            if (0 == i)
                return null;
            for (var r = e = 0; r < i; ++r)
                e = 256 * e + t.get();
            return e
        }
        ,
        y.prototype.getHexStringValue = function() {
            var t = this.toHexString()
              , e = 2 * this.header
              , i = 2 * this.length;
            return t.substr(e, i)
        }
        ,
        y.decode = function(t) {
            function e() {
                var t = [];
                if (null !== o) {
                    for (var e = s + o; r.pos < e; )
                        t[t.length] = y.decode(r);
                    if (r.pos != e)
                        throw new Error("Content size is not correct for container starting at offset " + s)
                } else
                    try {
                        for (; ; ) {
                            var i = y.decode(r);
                            if (i.tag.isEOC())
                                break;
                            t[t.length] = i
                        }
                        o = s - r.pos
                    } catch (t) {
                        throw new Error("Exception while decoding undefined length content: " + t)
                    }
                return t
            }
            var r = t instanceof q ? t : new q(t,0)
              , i = new q(r)
              , n = new W(r)
              , o = y.decodeLength(r)
              , s = r.pos
              , a = s - i.pos
              , h = null;
            if (n.tagConstructed)
                h = e();
            else if (n.isUniversal() && (3 == n.tagNumber || 4 == n.tagNumber))
                try {
                    if (3 == n.tagNumber && 0 != r.get())
                        throw new Error("BIT STRINGs with unused bits cannot encapsulate.");
                    for (var h = e(), c = 0; c < h.length; ++c)
                        if (h[c].tag.isEOC())
                            throw new Error("EOC is not supposed to be actual content.")
                } catch (t) {
                    h = null
                }
            if (null === h) {
                if (null === o)
                    throw new Error("We can't skip over an invalid tag with undefined length at offset " + s);
                r.pos = s + Math.abs(o)
            }
            return new y(i,a,o,n,h)
        }
        ,
        y)
          , W = (Q.prototype.isUniversal = function() {
            return 0 === this.tagClass
        }
        ,
        Q.prototype.isEOC = function() {
            return 0 === this.tagClass && 0 === this.tagNumber
        }
        ,
        Q)
          , p = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]
          , X = (1 << 26) / p[p.length - 1]
          , g = (m.prototype.toString = function(t) {
            if (this.s < 0)
                return "-" + this.negate().toString(t);
            var e;
            if (16 == t)
                e = 4;
            else if (8 == t)
                e = 3;
            else if (2 == t)
                e = 1;
            else if (32 == t)
                e = 5;
            else {
                if (4 != t)
                    return this.toRadix(t);
                e = 2
            }
            var i, r = (1 << e) - 1, n = !1, o = "", s = this.t, a = this.DB - s * this.DB % e;
            if (0 < s--)
                for (a < this.DB && 0 < (i = this[s] >> a) && (n = !0,
                o = h(i)); 0 <= s; )
                    a < e ? (i = (this[s] & (1 << a) - 1) << e - a,
                    i |= this[--s] >> (a += this.DB - e)) : (i = this[s] >> (a -= e) & r,
                    a <= 0 && (a += this.DB,
                    --s)),
                    (n = 0 < i ? !0 : n) && (o += h(i));
            return n ? o : "0"
        }
        ,
        m.prototype.negate = function() {
            var t = w();
            return m.ZERO.subTo(this, t),
            t
        }
        ,
        m.prototype.abs = function() {
            return this.s < 0 ? this.negate() : this
        }
        ,
        m.prototype.compareTo = function(t) {
            var e = this.s - t.s;
            if (0 != e)
                return e;
            var i = this.t;
            if (0 != (e = i - t.t))
                return this.s < 0 ? -e : e;
            for (; 0 <= --i; )
                if (0 != (e = this[i] - t[i]))
                    return e;
            return 0
        }
        ,
        m.prototype.bitLength = function() {
            return this.t <= 0 ? 0 : this.DB * (this.t - 1) + E(this[this.t - 1] ^ this.s & this.DM)
        }
        ,
        m.prototype.mod = function(t) {
            var e = w();
            return this.abs().divRemTo(t, null, e),
            this.s < 0 && 0 < e.compareTo(m.ZERO) && t.subTo(e, e),
            e
        }
        ,
        m.prototype.modPowInt = function(t, e) {
            e = new (t < 256 || e.isEven() ? J : Y)(e);
            return this.exp(t, e)
        }
        ,
        m.prototype.clone = function() {
            var t = w();
            return this.copyTo(t),
            t
        }
        ,
        m.prototype.intValue = function() {
            if (this.s < 0) {
                if (1 == this.t)
                    return this[0] - this.DV;
                if (0 == this.t)
                    return -1
            } else {
                if (1 == this.t)
                    return this[0];
                if (0 == this.t)
                    return 0
            }
            return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
        }
        ,
        m.prototype.byteValue = function() {
            return 0 == this.t ? this.s : this[0] << 24 >> 24
        }
        ,
        m.prototype.shortValue = function() {
            return 0 == this.t ? this.s : this[0] << 16 >> 16
        }
        ,
        m.prototype.signum = function() {
            return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
        }
        ,
        m.prototype.toByteArray = function() {
            var t = this.t
              , e = [];
            e[0] = this.s;
            var i, r = this.DB - t * this.DB % 8, n = 0;
            if (0 < t--)
                for (r < this.DB && (i = this[t] >> r) != (this.s & this.DM) >> r && (e[n++] = i | this.s << this.DB - r); 0 <= t; )
                    r < 8 ? (i = (this[t] & (1 << r) - 1) << 8 - r,
                    i |= this[--t] >> (r += this.DB - 8)) : (i = this[t] >> (r -= 8) & 255,
                    r <= 0 && (r += this.DB,
                    --t)),
                    0 != (128 & i) && (i |= -256),
                    0 == n && (128 & this.s) != (128 & i) && ++n,
                    (0 < n || i != this.s) && (e[n++] = i);
            return e
        }
        ,
        m.prototype.equals = function(t) {
            return 0 == this.compareTo(t)
        }
        ,
        m.prototype.min = function(t) {
            return this.compareTo(t) < 0 ? this : t
        }
        ,
        m.prototype.max = function(t) {
            return 0 < this.compareTo(t) ? this : t
        }
        ,
        m.prototype.and = function(t) {
            var e = w();
            return this.bitwiseTo(t, N, e),
            e
        }
        ,
        m.prototype.or = function(t) {
            var e = w();
            return this.bitwiseTo(t, a, e),
            e
        }
        ,
        m.prototype.xor = function(t) {
            var e = w();
            return this.bitwiseTo(t, V, e),
            e
        }
        ,
        m.prototype.andNot = function(t) {
            var e = w();
            return this.bitwiseTo(t, H, e),
            e
        }
        ,
        m.prototype.not = function() {
            for (var t = w(), e = 0; e < this.t; ++e)
                t[e] = this.DM & ~this[e];
            return t.t = this.t,
            t.s = ~this.s,
            t
        }
        ,
        m.prototype.shiftLeft = function(t) {
            var e = w();
            return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e),
            e
        }
        ,
        m.prototype.shiftRight = function(t) {
            var e = w();
            return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e),
            e
        }
        ,
        m.prototype.getLowestSetBit = function() {
            for (var t, e, i = 0; i < this.t; ++i)
                if (0 != this[i])
                    return i * this.DB + (t = this[i],
                    e = void 0,
                    0 == t ? -1 : ((e = 0) == (65535 & t) && (t >>= 16,
                    e += 16),
                    0 == (255 & t) && (t >>= 8,
                    e += 8),
                    0 == (15 & t) && (t >>= 4,
                    e += 4),
                    0 == (3 & t) && (t >>= 2,
                    e += 2),
                    0 == (1 & t) && ++e,
                    e));
            return this.s < 0 ? this.t * this.DB : -1
        }
        ,
        m.prototype.bitCount = function() {
            for (var t = 0, e = this.s & this.DM, i = 0; i < this.t; ++i)
                t += function(t) {
                    for (var e = 0; 0 != t; )
                        t &= t - 1,
                        ++e;
                    return e
                }(this[i] ^ e);
            return t
        }
        ,
        m.prototype.testBit = function(t) {
            var e = Math.floor(t / this.DB);
            return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB)
        }
        ,
        m.prototype.setBit = function(t) {
            return this.changeBit(t, a)
        }
        ,
        m.prototype.clearBit = function(t) {
            return this.changeBit(t, H)
        }
        ,
        m.prototype.flipBit = function(t) {
            return this.changeBit(t, V)
        }
        ,
        m.prototype.add = function(t) {
            var e = w();
            return this.addTo(t, e),
            e
        }
        ,
        m.prototype.subtract = function(t) {
            var e = w();
            return this.subTo(t, e),
            e
        }
        ,
        m.prototype.multiply = function(t) {
            var e = w();
            return this.multiplyTo(t, e),
            e
        }
        ,
        m.prototype.divide = function(t) {
            var e = w();
            return this.divRemTo(t, e, null),
            e
        }
        ,
        m.prototype.remainder = function(t) {
            var e = w();
            return this.divRemTo(t, null, e),
            e
        }
        ,
        m.prototype.divideAndRemainder = function(t) {
            var e = w()
              , i = w();
            return this.divRemTo(t, e, i),
            [e, i]
        }
        ,
        m.prototype.modPow = function(t, e) {
            var i = t.bitLength()
              , r = _(1);
            if (i <= 0)
                return r;
            var n = i < 18 ? 1 : i < 48 ? 3 : i < 144 ? 4 : i < 768 ? 5 : 6
              , o = new (i < 8 ? J : e.isEven() ? $ : Y)(e)
              , s = []
              , a = 3
              , h = n - 1
              , c = (1 << n) - 1;
            if (s[1] = o.convert(this),
            1 < n) {
                var u = w();
                for (o.sqrTo(s[1], u); a <= c; )
                    s[a] = w(),
                    o.mulTo(u, s[a - 2], s[a]),
                    a += 2
            }
            for (var l, f, d = t.t - 1, p = !0, g = w(), i = E(t[d]) - 1; 0 <= d; ) {
                for (h <= i ? l = t[d] >> i - h & c : (l = (t[d] & (1 << i + 1) - 1) << h - i,
                0 < d && (l |= t[d - 1] >> this.DB + i - h)),
                a = n; 0 == (1 & l); )
                    l >>= 1,
                    --a;
                if ((i -= a) < 0 && (i += this.DB,
                --d),
                p)
                    s[l].copyTo(r),
                    p = !1;
                else {
                    for (; 1 < a; )
                        o.sqrTo(r, g),
                        o.sqrTo(g, r),
                        a -= 2;
                    0 < a ? o.sqrTo(r, g) : (f = r,
                    r = g,
                    g = f),
                    o.mulTo(g, s[l], r)
                }
                for (; 0 <= d && 0 == (t[d] & 1 << i); )
                    o.sqrTo(r, g),
                    f = r,
                    r = g,
                    g = f,
                    --i < 0 && (i = this.DB - 1,
                    --d)
            }
            return o.revert(r)
        }
        ,
        m.prototype.modInverse = function(t) {
            var e = t.isEven();
            if (this.isEven() && e || 0 == t.signum())
                return m.ZERO;
            for (var i = t.clone(), r = this.clone(), n = _(1), o = _(0), s = _(0), a = _(1); 0 != i.signum(); ) {
                for (; i.isEven(); )
                    i.rShiftTo(1, i),
                    e ? (n.isEven() && o.isEven() || (n.addTo(this, n),
                    o.subTo(t, o)),
                    n.rShiftTo(1, n)) : o.isEven() || o.subTo(t, o),
                    o.rShiftTo(1, o);
                for (; r.isEven(); )
                    r.rShiftTo(1, r),
                    e ? (s.isEven() && a.isEven() || (s.addTo(this, s),
                    a.subTo(t, a)),
                    s.rShiftTo(1, s)) : a.isEven() || a.subTo(t, a),
                    a.rShiftTo(1, a);
                0 <= i.compareTo(r) ? (i.subTo(r, i),
                e && n.subTo(s, n),
                o.subTo(a, o)) : (r.subTo(i, r),
                e && s.subTo(n, s),
                a.subTo(o, a))
            }
            return 0 != r.compareTo(m.ONE) ? m.ZERO : 0 <= a.compareTo(t) ? a.subtract(t) : a.signum() < 0 && (a.addTo(t, a),
            a.signum() < 0) ? a.add(t) : a
        }
        ,
        m.prototype.pow = function(t) {
            return this.exp(t, new Z)
        }
        ,
        m.prototype.gcd = function(t) {
            var e = this.s < 0 ? this.negate() : this.clone()
              , i = t.s < 0 ? t.negate() : t.clone()
              , r = (e.compareTo(i) < 0 && (t = e,
            e = i,
            i = t),
            e.getLowestSetBit())
              , t = i.getLowestSetBit();
            if (t < 0)
                return e;
            for (0 < (t = r < t ? r : t) && (e.rShiftTo(t, e),
            i.rShiftTo(t, i)); 0 < e.signum(); )
                0 < (r = e.getLowestSetBit()) && e.rShiftTo(r, e),
                0 < (r = i.getLowestSetBit()) && i.rShiftTo(r, i),
                0 <= e.compareTo(i) ? (e.subTo(i, e),
                e.rShiftTo(1, e)) : (i.subTo(e, i),
                i.rShiftTo(1, i));
            return 0 < t && i.lShiftTo(t, i),
            i
        }
        ,
        m.prototype.isProbablePrime = function(t) {
            var e, i = this.abs();
            if (1 == i.t && i[0] <= p[p.length - 1]) {
                for (e = 0; e < p.length; ++e)
                    if (i[0] == p[e])
                        return !0;
                return !1
            }
            if (i.isEven())
                return !1;
            for (e = 1; e < p.length; ) {
                for (var r = p[e], n = e + 1; n < p.length && r < X; )
                    r *= p[n++];
                for (r = i.modInt(r); e < n; )
                    if (r % p[e++] == 0)
                        return !1
            }
            return i.millerRabin(t)
        }
        ,
        m.prototype.copyTo = function(t) {
            for (var e = this.t - 1; 0 <= e; --e)
                t[e] = this[e];
            t.t = this.t,
            t.s = this.s
        }
        ,
        m.prototype.fromInt = function(t) {
            this.t = 1,
            this.s = t < 0 ? -1 : 0,
            0 < t ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0
        }
        ,
        m.prototype.fromString = function(t, e) {
            var i;
            if (16 == e)
                i = 4;
            else if (8 == e)
                i = 3;
            else if (256 == e)
                i = 8;
            else if (2 == e)
                i = 1;
            else if (32 == e)
                i = 5;
            else {
                if (4 != e)
                    return void this.fromRadix(t, e);
                i = 2
            }
            this.t = 0,
            this.s = 0;
            for (var r = t.length, n = !1, o = 0; 0 <= --r; ) {
                var s = 8 == i ? 255 & +t[r] : tt(t, r);
                s < 0 ? "-" == t.charAt(r) && (n = !0) : (n = !1,
                0 == o ? this[this.t++] = s : o + i > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - o) - 1) << o,
                this[this.t++] = s >> this.DB - o) : this[this.t - 1] |= s << o,
                (o += i) >= this.DB && (o -= this.DB))
            }
            8 == i && 0 != (128 & +t[0]) && (this.s = -1,
            0 < o) && (this[this.t - 1] |= (1 << this.DB - o) - 1 << o),
            this.clamp(),
            n && m.ZERO.subTo(this, this)
        }
        ,
        m.prototype.clamp = function() {
            for (var t = this.s & this.DM; 0 < this.t && this[this.t - 1] == t; )
                --this.t
        }
        ,
        m.prototype.dlShiftTo = function(t, e) {
            for (var i = this.t - 1; 0 <= i; --i)
                e[i + t] = this[i];
            for (i = t - 1; 0 <= i; --i)
                e[i] = 0;
            e.t = this.t + t,
            e.s = this.s
        }
        ,
        m.prototype.drShiftTo = function(t, e) {
            for (var i = t; i < this.t; ++i)
                e[i - t] = this[i];
            e.t = Math.max(this.t - t, 0),
            e.s = this.s
        }
        ,
        m.prototype.lShiftTo = function(t, e) {
            for (var i = t % this.DB, r = this.DB - i, n = (1 << r) - 1, o = Math.floor(t / this.DB), s = this.s << i & this.DM, a = this.t - 1; 0 <= a; --a)
                e[a + o + 1] = this[a] >> r | s,
                s = (this[a] & n) << i;
            for (a = o - 1; 0 <= a; --a)
                e[a] = 0;
            e[o] = s,
            e.t = this.t + o + 1,
            e.s = this.s,
            e.clamp()
        }
        ,
        m.prototype.rShiftTo = function(t, e) {
            e.s = this.s;
            var i = Math.floor(t / this.DB);
            if (i >= this.t)
                e.t = 0;
            else {
                var r = t % this.DB
                  , n = this.DB - r
                  , o = (1 << r) - 1;
                e[0] = this[i] >> r;
                for (var s = i + 1; s < this.t; ++s)
                    e[s - i - 1] |= (this[s] & o) << n,
                    e[s - i] = this[s] >> r;
                0 < r && (e[this.t - i - 1] |= (this.s & o) << n),
                e.t = this.t - i,
                e.clamp()
            }
        }
        ,
        m.prototype.subTo = function(t, e) {
            for (var i = 0, r = 0, n = Math.min(t.t, this.t); i < n; )
                r += this[i] - t[i],
                e[i++] = r & this.DM,
                r >>= this.DB;
            if (t.t < this.t) {
                for (r -= t.s; i < this.t; )
                    r += this[i],
                    e[i++] = r & this.DM,
                    r >>= this.DB;
                r += this.s
            } else {
                for (r += this.s; i < t.t; )
                    r -= t[i],
                    e[i++] = r & this.DM,
                    r >>= this.DB;
                r -= t.s
            }
            e.s = r < 0 ? -1 : 0,
            r < -1 ? e[i++] = this.DV + r : 0 < r && (e[i++] = r),
            e.t = i,
            e.clamp()
        }
        ,
        m.prototype.multiplyTo = function(t, e) {
            var i = this.abs()
              , r = t.abs()
              , n = i.t;
            for (e.t = n + r.t; 0 <= --n; )
                e[n] = 0;
            for (n = 0; n < r.t; ++n)
                e[n + i.t] = i.am(0, r[n], e, n, 0, i.t);
            e.s = 0,
            e.clamp(),
            this.s != t.s && m.ZERO.subTo(e, e)
        }
        ,
        m.prototype.squareTo = function(t) {
            for (var e = this.abs(), i = t.t = 2 * e.t; 0 <= --i; )
                t[i] = 0;
            for (i = 0; i < e.t - 1; ++i) {
                var r = e.am(i, e[i], t, 2 * i, 0, 1);
                (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, r, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV,
                t[i + e.t + 1] = 1)
            }
            0 < t.t && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)),
            t.s = 0,
            t.clamp()
        }
        ,
        m.prototype.divRemTo = function(t, e, i) {
            var r = t.abs();
            if (!(r.t <= 0)) {
                var n = this.abs();
                if (n.t < r.t)
                    null != e && e.fromInt(0),
                    null != i && this.copyTo(i);
                else {
                    null == i && (i = w());
                    var o = w()
                      , s = this.s
                      , t = t.s
                      , a = this.DB - E(r[r.t - 1])
                      , h = (0 < a ? (r.lShiftTo(a, o),
                    n.lShiftTo(a, i)) : (r.copyTo(o),
                    n.copyTo(i)),
                    o.t)
                      , c = o[h - 1];
                    if (0 != c) {
                        var r = c * (1 << this.F1) + (1 < h ? o[h - 2] >> this.F2 : 0)
                          , u = this.FV / r
                          , l = (1 << this.F1) / r
                          , f = 1 << this.F2
                          , d = i.t
                          , p = d - h
                          , g = null == e ? w() : e;
                        for (o.dlShiftTo(p, g),
                        0 <= i.compareTo(g) && (i[i.t++] = 1,
                        i.subTo(g, i)),
                        m.ONE.dlShiftTo(h, g),
                        g.subTo(o, o); o.t < h; )
                            o[o.t++] = 0;
                        for (; 0 <= --p; ) {
                            var y = i[--d] == c ? this.DM : Math.floor(i[d] * u + (i[d - 1] + f) * l);
                            if ((i[d] += o.am(0, y, i, p, 0, h)) < y)
                                for (o.dlShiftTo(p, g),
                                i.subTo(g, i); i[d] < --y; )
                                    i.subTo(g, i)
                        }
                        null != e && (i.drShiftTo(h, e),
                        s != t) && m.ZERO.subTo(e, e),
                        i.t = h,
                        i.clamp(),
                        0 < a && i.rShiftTo(a, i),
                        s < 0 && m.ZERO.subTo(i, i)
                    }
                }
            }
        }
        ,
        m.prototype.invDigit = function() {
            var t, e;
            return this.t < 1 || 0 == (1 & (t = this[0])) ? 0 : 0 < (e = (e = (e = (e = (e = 3 & t) * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) ? this.DV - e : -e
        }
        ,
        m.prototype.isEven = function() {
            return 0 == (0 < this.t ? 1 & this[0] : this.s)
        }
        ,
        m.prototype.exp = function(t, e) {
            if (4294967295 < t || t < 1)
                return m.ONE;
            var i, r = w(), n = w(), o = e.convert(this), s = E(t) - 1;
            for (o.copyTo(r); 0 <= --s; )
                e.sqrTo(r, n),
                0 < (t & 1 << s) ? e.mulTo(n, o, r) : (i = r,
                r = n,
                n = i);
            return e.revert(r)
        }
        ,
        m.prototype.chunkSize = function(t) {
            return Math.floor(Math.LN2 * this.DB / Math.log(t))
        }
        ,
        m.prototype.toRadix = function(t) {
            if (null == t && (t = 10),
            0 == this.signum() || t < 2 || 36 < t)
                return "0";
            var e = this.chunkSize(t)
              , i = Math.pow(t, e)
              , r = _(i)
              , n = w()
              , o = w()
              , s = "";
            for (this.divRemTo(r, n, o); 0 < n.signum(); )
                s = (i + o.intValue()).toString(t).substr(1) + s,
                n.divRemTo(r, n, o);
            return o.intValue().toString(t) + s
        }
        ,
        m.prototype.fromRadix = function(t, e) {
            this.fromInt(0);
            for (var i = this.chunkSize(e = null == e ? 10 : e), r = Math.pow(e, i), n = !1, o = 0, s = 0, a = 0; a < t.length; ++a) {
                var h = tt(t, a);
                h < 0 ? "-" == t.charAt(a) && 0 == this.signum() && (n = !0) : (s = e * s + h,
                ++o >= i && (this.dMultiply(r),
                this.dAddOffset(s, 0),
                s = o = 0))
            }
            0 < o && (this.dMultiply(Math.pow(e, o)),
            this.dAddOffset(s, 0)),
            n && m.ZERO.subTo(this, this)
        }
        ,
        m.prototype.fromNumber = function(t, e, i) {
            if ("number" == typeof e)
                if (t < 2)
                    this.fromInt(1);
                else
                    for (this.fromNumber(t, i),
                    this.testBit(t - 1) || this.bitwiseTo(m.ONE.shiftLeft(t - 1), a, this),
                    this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(e); )
                        this.dAddOffset(2, 0),
                        this.bitLength() > t && this.subTo(m.ONE.shiftLeft(t - 1), this);
            else {
                var i = []
                  , r = 7 & t;
                i.length = 1 + (t >> 3),
                e.nextBytes(i),
                0 < r ? i[0] &= (1 << r) - 1 : i[0] = 0,
                this.fromString(i, 256)
            }
        }
        ,
        m.prototype.bitwiseTo = function(t, e, i) {
            for (var r, n = Math.min(t.t, this.t), o = 0; o < n; ++o)
                i[o] = e(this[o], t[o]);
            if (t.t < this.t) {
                for (r = t.s & this.DM,
                o = n; o < this.t; ++o)
                    i[o] = e(this[o], r);
                i.t = this.t
            } else {
                for (r = this.s & this.DM,
                o = n; o < t.t; ++o)
                    i[o] = e(r, t[o]);
                i.t = t.t
            }
            i.s = e(this.s, t.s),
            i.clamp()
        }
        ,
        m.prototype.changeBit = function(t, e) {
            t = m.ONE.shiftLeft(t);
            return this.bitwiseTo(t, e, t),
            t
        }
        ,
        m.prototype.addTo = function(t, e) {
            for (var i = 0, r = 0, n = Math.min(t.t, this.t); i < n; )
                r += this[i] + t[i],
                e[i++] = r & this.DM,
                r >>= this.DB;
            if (t.t < this.t) {
                for (r += t.s; i < this.t; )
                    r += this[i],
                    e[i++] = r & this.DM,
                    r >>= this.DB;
                r += this.s
            } else {
                for (r += this.s; i < t.t; )
                    r += t[i],
                    e[i++] = r & this.DM,
                    r >>= this.DB;
                r += t.s
            }
            e.s = r < 0 ? -1 : 0,
            0 < r ? e[i++] = r : r < -1 && (e[i++] = this.DV + r),
            e.t = i,
            e.clamp()
        }
        ,
        m.prototype.dMultiply = function(t) {
            this[this.t] = this.am(0, t - 1, this, 0, 0, this.t),
            ++this.t,
            this.clamp()
        }
        ,
        m.prototype.dAddOffset = function(t, e) {
            if (0 != t) {
                for (; this.t <= e; )
                    this[this.t++] = 0;
                for (this[e] += t; this[e] >= this.DV; )
                    this[e] -= this.DV,
                    ++e >= this.t && (this[this.t++] = 0),
                    ++this[e]
            }
        }
        ,
        m.prototype.multiplyLowerTo = function(t, e, i) {
            var r = Math.min(this.t + t.t, e);
            for (i.s = 0,
            i.t = r; 0 < r; )
                i[--r] = 0;
            for (var n = i.t - this.t; r < n; ++r)
                i[r + this.t] = this.am(0, t[r], i, r, 0, this.t);
            for (n = Math.min(t.t, e); r < n; ++r)
                this.am(0, t[r], i, r, 0, e - r);
            i.clamp()
        }
        ,
        m.prototype.multiplyUpperTo = function(t, e, i) {
            var r = i.t = this.t + t.t - --e;
            for (i.s = 0; 0 <= --r; )
                i[r] = 0;
            for (r = Math.max(e - this.t, 0); r < t.t; ++r)
                i[this.t + r - e] = this.am(e - r, t[r], i, 0, 0, this.t + r - e);
            i.clamp(),
            i.drShiftTo(1, i)
        }
        ,
        m.prototype.modInt = function(t) {
            if (t <= 0)
                return 0;
            var e = this.DV % t
              , i = this.s < 0 ? t - 1 : 0;
            if (0 < this.t)
                if (0 == e)
                    i = this[0] % t;
                else
                    for (var r = this.t - 1; 0 <= r; --r)
                        i = (e * i + this[r]) % t;
            return i
        }
        ,
        m.prototype.millerRabin = function(t) {
            var e = this.subtract(m.ONE)
              , i = e.getLowestSetBit();
            if (i <= 0)
                return !1;
            var r = e.shiftRight(i);
            p.length < (t = t + 1 >> 1) && (t = p.length);
            for (var n = w(), o = 0; o < t; ++o) {
                n.fromInt(p[Math.floor(Math.random() * p.length)]);
                var s = n.modPow(r, this);
                if (0 != s.compareTo(m.ONE) && 0 != s.compareTo(e)) {
                    for (var a = 1; a++ < i && 0 != s.compareTo(e); )
                        if (0 == (s = s.modPowInt(2, this)).compareTo(m.ONE))
                            return !1;
                    if (0 != s.compareTo(e))
                        return !1
                }
            }
            return !0
        }
        ,
        m.prototype.square = function() {
            var t = w();
            return this.squareTo(t),
            t
        }
        ,
        m.prototype.gcda = function(t, e) {
            var i, r = this.s < 0 ? this.negate() : this.clone(), n = t.s < 0 ? t.negate() : t.clone(), o = (r.compareTo(n) < 0 && (t = r,
            r = n,
            n = t),
            r.getLowestSetBit()), s = n.getLowestSetBit();
            s < 0 ? e(r) : (0 < (s = o < s ? o : s) && (r.rShiftTo(s, r),
            n.rShiftTo(s, n)),
            i = function() {
                0 < (o = r.getLowestSetBit()) && r.rShiftTo(o, r),
                0 < (o = n.getLowestSetBit()) && n.rShiftTo(o, n),
                0 <= r.compareTo(n) ? (r.subTo(n, r),
                r.rShiftTo(1, r)) : (n.subTo(r, n),
                n.rShiftTo(1, n)),
                0 < r.signum() ? setTimeout(i, 0) : (0 < s && n.lShiftTo(s, n),
                setTimeout(function() {
                    e(n)
                }, 0))
            }
            ,
            setTimeout(i, 10))
        }
        ,
        m.prototype.fromNumberAsync = function(t, e, i, r) {
            var n, o, s;
            "number" == typeof e ? t < 2 ? this.fromInt(1) : (this.fromNumber(t, i),
            this.testBit(t - 1) || this.bitwiseTo(m.ONE.shiftLeft(t - 1), a, this),
            this.isEven() && this.dAddOffset(1, 0),
            n = this,
            o = function() {
                n.dAddOffset(2, 0),
                n.bitLength() > t && n.subTo(m.ONE.shiftLeft(t - 1), n),
                n.isProbablePrime(e) ? setTimeout(function() {
                    r()
                }, 0) : setTimeout(o, 0)
            }
            ,
            setTimeout(o, 0)) : (i = 7 & t,
            (s = []).length = 1 + (t >> 3),
            e.nextBytes(s),
            0 < i ? s[0] &= (1 << i) - 1 : s[0] = 0,
            this.fromString(s, 256))
        }
        ,
        m)
          , Z = (o.prototype.convert = function(t) {
            return t
        }
        ,
        o.prototype.revert = function(t) {
            return t
        }
        ,
        o.prototype.mulTo = function(t, e, i) {
            t.multiplyTo(e, i)
        }
        ,
        o.prototype.sqrTo = function(t, e) {
            t.squareTo(e)
        }
        ,
        o)
          , J = (n.prototype.convert = function(t) {
            return t.s < 0 || 0 <= t.compareTo(this.m) ? t.mod(this.m) : t
        }
        ,
        n.prototype.revert = function(t) {
            return t
        }
        ,
        n.prototype.reduce = function(t) {
            t.divRemTo(this.m, null, t)
        }
        ,
        n.prototype.mulTo = function(t, e, i) {
            t.multiplyTo(e, i),
            this.reduce(i)
        }
        ,
        n.prototype.sqrTo = function(t, e) {
            t.squareTo(e),
            this.reduce(e)
        }
        ,
        n)
          , Y = (i.prototype.convert = function(t) {
            var e = w();
            return t.abs().dlShiftTo(this.m.t, e),
            e.divRemTo(this.m, null, e),
            t.s < 0 && 0 < e.compareTo(g.ZERO) && this.m.subTo(e, e),
            e
        }
        ,
        i.prototype.revert = function(t) {
            var e = w();
            return t.copyTo(e),
            this.reduce(e),
            e
        }
        ,
        i.prototype.reduce = function(t) {
            for (; t.t <= this.mt2; )
                t[t.t++] = 0;
            for (var e = 0; e < this.m.t; ++e) {
                var i = 32767 & t[e]
                  , r = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                for (t[i = e + this.m.t] += this.m.am(0, r, t, e, 0, this.m.t); t[i] >= t.DV; )
                    t[i] -= t.DV,
                    t[++i]++
            }
            t.clamp(),
            t.drShiftTo(this.m.t, t),
            0 <= t.compareTo(this.m) && t.subTo(this.m, t)
        }
        ,
        i.prototype.mulTo = function(t, e, i) {
            t.multiplyTo(e, i),
            this.reduce(i)
        }
        ,
        i.prototype.sqrTo = function(t, e) {
            t.squareTo(e),
            this.reduce(e)
        }
        ,
        i)
          , $ = (e.prototype.convert = function(t) {
            var e;
            return t.s < 0 || t.t > 2 * this.m.t ? t.mod(this.m) : t.compareTo(this.m) < 0 ? t : (e = w(),
            t.copyTo(e),
            this.reduce(e),
            e)
        }
        ,
        e.prototype.revert = function(t) {
            return t
        }
        ,
        e.prototype.reduce = function(t) {
            for (t.drShiftTo(this.m.t - 1, this.r2),
            t.t > this.m.t + 1 && (t.t = this.m.t + 1,
            t.clamp()),
            this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
            this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0; )
                t.dAddOffset(1, this.m.t + 1);
            for (t.subTo(this.r2, t); 0 <= t.compareTo(this.m); )
                t.subTo(this.m, t)
        }
        ,
        e.prototype.mulTo = function(t, e, i) {
            t.multiplyTo(e, i),
            this.reduce(i)
        }
        ,
        e.prototype.sqrTo = function(t, e) {
            t.squareTo(e),
            this.reduce(e)
        }
        ,
        e);
        function e(t) {
            this.m = t,
            this.r2 = w(),
            this.q3 = w(),
            g.ONE.dlShiftTo(2 * t.t, this.r2),
            this.mu = this.r2.divide(t)
        }
        function i(t) {
            this.m = t,
            this.mp = t.invDigit(),
            this.mpl = 32767 & this.mp,
            this.mph = this.mp >> 15,
            this.um = (1 << t.DB - 15) - 1,
            this.mt2 = 2 * t.t
        }
        function n(t) {
            this.m = t
        }
        function o() {}
        function m(t, e, i) {
            null != t && ("number" == typeof t ? this.fromNumber(t, e, i) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
        }
        function Q(t) {
            var e = t.get();
            if (this.tagClass = e >> 6,
            this.tagConstructed = 0 != (32 & e),
            this.tagNumber = 31 & e,
            31 == this.tagNumber) {
                for (var i = new l; e = t.get(),
                i.mulAdd(128, 127 & e),
                128 & e; )
                    ;
                this.tagNumber = i.simplify()
            }
        }
        function y(t, e, i, r, n) {
            if (!(r instanceof W))
                throw new Error("Invalid tag value.");
            this.stream = t,
            this.header = e,
            this.length = i,
            this.tag = r,
            this.sub = n
        }
        function v(t, e) {
            this.hexDigits = "0123456789ABCDEF",
            t instanceof v ? (this.enc = t.enc,
            this.pos = t.pos) : (this.enc = t,
            this.pos = e)
        }
        function w() {
            return new g(null)
        }
        function S(t, e) {
            return new g(t,e)
        }
        k = "Microsoft Internet Explorer" == navigator.appName ? (g.prototype.am = function(t, e, i, r, n, o) {
            for (var s = 32767 & e, a = e >> 15; 0 <= --o; ) {
                var h = 32767 & this[t]
                  , c = this[t++] >> 15
                  , u = a * h + c * s;
                n = ((h = s * h + ((32767 & u) << 15) + i[r] + (1073741823 & n)) >>> 30) + (u >>> 15) + a * c + (n >>> 30),
                i[r++] = 1073741823 & h
            }
            return n
        }
        ,
        30) : "Netscape" != navigator.appName ? (g.prototype.am = function(t, e, i, r, n, o) {
            for (; 0 <= --o; ) {
                var s = e * this[t++] + i[r] + n;
                n = Math.floor(s / 67108864),
                i[r++] = 67108863 & s
            }
            return n
        }
        ,
        26) : (g.prototype.am = function(t, e, i, r, n, o) {
            for (var s = 16383 & e, a = e >> 14; 0 <= --o; ) {
                var h = 16383 & this[t]
                  , c = this[t++] >> 14
                  , u = a * h + c * s;
                n = ((h = s * h + ((16383 & u) << 14) + i[r] + n) >> 28) + (u >> 14) + a * c,
                i[r++] = 268435455 & h
            }
            return n
        }
        ,
        28),
        g.prototype.DB = k,
        g.prototype.DM = (1 << k) - 1,
        g.prototype.DV = 1 << k,
        g.prototype.FV = Math.pow(2, 52),
        g.prototype.F1 = 52 - k,
        g.prototype.F2 = 2 * k - 52;
        for (var T = [], b = "0".charCodeAt(0), B = 0; B <= 9; ++B)
            T[b++] = B;
        for (b = "a".charCodeAt(0),
        B = 10; B < 36; ++B)
            T[b++] = B;
        for (b = "A".charCodeAt(0),
        B = 10; B < 36; ++B)
            T[b++] = B;
        function tt(t, e) {
            t = T[t.charCodeAt(e)];
            return null == t ? -1 : t
        }
        function _(t) {
            var e = w();
            return e.fromInt(t),
            e
        }
        function E(t) {
            var e, i = 1;
            return 0 != (e = t >>> 16) && (t = e,
            i += 16),
            0 != (e = t >> 8) && (t = e,
            i += 8),
            0 != (e = t >> 4) && (t = e,
            i += 4),
            0 != (e = t >> 2) && (t = e,
            i += 2),
            0 != (e = t >> 1) && (t = e,
            i += 1),
            i
        }
        g.ZERO = _(0),
        g.ONE = _(1);
        it.prototype.init = function(t) {
            for (var e, i, r = 0; r < 256; ++r)
                this.S[r] = r;
            for (r = e = 0; r < 256; ++r)
                e = e + this.S[r] + t[r % t.length] & 255,
                i = this.S[r],
                this.S[r] = this.S[e],
                this.S[e] = i;
            this.i = 0,
            this.j = 0
        }
        ,
        it.prototype.next = function() {
            var t;
            return this.i = this.i + 1 & 255,
            this.j = this.j + this.S[this.i] & 255,
            t = this.S[this.i],
            this.S[this.i] = this.S[this.j],
            this.S[this.j] = t,
            this.S[t + this.S[this.i] & 255]
        }
        ;
        var et = it;
        function it() {
            this.i = 0,
            this.j = 0,
            this.S = []
        }
        var x, A;
        if (null == (D = null)) {
            var D = []
              , C = void (A = 0);
            if (window.crypto && window.crypto.getRandomValues) {
                var rt = new Uint32Array(256);
                for (window.crypto.getRandomValues(rt),
                C = 0; C < rt.length; ++C)
                    D[A++] = 255 & rt[C]
            }
            var nt = function(t) {
                if (this.count = this.count || 0,
                256 <= this.count || 256 <= A)
                    window.removeEventListener ? window.removeEventListener("mousemove", nt, !1) : window.detachEvent && window.detachEvent("onmousemove", nt);
                else
                    try {
                        var e = t.x + t.y;
                        D[A++] = 255 & e,
                        this.count += 1
                    } catch (t) {}
            };
            window.addEventListener ? window.addEventListener("mousemove", nt, !1) : window.attachEvent && window.attachEvent("onmousemove", nt)
        }
        st.prototype.nextBytes = function(t) {
            for (var e = 0; e < t.length; ++e)
                t[e] = function() {
                    if (null == x) {
                        for (x = new et; A < 256; ) {
                            var t = Math.floor(65536 * Math.random());
                            D[A++] = 255 & t
                        }
                        for (x.init(D),
                        A = 0; A < D.length; ++A)
                            D[A] = 0;
                        A = 0
                    }
                    return x.next()
                }()
        }
        ;
        var ot = st;
        function st() {}
        O.prototype.doPublic = function(t) {
            return t.modPowInt(this.e, this.n)
        }
        ,
        O.prototype.doPrivate = function(t) {
            if (null == this.p || null == this.q)
                return t.modPow(this.d, this.n);
            for (var e = t.mod(this.p).modPow(this.dmp1, this.p), i = t.mod(this.q).modPow(this.dmq1, this.q); e.compareTo(i) < 0; )
                e = e.add(this.p);
            return e.subtract(i).multiply(this.coeff).mod(this.p).multiply(this.q).add(i)
        }
        ,
        O.prototype.setPublic = function(t, e) {
            null != t && null != e && 0 < t.length && 0 < e.length ? (this.n = S(t, 16),
            this.e = parseInt(e, 16)) : console.error("Invalid RSA public key")
        }
        ,
        O.prototype.encrypt = function(t) {
            var t = function(t, e) {
                if (e < t.length + 11)
                    return console.error("Message too long for RSA"),
                    null;
                for (var i = [], r = t.length - 1; 0 <= r && 0 < e; ) {
                    var n = t.charCodeAt(r--);
                    n < 128 ? i[--e] = n : 127 < n && n < 2048 ? (i[--e] = 63 & n | 128,
                    i[--e] = n >> 6 | 192) : (i[--e] = 63 & n | 128,
                    i[--e] = n >> 6 & 63 | 128,
                    i[--e] = n >> 12 | 224)
                }
                i[--e] = 0;
                for (var o = new ot, s = []; 2 < e; ) {
                    for (s[0] = 0; 0 == s[0]; )
                        o.nextBytes(s);
                    i[--e] = s[0]
                }
                return i[--e] = 2,
                i[--e] = 0,
                new g(i)
            }(t, this.n.bitLength() + 7 >> 3);
            return null == t || null == (t = this.doPublic(t)) ? null : 0 == (1 & (t = t.toString(16)).length) ? t : "0" + t
        }
        ,
        O.prototype.setPrivate = function(t, e, i) {
            null != t && null != e && 0 < t.length && 0 < e.length ? (this.n = S(t, 16),
            this.e = parseInt(e, 16),
            this.d = S(i, 16)) : console.error("Invalid RSA private key")
        }
        ,
        O.prototype.setPrivateEx = function(t, e, i, r, n, o, s, a) {
            null != t && null != e && 0 < t.length && 0 < e.length ? (this.n = S(t, 16),
            this.e = parseInt(e, 16),
            this.d = S(i, 16),
            this.p = S(r, 16),
            this.q = S(n, 16),
            this.dmp1 = S(o, 16),
            this.dmq1 = S(s, 16),
            this.coeff = S(a, 16)) : console.error("Invalid RSA private key")
        }
        ,
        O.prototype.generate = function(t, e) {
            var i = new ot
              , r = t >> 1;
            this.e = parseInt(e, 16);
            for (var n = new g(e,16); ; ) {
                for (; this.p = new g(t - r,1,i),
                0 != this.p.subtract(g.ONE).gcd(n).compareTo(g.ONE) || !this.p.isProbablePrime(10); )
                    ;
                for (; this.q = new g(r,1,i),
                0 != this.q.subtract(g.ONE).gcd(n).compareTo(g.ONE) || !this.q.isProbablePrime(10); )
                    ;
                this.p.compareTo(this.q) <= 0 && (o = this.p,
                this.p = this.q,
                this.q = o);
                var o = this.p.subtract(g.ONE)
                  , s = this.q.subtract(g.ONE)
                  , a = o.multiply(s);
                if (0 == a.gcd(n).compareTo(g.ONE)) {
                    this.n = this.p.multiply(this.q),
                    this.d = n.modInverse(a),
                    this.dmp1 = this.d.mod(o),
                    this.dmq1 = this.d.mod(s),
                    this.coeff = this.q.modInverse(this.p);
                    break
                }
            }
        }
        ,
        O.prototype.decrypt = function(t) {
            t = S(t, 16),
            t = this.doPrivate(t);
            if (null == t)
                return null;
            for (var e = this.n.bitLength() + 7 >> 3, i = t.toByteArray(), r = 0; r < i.length && 0 == i[r]; )
                ++r;
            if (i.length - r != e - 1 || 2 != i[r])
                return null;
            for (++r; 0 != i[r]; )
                if (++r >= i.length)
                    return null;
            for (var n = ""; ++r < i.length; ) {
                var o = 255 & i[r];
                o < 128 ? n += String.fromCharCode(o) : 191 < o && o < 224 ? (n += String.fromCharCode((31 & o) << 6 | 63 & i[r + 1]),
                ++r) : (n += String.fromCharCode((15 & o) << 12 | (63 & i[r + 1]) << 6 | 63 & i[r + 2]),
                r += 2)
            }
            return n
        }
        ,
        O.prototype.generateAsync = function(t, e, n) {
            var o = new ot
              , s = t >> 1
              , a = (this.e = parseInt(e, 16),
            new g(e,16))
              , h = this
              , c = function() {
                function e() {
                    h.p = w(),
                    h.p.fromNumberAsync(t - s, 1, o, function() {
                        h.p.subtract(g.ONE).gcda(a, function(t) {
                            0 == t.compareTo(g.ONE) && h.p.isProbablePrime(10) ? setTimeout(r, 0) : setTimeout(e, 0)
                        })
                    })
                }
                var i = function() {
                    h.p.compareTo(h.q) <= 0 && (t = h.p,
                    h.p = h.q,
                    h.q = t);
                    var t = h.p.subtract(g.ONE)
                      , e = h.q.subtract(g.ONE)
                      , i = t.multiply(e);
                    0 == i.gcd(a).compareTo(g.ONE) ? (h.n = h.p.multiply(h.q),
                    h.d = a.modInverse(i),
                    h.dmp1 = h.d.mod(t),
                    h.dmq1 = h.d.mod(e),
                    h.coeff = h.q.modInverse(h.p),
                    setTimeout(function() {
                        n()
                    }, 0)) : setTimeout(c, 0)
                }
                  , r = function() {
                    h.q = w(),
                    h.q.fromNumberAsync(s, 1, o, function() {
                        h.q.subtract(g.ONE).gcda(a, function(t) {
                            0 == t.compareTo(g.ONE) && h.q.isProbablePrime(10) ? setTimeout(i, 0) : setTimeout(r, 0)
                        })
                    })
                };
                setTimeout(e, 0)
            };
            setTimeout(c, 0)
        }
        ,
        O.prototype.sign = function(t, e, i) {
            i = function(t, e) {
                if (e < t.length + 22)
                    return console.error("Message too long for RSA"),
                    null;
                for (var i = e - t.length - 6, r = "", n = 0; n < i; n += 2)
                    r += "ff";
                return S("0001" + r + "00" + t, 16)
            }((ct[i] || "") + e(t).toString(), this.n.bitLength() / 4);
            return null == i || null == (e = this.doPrivate(i)) ? null : 0 == (1 & (t = e.toString(16)).length) ? t : "0" + t
        }
        ,
        O.prototype.verify = function(t, e, i) {
            e = S(e, 16),
            e = this.doPublic(e);
            return null == e ? null : function(t) {
                for (var e in ct)
                    if (ct.hasOwnProperty(e)) {
                        var e = ct[e]
                          , i = e.length;
                        if (t.substr(0, i) == e)
                            return t.substr(i)
                    }
                return t
            }(e.toString(16).replace(/^1f+00/, "")) == i(t).toString()
        }
        ;
        var k = O;
        function O() {
            this.n = null,
            this.e = 0,
            this.d = null,
            this.p = null,
            this.q = null,
            this.dmp1 = null,
            this.dmq1 = null,
            this.coeff = null
        }
        var at, ht, ct = {
            md2: "3020300c06082a864886f70d020205000410",
            md5: "3020300c06082a864886f70d020505000410",
            sha1: "3021300906052b0e03021a05000414",
            sha224: "302d300d06096086480165030402040500041c",
            sha256: "3031300d060960864801650304020105000420",
            sha384: "3041300d060960864801650304020205000430",
            sha512: "3051300d060960864801650304020305000440",
            ripemd160: "3021300906052b2403020105000414"
        }, R = {
            lang: {
                extend: function(t, e, i) {
                    if (!e || !t)
                        throw new Error("YAHOO.lang.extend failed, please check that all dependencies are included.");
                    function r() {}
                    if (r.prototype = e.prototype,
                    t.prototype = new r,
                    (t.prototype.constructor = t).superclass = e.prototype,
                    e.prototype.constructor == Object.prototype.constructor && (e.prototype.constructor = e),
                    i) {
                        for (var n in i)
                            t.prototype[n] = i[n];
                        var e = function() {}
                          , o = ["toString", "valueOf"];
                        try {
                            /MSIE/.test(navigator.userAgent) && (e = function(t, e) {
                                for (n = 0; n < o.length; n += 1) {
                                    var i = o[n]
                                      , r = e[i];
                                    "function" == typeof r && r != Object.prototype[i] && (t[i] = r)
                                }
                            }
                            )
                        } catch (t) {}
                        e(t.prototype, i)
                    }
                }
            }
        }, M = {}, ut = (void 0 !== M.asn1 && M.asn1 || (M.asn1 = {}),
        M.asn1.ASN1Util = new function() {
            this.integerToByteHex = function(t) {
                t = t.toString(16);
                return t = t.length % 2 == 1 ? "0" + t : t
            }
            ,
            this.bigIntToMinTwosComplementsHex = function(t) {
                var e = t.toString(16);
                if ("-" != e.substr(0, 1))
                    e.length % 2 == 1 ? e = "0" + e : e.match(/^[0-7]/) || (e = "00" + e);
                else {
                    var i = e.substr(1).length;
                    i % 2 == 1 ? i += 1 : e.match(/^[0-7]/) || (i += 2);
                    for (var r = "", n = 0; n < i; n++)
                        r += "f";
                    e = new g(r,16).xor(t).add(g.ONE).toString(16).replace(/^-/, "")
                }
                return e
            }
            ,
            this.getPEMStringFromHex = function(t, e) {
                return hextopem(t, e)
            }
            ,
            this.newObject = function(t) {
                var e = M.asn1
                  , i = e.DERBoolean
                  , r = e.DERInteger
                  , n = e.DERBitString
                  , o = e.DEROctetString
                  , s = e.DERNull
                  , a = e.DERObjectIdentifier
                  , h = e.DEREnumerated
                  , c = e.DERUTF8String
                  , u = e.DERNumericString
                  , l = e.DERPrintableString
                  , f = e.DERTeletexString
                  , d = e.DERIA5String
                  , p = e.DERUTCTime
                  , g = e.DERGeneralizedTime
                  , y = e.DERSequence
                  , m = e.DERSet
                  , v = e.DERTaggedObject
                  , w = e.ASN1Util.newObject
                  , e = Object.keys(t);
                if (1 != e.length)
                    throw "key of param shall be only one.";
                e = e[0];
                if (-1 == ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":" + e + ":"))
                    throw "undefined key: " + e;
                if ("bool" == e)
                    return new i(t[e]);
                if ("int" == e)
                    return new r(t[e]);
                if ("bitstr" == e)
                    return new n(t[e]);
                if ("octstr" == e)
                    return new o(t[e]);
                if ("null" == e)
                    return new s(t[e]);
                if ("oid" == e)
                    return new a(t[e]);
                if ("enum" == e)
                    return new h(t[e]);
                if ("utf8str" == e)
                    return new c(t[e]);
                if ("numstr" == e)
                    return new u(t[e]);
                if ("prnstr" == e)
                    return new l(t[e]);
                if ("telstr" == e)
                    return new f(t[e]);
                if ("ia5str" == e)
                    return new d(t[e]);
                if ("utctime" == e)
                    return new p(t[e]);
                if ("gentime" == e)
                    return new g(t[e]);
                if ("seq" == e) {
                    for (var S = t[e], T = [], b = 0; b < S.length; b++) {
                        var B = w(S[b]);
                        T.push(B)
                    }
                    return new y({
                        array: T
                    })
                }
                if ("set" == e) {
                    for (S = t[e],
                    T = [],
                    b = 0; b < S.length; b++)
                        B = w(S[b]),
                        T.push(B);
                    return new m({
                        array: T
                    })
                }
                if ("tag" == e) {
                    i = t[e];
                    if ("[object Array]" === Object.prototype.toString.call(i) && 3 == i.length)
                        return r = w(i[2]),
                        new v({
                            tag: i[0],
                            explicit: i[1],
                            obj: r
                        });
                    n = {};
                    if (void 0 !== i.explicit && (n.explicit = i.explicit),
                    void 0 !== i.tag && (n.tag = i.tag),
                    void 0 === i.obj)
                        throw "obj shall be specified for 'tag'.";
                    return n.obj = w(i.obj),
                    new v(n)
                }
            }
            ,
            this.jsonToASN1HEX = function(t) {
                return this.newObject(t).getEncodedHex()
            }
        }
        ,
        M.asn1.ASN1Util.oidHexToInt = function(t) {
            for (var e = "", i = parseInt(t.substr(0, 2), 16), r = (e = Math.floor(i / 40) + "." + i % 40,
            ""), n = 2; n < t.length; n += 2) {
                var o = ("00000000" + parseInt(t.substr(n, 2), 16).toString(2)).slice(-8);
                r += o.substr(1, 7),
                "0" == o.substr(0, 1) && (e = e + "." + new g(r,2).toString(10),
                r = "")
            }
            return e
        }
        ,
        M.asn1.ASN1Util.oidIntToHex = function(t) {
            function a(t) {
                return t = 1 == (t = t.toString(16)).length ? "0" + t : t
            }
            if (!t.match(/^[0-9.]+$/))
                throw "malformed oid string: " + t;
            var e = ""
              , i = t.split(".")
              , t = 40 * parseInt(i[0]) + parseInt(i[1]);
            e += a(t),
            i.splice(0, 2);
            for (var r = 0; r < i.length; r++)
                e += function(t) {
                    var e = ""
                      , i = new g(t,10).toString(2)
                      , r = 7 - i.length % 7;
                    7 == r && (r = 0);
                    for (var n = "", o = 0; o < r; o++)
                        n += "0";
                    for (i = n + i,
                    o = 0; o < i.length - 1; o += 7) {
                        var s = i.substr(o, 7);
                        o != i.length - 7 && (s = "1" + s),
                        e += a(parseInt(s, 2))
                    }
                    return e
                }(i[r]);
            return e
        }
        ,
        M.asn1.ASN1Object = function() {
            this.getLengthHexFromValue = function() {
                if (void 0 === this.hV || null == this.hV)
                    throw "this.hV is null or undefined.";
                if (this.hV.length % 2 == 1)
                    throw "value hex must be even length: n=" + "".length + ",v=" + this.hV;
                var t = this.hV.length / 2
                  , e = t.toString(16);
                if (e.length % 2 == 1 && (e = "0" + e),
                t < 128)
                    return e;
                var i = e.length / 2;
                if (15 < i)
                    throw "ASN.1 length too long to represent by 8x: n = " + t.toString(16);
                return (128 + i).toString(16) + e
            }
            ,
            this.getEncodedHex = function() {
                return null != this.hTLV && !this.isModified || (this.hV = this.getFreshValueHex(),
                this.hL = this.getLengthHexFromValue(),
                this.hTLV = this.hT + this.hL + this.hV,
                this.isModified = !1),
                this.hTLV
            }
            ,
            this.getValueHex = function() {
                return this.getEncodedHex(),
                this.hV
            }
            ,
            this.getFreshValueHex = function() {
                return ""
            }
        }
        ,
        M.asn1.DERAbstractString = function(t) {
            M.asn1.DERAbstractString.superclass.constructor.call(this),
            this.getString = function() {
                return this.s
            }
            ,
            this.setString = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.s = t,
                this.hV = stohex(this.s)
            }
            ,
            this.setStringHex = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.s = null,
                this.hV = t
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
            ,
            void 0 !== t && ("string" == typeof t ? this.setString(t) : void 0 !== t.str ? this.setString(t.str) : void 0 !== t.hex && this.setStringHex(t.hex))
        }
        ,
        R.lang.extend(M.asn1.DERAbstractString, M.asn1.ASN1Object),
        M.asn1.DERAbstractTime = function(t) {
            M.asn1.DERAbstractTime.superclass.constructor.call(this),
            this.localDateToUTC = function(t) {
                return utc = t.getTime() + 6e4 * t.getTimezoneOffset(),
                new Date(utc)
            }
            ,
            this.formatDate = function(t, e, i) {
                var r = this.zeroPadding
                  , t = this.localDateToUTC(t)
                  , n = String(t.getFullYear())
                  , e = (n = "utc" == e ? n.substr(2, 2) : n) + r(String(t.getMonth() + 1), 2) + r(String(t.getDate()), 2) + r(String(t.getHours()), 2) + r(String(t.getMinutes()), 2) + r(String(t.getSeconds()), 2);
                return (e = !0 === i && 0 != (n = t.getMilliseconds()) ? e + "." + r(String(n), 3).replace(/[0]+$/, "") : e) + "Z"
            }
            ,
            this.zeroPadding = function(t, e) {
                return t.length >= e ? t : new Array(e - t.length + 1).join("0") + t
            }
            ,
            this.getString = function() {
                return this.s
            }
            ,
            this.setString = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.s = t,
                this.hV = stohex(t)
            }
            ,
            this.setByDateValue = function(t, e, i, r, n, o) {
                t = new Date(Date.UTC(t, e - 1, i, r, n, o, 0));
                this.setByDate(t)
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
        }
        ,
        R.lang.extend(M.asn1.DERAbstractTime, M.asn1.ASN1Object),
        M.asn1.DERAbstractStructured = function(t) {
            M.asn1.DERAbstractString.superclass.constructor.call(this),
            this.setByASN1ObjectArray = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.asn1Array = t
            }
            ,
            this.appendASN1Object = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.asn1Array.push(t)
            }
            ,
            this.asn1Array = new Array,
            void 0 !== t && void 0 !== t.array && (this.asn1Array = t.array)
        }
        ,
        R.lang.extend(M.asn1.DERAbstractStructured, M.asn1.ASN1Object),
        M.asn1.DERBoolean = function() {
            M.asn1.DERBoolean.superclass.constructor.call(this),
            this.hT = "01",
            this.hTLV = "0101ff"
        }
        ,
        R.lang.extend(M.asn1.DERBoolean, M.asn1.ASN1Object),
        M.asn1.DERInteger = function(t) {
            M.asn1.DERInteger.superclass.constructor.call(this),
            this.hT = "02",
            this.setByBigInteger = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.hV = M.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)
            }
            ,
            this.setByInteger = function(t) {
                t = new g(String(t),10);
                this.setByBigInteger(t)
            }
            ,
            this.setValueHex = function(t) {
                this.hV = t
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
            ,
            void 0 !== t && (void 0 !== t.bigint ? this.setByBigInteger(t.bigint) : void 0 !== t.int ? this.setByInteger(t.int) : "number" == typeof t ? this.setByInteger(t) : void 0 !== t.hex && this.setValueHex(t.hex))
        }
        ,
        R.lang.extend(M.asn1.DERInteger, M.asn1.ASN1Object),
        M.asn1.DERBitString = function(t) {
            var e;
            void 0 !== t && void 0 !== t.obj && (e = M.asn1.ASN1Util.newObject(t.obj),
            t.hex = "00" + e.getEncodedHex()),
            M.asn1.DERBitString.superclass.constructor.call(this),
            this.hT = "03",
            this.setHexValueIncludingUnusedBits = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.hV = t
            }
            ,
            this.setUnusedBitsAndHexValue = function(t, e) {
                if (t < 0 || 7 < t)
                    throw "unused bits shall be from 0 to 7: u = " + t;
                t = "0" + t;
                this.hTLV = null,
                this.isModified = !0,
                this.hV = t + e
            }
            ,
            this.setByBinaryString = function(t) {
                var e = 8 - (t = t.replace(/0+$/, "")).length % 8;
                8 == e && (e = 0);
                for (var i = 0; i <= e; i++)
                    t += "0";
                for (var r = "", i = 0; i < t.length - 1; i += 8) {
                    var n = t.substr(i, 8)
                      , n = parseInt(n, 2).toString(16);
                    r += n = 1 == n.length ? "0" + n : n
                }
                this.hTLV = null,
                this.isModified = !0,
                this.hV = "0" + e + r
            }
            ,
            this.setByBooleanArray = function(t) {
                for (var e = "", i = 0; i < t.length; i++)
                    1 == t[i] ? e += "1" : e += "0";
                this.setByBinaryString(e)
            }
            ,
            this.newFalseArray = function(t) {
                for (var e = new Array(t), i = 0; i < t; i++)
                    e[i] = !1;
                return e
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
            ,
            void 0 !== t && ("string" == typeof t && t.toLowerCase().match(/^[0-9a-f]+$/) ? this.setHexValueIncludingUnusedBits(t) : void 0 !== t.hex ? this.setHexValueIncludingUnusedBits(t.hex) : void 0 !== t.bin ? this.setByBinaryString(t.bin) : void 0 !== t.array && this.setByBooleanArray(t.array))
        }
        ,
        R.lang.extend(M.asn1.DERBitString, M.asn1.ASN1Object),
        M.asn1.DEROctetString = function(t) {
            var e;
            void 0 !== t && void 0 !== t.obj && (e = M.asn1.ASN1Util.newObject(t.obj),
            t.hex = e.getEncodedHex()),
            M.asn1.DEROctetString.superclass.constructor.call(this, t),
            this.hT = "04"
        }
        ,
        R.lang.extend(M.asn1.DEROctetString, M.asn1.DERAbstractString),
        M.asn1.DERNull = function() {
            M.asn1.DERNull.superclass.constructor.call(this),
            this.hT = "05",
            this.hTLV = "0500"
        }
        ,
        R.lang.extend(M.asn1.DERNull, M.asn1.ASN1Object),
        M.asn1.DERObjectIdentifier = function(t) {
            var a = function(t) {
                t = t.toString(16);
                return t = 1 == t.length ? "0" + t : t
            };
            M.asn1.DERObjectIdentifier.superclass.constructor.call(this),
            this.hT = "06",
            this.setValueHex = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.s = null,
                this.hV = t
            }
            ,
            this.setValueOidString = function(t) {
                if (!t.match(/^[0-9.]+$/))
                    throw "malformed oid string: " + t;
                var e = ""
                  , i = t.split(".")
                  , t = 40 * parseInt(i[0]) + parseInt(i[1]);
                e += a(t),
                i.splice(0, 2);
                for (var r = 0; r < i.length; r++)
                    e += function(t) {
                        var e = ""
                          , i = new g(t,10).toString(2)
                          , r = 7 - i.length % 7;
                        7 == r && (r = 0);
                        for (var n = "", o = 0; o < r; o++)
                            n += "0";
                        for (i = n + i,
                        o = 0; o < i.length - 1; o += 7) {
                            var s = i.substr(o, 7);
                            o != i.length - 7 && (s = "1" + s),
                            e += a(parseInt(s, 2))
                        }
                        return e
                    }(i[r]);
                this.hTLV = null,
                this.isModified = !0,
                this.s = null,
                this.hV = e
            }
            ,
            this.setValueName = function(t) {
                var e = M.asn1.x509.OID.name2oid(t);
                if ("" === e)
                    throw "DERObjectIdentifier oidName undefined: " + t;
                this.setValueOidString(e)
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
            ,
            void 0 !== t && ("string" == typeof t ? t.match(/^[0-2].[0-9.]+$/) ? this.setValueOidString(t) : this.setValueName(t) : void 0 !== t.oid ? this.setValueOidString(t.oid) : void 0 !== t.hex ? this.setValueHex(t.hex) : void 0 !== t.name && this.setValueName(t.name))
        }
        ,
        R.lang.extend(M.asn1.DERObjectIdentifier, M.asn1.ASN1Object),
        M.asn1.DEREnumerated = function(t) {
            M.asn1.DEREnumerated.superclass.constructor.call(this),
            this.hT = "0a",
            this.setByBigInteger = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.hV = M.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)
            }
            ,
            this.setByInteger = function(t) {
                t = new g(String(t),10);
                this.setByBigInteger(t)
            }
            ,
            this.setValueHex = function(t) {
                this.hV = t
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
            ,
            void 0 !== t && (void 0 !== t.int ? this.setByInteger(t.int) : "number" == typeof t ? this.setByInteger(t) : void 0 !== t.hex && this.setValueHex(t.hex))
        }
        ,
        R.lang.extend(M.asn1.DEREnumerated, M.asn1.ASN1Object),
        M.asn1.DERUTF8String = function(t) {
            M.asn1.DERUTF8String.superclass.constructor.call(this, t),
            this.hT = "0c"
        }
        ,
        R.lang.extend(M.asn1.DERUTF8String, M.asn1.DERAbstractString),
        M.asn1.DERNumericString = function(t) {
            M.asn1.DERNumericString.superclass.constructor.call(this, t),
            this.hT = "12"
        }
        ,
        R.lang.extend(M.asn1.DERNumericString, M.asn1.DERAbstractString),
        M.asn1.DERPrintableString = function(t) {
            M.asn1.DERPrintableString.superclass.constructor.call(this, t),
            this.hT = "13"
        }
        ,
        R.lang.extend(M.asn1.DERPrintableString, M.asn1.DERAbstractString),
        M.asn1.DERTeletexString = function(t) {
            M.asn1.DERTeletexString.superclass.constructor.call(this, t),
            this.hT = "14"
        }
        ,
        R.lang.extend(M.asn1.DERTeletexString, M.asn1.DERAbstractString),
        M.asn1.DERIA5String = function(t) {
            M.asn1.DERIA5String.superclass.constructor.call(this, t),
            this.hT = "16"
        }
        ,
        R.lang.extend(M.asn1.DERIA5String, M.asn1.DERAbstractString),
        M.asn1.DERUTCTime = function(t) {
            M.asn1.DERUTCTime.superclass.constructor.call(this, t),
            this.hT = "17",
            this.setByDate = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.date = t,
                this.s = this.formatDate(this.date, "utc"),
                this.hV = stohex(this.s)
            }
            ,
            this.getFreshValueHex = function() {
                return void 0 === this.date && void 0 === this.s && (this.date = new Date,
                this.s = this.formatDate(this.date, "utc"),
                this.hV = stohex(this.s)),
                this.hV
            }
            ,
            void 0 !== t && (void 0 !== t.str ? this.setString(t.str) : "string" == typeof t && t.match(/^[0-9]{12}Z$/) ? this.setString(t) : void 0 !== t.hex ? this.setStringHex(t.hex) : void 0 !== t.date && this.setByDate(t.date))
        }
        ,
        R.lang.extend(M.asn1.DERUTCTime, M.asn1.DERAbstractTime),
        M.asn1.DERGeneralizedTime = function(t) {
            M.asn1.DERGeneralizedTime.superclass.constructor.call(this, t),
            this.hT = "18",
            this.withMillis = !1,
            this.setByDate = function(t) {
                this.hTLV = null,
                this.isModified = !0,
                this.date = t,
                this.s = this.formatDate(this.date, "gen", this.withMillis),
                this.hV = stohex(this.s)
            }
            ,
            this.getFreshValueHex = function() {
                return void 0 === this.date && void 0 === this.s && (this.date = new Date,
                this.s = this.formatDate(this.date, "gen", this.withMillis),
                this.hV = stohex(this.s)),
                this.hV
            }
            ,
            void 0 !== t && (void 0 !== t.str ? this.setString(t.str) : "string" == typeof t && t.match(/^[0-9]{14}Z$/) ? this.setString(t) : void 0 !== t.hex ? this.setStringHex(t.hex) : void 0 !== t.date && this.setByDate(t.date),
            !0 === t.millis) && (this.withMillis = !0)
        }
        ,
        R.lang.extend(M.asn1.DERGeneralizedTime, M.asn1.DERAbstractTime),
        M.asn1.DERSequence = function(t) {
            M.asn1.DERSequence.superclass.constructor.call(this, t),
            this.hT = "30",
            this.getFreshValueHex = function() {
                for (var t = "", e = 0; e < this.asn1Array.length; e++)
                    t += this.asn1Array[e].getEncodedHex();
                return this.hV = t,
                this.hV
            }
        }
        ,
        R.lang.extend(M.asn1.DERSequence, M.asn1.DERAbstractStructured),
        M.asn1.DERSet = function(t) {
            M.asn1.DERSet.superclass.constructor.call(this, t),
            this.hT = "31",
            this.sortFlag = !0,
            this.getFreshValueHex = function() {
                for (var t = new Array, e = 0; e < this.asn1Array.length; e++) {
                    var i = this.asn1Array[e];
                    t.push(i.getEncodedHex())
                }
                return 1 == this.sortFlag && t.sort(),
                this.hV = t.join(""),
                this.hV
            }
            ,
            void 0 !== t && void 0 !== t.sortflag && 0 == t.sortflag && (this.sortFlag = !1)
        }
        ,
        R.lang.extend(M.asn1.DERSet, M.asn1.DERAbstractStructured),
        M.asn1.DERTaggedObject = function(t) {
            M.asn1.DERTaggedObject.superclass.constructor.call(this),
            this.hT = "a0",
            this.hV = "",
            this.isExplicit = !0,
            this.asn1Object = null,
            this.setASN1Object = function(t, e, i) {
                this.hT = e,
                this.isExplicit = t,
                this.asn1Object = i,
                this.isExplicit ? (this.hV = this.asn1Object.getEncodedHex(),
                this.hTLV = null,
                this.isModified = !0) : (this.hV = null,
                this.hTLV = i.getEncodedHex(),
                this.hTLV = this.hTLV.replace(/^../, e),
                this.isModified = !1)
            }
            ,
            this.getFreshValueHex = function() {
                return this.hV
            }
            ,
            void 0 !== t && (void 0 !== t.tag && (this.hT = t.tag),
            void 0 !== t.explicit && (this.isExplicit = t.explicit),
            void 0 !== t.obj) && (this.asn1Object = t.obj,
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object))
        }
        ,
        R.lang.extend(M.asn1.DERTaggedObject, M.asn1.ASN1Object),
        U(ht = P, R = at = k),
        ht.prototype = null === R ? Object.create(R) : (lt.prototype = R.prototype,
        new lt),
        P.prototype.parseKey = function(t) {
            try {
                var e = 0
                  , i = 0
                  , r = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/.test(t) ? function(t) {
                    if (void 0 === f) {
                        var e = "0123456789ABCDEF"
                          , i = " \f\n\r\t \u2028\u2029";
                        for (f = {},
                        s = 0; s < 16; ++s)
                            f[e.charAt(s)] = s;
                        for (e = e.toLowerCase(),
                        s = 10; s < 16; ++s)
                            f[e.charAt(s)] = s;
                        for (s = 0; s < i.length; ++s)
                            f[i.charAt(s)] = -1
                    }
                    for (var r = [], n = 0, o = 0, s = 0; s < t.length; ++s) {
                        var a = t.charAt(s);
                        if ("=" == a)
                            break;
                        if (-1 != (a = f[a])) {
                            if (void 0 === a)
                                throw new Error("Illegal character at offset " + s);
                            n |= a,
                            2 <= ++o ? (r[r.length] = n,
                            o = n = 0) : n <<= 4
                        }
                    }
                    if (o)
                        throw new Error("Hex encoding incomplete: 4 bits missing");
                    return r
                }(t) : j.unarmor(t)
                  , n = K.decode(r);
                if (9 === (n = 3 === n.sub.length ? n.sub[2].sub[0] : n).sub.length) {
                    e = n.sub[1].getHexStringValue(),
                    this.n = S(e, 16),
                    i = n.sub[2].getHexStringValue(),
                    this.e = parseInt(i, 16);
                    var o = n.sub[3].getHexStringValue()
                      , s = (this.d = S(o, 16),
                    n.sub[4].getHexStringValue())
                      , a = (this.p = S(s, 16),
                    n.sub[5].getHexStringValue())
                      , h = (this.q = S(a, 16),
                    n.sub[6].getHexStringValue())
                      , c = (this.dmp1 = S(h, 16),
                    n.sub[7].getHexStringValue())
                      , u = (this.dmq1 = S(c, 16),
                    n.sub[8].getHexStringValue());
                    this.coeff = S(u, 16)
                } else {
                    if (2 !== n.sub.length)
                        return !1;
                    var l = n.sub[1].sub[0]
                      , e = l.sub[0].getHexStringValue();
                    this.n = S(e, 16),
                    i = l.sub[1].getHexStringValue(),
                    this.e = parseInt(i, 16)
                }
                return !0
            } catch (t) {
                return !1
            }
        }
        ,
        P.prototype.getPrivateBaseKey = function() {
            var t = {
                array: [new M.asn1.DERInteger({
                    int: 0
                }), new M.asn1.DERInteger({
                    bigint: this.n
                }), new M.asn1.DERInteger({
                    int: this.e
                }), new M.asn1.DERInteger({
                    bigint: this.d
                }), new M.asn1.DERInteger({
                    bigint: this.p
                }), new M.asn1.DERInteger({
                    bigint: this.q
                }), new M.asn1.DERInteger({
                    bigint: this.dmp1
                }), new M.asn1.DERInteger({
                    bigint: this.dmq1
                }), new M.asn1.DERInteger({
                    bigint: this.coeff
                })]
            };
            return new M.asn1.DERSequence(t).getEncodedHex()
        }
        ,
        P.prototype.getPrivateBaseKeyB64 = function() {
            return r(this.getPrivateBaseKey())
        }
        ,
        P.prototype.getPublicBaseKey = function() {
            var t = new M.asn1.DERSequence({
                array: [new M.asn1.DERObjectIdentifier({
                    oid: "1.2.840.113549.1.1.1"
                }), new M.asn1.DERNull]
            })
              , e = new M.asn1.DERSequence({
                array: [new M.asn1.DERInteger({
                    bigint: this.n
                }), new M.asn1.DERInteger({
                    int: this.e
                })]
            })
              , e = new M.asn1.DERBitString({
                hex: "00" + e.getEncodedHex()
            });
            return new M.asn1.DERSequence({
                array: [t, e]
            }).getEncodedHex()
        }
        ,
        P.prototype.getPublicBaseKeyB64 = function() {
            return r(this.getPublicBaseKey())
        }
        ,
        P.wordwrap = function(t, e) {
            return t && (e = "(.{1," + (e = e || 64) + "})( +|$\n?)|(.{1," + e + "})",
            t.match(RegExp(e, "g")).join("\n"))
        }
        ,
        P.prototype.getPrivateKey = function() {
            var t = "-----BEGIN RSA PRIVATE KEY-----\n";
            return (t += P.wordwrap(this.getPrivateBaseKeyB64()) + "\n") + "-----END RSA PRIVATE KEY-----"
        }
        ,
        P.prototype.getPublicKey = function() {
            var t = "-----BEGIN PUBLIC KEY-----\n";
            return (t += P.wordwrap(this.getPublicBaseKeyB64()) + "\n") + "-----END PUBLIC KEY-----"
        }
        ,
        P.hasPublicKeyProperty = function(t) {
            return (t = t || {}).hasOwnProperty("n") && t.hasOwnProperty("e")
        }
        ,
        P.hasPrivateKeyProperty = function(t) {
            return (t = t || {}).hasOwnProperty("n") && t.hasOwnProperty("e") && t.hasOwnProperty("d") && t.hasOwnProperty("p") && t.hasOwnProperty("q") && t.hasOwnProperty("dmp1") && t.hasOwnProperty("dmq1") && t.hasOwnProperty("coeff")
        }
        ,
        P.prototype.parsePropertiesFrom = function(t) {
            this.n = t.n,
            this.e = t.e,
            t.hasOwnProperty("d") && (this.d = t.d,
            this.p = t.p,
            this.q = t.q,
            this.dmp1 = t.dmp1,
            this.dmq1 = t.dmq1,
            this.coeff = t.coeff)
        }
        ,
        P), k = (I.prototype.setKey = function(t) {
            this.log && this.key && console.warn("A key was already set, overriding existing."),
            this.key = new ut(t)
        }
        ,
        I.prototype.setPrivateKey = function(t) {
            this.setKey(t)
        }
        ,
        I.prototype.setPublicKey = function(t) {
            this.setKey(t)
        }
        ,
        I.prototype.decrypt = function(t) {
            try {
                return this.getKey().decrypt(F(t))
            } catch (t) {
                return !1
            }
        }
        ,
        I.prototype.encrypt = function(t) {
            try {
                return r(this.getKey().encrypt(t))
            } catch (t) {
                return !1
            }
        }
        ,
        I.prototype.sign = function(t, e, i) {
            try {
                return r(this.getKey().sign(t, e, i))
            } catch (t) {
                return !1
            }
        }
        ,
        I.prototype.verify = function(t, e, i) {
            try {
                return this.getKey().verify(t, F(e), i)
            } catch (t) {
                return !1
            }
        }
        ,
        I.prototype.getKey = function(t) {
            if (!this.key) {
                if (this.key = new ut,
                t && "[object Function]" === {}.toString.call(t))
                    return void this.key.generateAsync(this.default_key_size, this.default_public_exponent, t);
                this.key.generate(this.default_key_size, this.default_public_exponent)
            }
            return this.key
        }
        ,
        I.prototype.getPrivateKey = function() {
            return this.getKey().getPrivateKey()
        }
        ,
        I.prototype.getPrivateKeyB64 = function() {
            return this.getKey().getPrivateBaseKeyB64()
        }
        ,
        I.prototype.getPublicKey = function() {
            return this.getKey().getPublicKey()
        }
        ,
        I.prototype.getPublicKeyB64 = function() {
            return this.getKey().getPublicBaseKeyB64()
        }
        ,
        I.version = "3.0.0-rc.1",
        I);
        function I(t) {
            t = t || {},
            this.default_key_size = parseInt(t.default_key_size, 10) || 1024,
            this.default_public_exponent = t.default_public_exponent || "010001",
            this.log = t.log || !1,
            this.key = null
        }
        function P(t) {
            var e = at.call(this) || this;
            return t && ("string" == typeof t ? e.parseKey(t) : (P.hasPrivateKeyProperty(t) || P.hasPublicKeyProperty(t)) && e.parsePropertiesFrom(t)),
            e
        }
        function lt() {
            this.constructor = ht
        }
        window.JSEncrypt = k,
        L.JSEncrypt = k,
        L.default = k,
        Object.defineProperty(L, "__esModule", {
            value: !0
        })
    }(window.JSEncrypt={});
    var ths_stat = function() {
        this.id = 0,
        this.ld = "browser";
        try {
            "undefined" != typeof external && void 0 !== external.createObject && (this.ld = "client")
        } catch (t) {}
        var t = "https:" == document.location.protocol ? "https:" : "http:";
        this._top = !0,
        this.size = screen.width + "x" + screen.height,
        this._base = t + "//stat.10jqka.com.cn/q?",
        this._sid = "__ths_stat__",
        this._random_userid_cookie_name = "ta_random_userid",
        this.initRandomUserid()
    }
      , TA = (ths_stat.prototype.initRandomUserid = function() {
        var t = this.getCookie(this._random_userid_cookie_name);
        t || (t = this.getRandomStr(10),
        this.setCookie(this._random_userid_cookie_name, t)),
        this.random_userid = t
    }
    ,
    ths_stat.prototype.getRandomStr = function(t, e) {
        for (var i, r = [], n = "abcdefghijklmnopqrstuvwxyz0123456789".split(""), o = (t = "number" == typeof t && 0 < t ? t : 0,
        (n = e instanceof Array && 0 < e.length ? e : n).length), s = 0; s < t; s++)
            i = Math.floor(Math.random() * o),
            r.push(n[i]);
        return r.join("")
    }
    ,
    ths_stat.prototype.getCookie = function(t) {
        var e = document.cookie.split(";");
        try {
            for (var i = 0; i < e.length; i++) {
                var r = e[i].split("=");
                if (r[0].trim() === t)
                    return decodeURI(r[1])
            }
        } catch (t) {}
        return null
    }
    ,
    ths_stat.prototype.setCookie = function(t, e, i) {
        var i = i || 31104e7
          , r = new Date
          , i = r.getTime() + i;
        r.setTime(i),
        document.cookie = t + "=" + e + ";expires=" + r.toGMTString() + ";path=/"
    }
    ,
    ths_stat.prototype._navigate = function(t) {
        var e = document.getElementById(this._sid);
        e || ((e = document.createElement("img")).id = this._sid,
        e.height = 0,
        e.width = 0,
        e.setAttribute("style", "display:none"),
        document.body.appendChild(e)),
        e.src = t
    }
    ,
    ths_stat.prototype.add = function(t, e) {
        if (t && e)
            this.id = t,
            this.ld = e;
        else if (t instanceof Object)
            for (k in t)
                this[k] = t[k];
        else
            t && (this.id = t)
    }
    ,
    ths_stat.prototype._setLocation = function() {
        if (this._top && top)
            try {
                this.ref || (this.ref = top.document.referrer),
                this.url || (this.url = top.location.href)
            } catch (t) {}
        this.ref || (this.ref = document.referrer || null),
        this.url || (this.url = window.location.href),
        this.cs = document.body.clientWidth + "x" + document.body.clientHeight,
        this.ts = (new Date).getTime()
    }
    ,
    ths_stat.prototype._getUrl = function() {
        this._setLocation();
        var t = [];
        if (!window.__ta_performance) {
            if (window.performance && window.performance.timing) {
                var e = window.performance.timing;
                try {
                    t.push("dt=" + (e.domainLookupEnd - e.domainLookupStart) + "&"),
                    t.push("tt=" + (e.connectEnd - e.connectStart) + "&"),
                    t.push("rt=" + (e.responseStart - e.requestStart) + "&"),
                    t.push("bt=" + (e.responseStart - e.navigationStart) + "&"),
                    t.push("sp=1")
                } catch (t) {}
            } else
                t.push("sp=0");
            window.__ta_performance = !0
        }
        for (k in this)
            k && "_" != k.charAt(0) && this[k] && "function" != typeof this[k] && (t.length && t.push("&"),
            t = t.concat([encodeURIComponent(k), "=", encodeURIComponent(this[k])]));
        return this._base + t.join("")
    }
    ,
    ths_stat.prototype.log = function() {
        this._navigate(this._getUrl())
    }
    ,
    ths_stat.prototype.getEvent = function(t) {
        var e, i;
        return null == (t = t || windows.event).pageX && null != t.clientX && (e = document.documentElement,
        i = document.body,
        t.pageX = t.clientX + (e && e.scrollLeft || i && i.scrollLeft || 0) - (e && e.clientLeft || i && i.clientLeft || 0),
        t.pageY = t.clientY + (e && e.scrollTop || i && i.scrollTop || 0) - (e && e.clientTop || i && i.clientTop || 0)),
        t
    }
    ,
    ths_stat.prototype._onClick = function(t) {
        t = (t = this.getEvent(t)).pageX + "," + t.pageY;
        this._navigate(this._getUrl() + "&mouse=" + t)
    }
    ,
    ths_stat.prototype.bindClick = function(e, i) {
        function t(t) {
            for (index in i)
                attr = i[index],
                r[attr] = e.getAttribute(attr);
            r._onClick(t)
        }
        var r = this;
        e.addEventListener ? e.addEventListener("click", t, !1) : e.attachEvent("onclick", t)
    }
    ,
    {
        log: function() {
            var t = new ths_stat;
            t.add.apply(t, arguments),
            t.log()
        },
        logClick: function() {
            var t = new ths_stat;
            t.add.apply(t, arguments),
            t.bindClick.call(t, window)
        },
        logArchorClick: function() {
            for (var t = new ths_stat, e = (t.add.apply(t, arguments),
            document.getElementsByTagName("a")), i = 0; i < e.length; ++i)
                t.bindClick.call(t, e[i], ["href"])
        },
        logElementClick: function(t, e) {
            var i = new ths_stat;
            i.add(e),
            i.bindClick.call(i, t)
        }
    });
    function hawkeyeInit() {
        for (var t = ["u_dpass", "u_did", "u_ttype", "u_ukey", "u_uver"], e = 0; e < t.length; e++)
            if (void 0 === getFromCookie(t[e])) {
                try {
                    window.TA && window.TA.log({
                        id: "upass_hawkeye_init",
                        ts: (new Date).getTime()
                    })
                } catch (t) {
                    console.log('发送"upass_hawkeye_init"埋点失败：' + t)
                }
                // hawkeyeMain();
                break
            }
    }
    function hawkeyeMain() {
        window.Fingerprint2.get(function(t) {
            var e = {}
              , t = (t.forEach(function(t) {
                e[t.key] = t.value
            }),
            generateKey())
              , i = CryptoJS.enc.Utf8.parse(t)
              , r = CryptoJS.enc.Utf8.parse(JSON.stringify(e))
              , n = CryptoJS.AES.encrypt(r, i, {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString();
            encryptSend(t, function(t) {
                ajaxFun({
                    method: "POST",
                    url: "https://hawkeye.10jqka.com.cn/v1/hawkeye/generate",
                    data: {
                        pass_code: getFromCookie("u_dpass") || "",
                        user_id: getFromCookie("userid") || null,
                        source_type: "web",
                        collections: t + "#" + n,
                        protocol: "fingerprint_1"
                    },
                    success: function(t) {
                        200 == t.code && (console.log("指纹信息签发成功"),
                        setDeviceCookie(t.data))
                    }
                })
            })
        })
    }
    function setDeviceCookie(t) {
        ajaxFun({
            method: "POST",
            url: "/common/setDeviceCookie",
            data: {
                u_dpass: t.pass_code,
                u_did: t.device_code,
                u_uver: "1.0.0",
                expires_time: t.expires_time
            },
            success: function(t) {
                try {
                    window.TA && window.TA.log({
                        id: "upass_hawkeye_getAuthCookie",
                        ts: (new Date).getTime()
                    })
                } catch (t) {
                    console.log('发送"upass_hawkeye_getAuthCookie"埋点失败：' + t)
                }
                console.log("指纹信息cookie签发", t)
            }
        })
    }
    function encryptSend(i, r) {
        ajaxFun({
            method: "get",
            url: "/common/getFingerprintRsaInfo",
            success: function(t) {
                if (0 == t.errorcode) {
                    try {
                        window.TA && window.TA.log({
                            id: "upass_hawkeye_getPUBLIC_KEY",
                            ts: (new Date).getTime()
                        })
                    } catch (t) {
                        console.log('发送"upass_hawkeye_getPUBLIC_KEY"埋点失败：' + t)
                    }
                    var t = t.pubkey
                      , e = new window.JSEncrypt
                      , t = (e.setPublicKey(t),
                    i = String(i),
                    e.encrypt(i));
                    r && r(t)
                } else
                    console.log("获取pubkey失败!")
            }
        })
    }
    function generateKey() {
        var t = "";
        for (let i = 0; i < 16; i++)
            t += "0123456789abcdef".charAt(Math.floor(16 * Math.random()));
        return t
    }
    function getFromCookie(t) {
        for (var e = t + "=", i = e.length, r = document.cookie.length, n = 0; n < r; ) {
            var o, s = n + i;
            if (document.cookie.substring(n, s) == e)
                return -1 == (o = document.cookie.indexOf(";", s)) && (o = document.cookie.length),
                unescape(document.cookie.substring(s, o));
            if (0 === (n = document.cookie.indexOf(" ", n) + 1))
                break
        }
    }
    function ajaxFun(e) {
        (e = e || {}).method = e.method.toUpperCase() || "POST",
        e.url = e.url || "",
        e.async = e.async || !0,
        e.data = e.data || null,
        e.success = e.success || function() {}
        ;
        var t, i = null, r = ((i = XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP")).timeout = 3e3,
        i.ontimeout = function() {
            try {
                window.TA && window.TA.log({
                    id: "upass_hawkeye_ajax_timeout",
                    ts: (new Date).getTime()
                })
            } catch (t) {
                console.log('发送"upass_hawkeye_ajax_timeout"埋点失败：' + t)
            }
            console.log("请求超时！")
        }
        ,
        []);
        for (t in e.data)
            r.push(encodeURIComponent(t) + "=" + encodeURIComponent(e.data[t]));
        var n = r.join("&");
        "POST" === e.method.toUpperCase() ? (i.open(e.method, e.url, e.async),
        i.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"),
        i.withCredentials = !0,
        i.send(n)) : "GET" === e.method.toUpperCase() && (i.open(e.method, e.url + "?" + n, e.async),
        i.send(null)),
        i.onreadystatechange = function() {
            var t;
            4 == i.readyState && (200 == i.status ? (t = JSON.parse(i.responseText),
            e.success(t)) : (setTimeout(function() {
                try {
                    window.TA && window.TA.log({
                        id: "upass_hawkeye_ajax_error",
                        ts: (new Date).getTime()
                    })
                } catch (t) {
                    console.log('发送"upass_hawkeye_ajax_error"埋点失败：' + t)
                }
            }, 1e3),
            console.log("Ajax请求异常")))
        }
    }
    hawkeyeInit();
// } catch (error) {
//     console.log(`upass通过指纹鉴权失败：${error}`);
// }
// console.log(window.CryptoJS.mode.ECB)

 e_string= '{"userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36","webdriver":false,"language":"zh-CN","colorDepth":24,"deviceMemory":8,"hardwareConcurrency":12,"screenResolution":[2560,1440],"availableScreenResolution":[2560,1400],"timezoneOffset":-480,"timezone":"Asia/Shanghai","sessionStorage":true,"localStorage":true,"indexedDb":true,"addBehavior":false,"openDatabase":false,"cpuClass":"not available","platform":"Win32","plugins":[["PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["Chrome PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["Chromium PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["Microsoft Edge PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["WebKit built-in PDF","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]]],"canvas":["canvas winding:yes","canvas fp:data:image/png;base64,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QIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHICAnrOzzQBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIFBEQ0Isc0hoECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgkBMQ0HN+pgkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgiICAXuSQ1iBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgACBnICAnvMzTYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQJFBAT0Ioe0BgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAjkBAT0nJ9pAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECgiIKAXOaQ1CBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQCAnIKDn/EwTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQBEBAb3IIa1BgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAjkBAT3nZ5oAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEiggI6EUOaQ0CBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQyAkI6Dk/0wQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBQREBAL3JIaxAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBATkBAz/mZJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIEiAgJ6kUNagwABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgRyAgJ6zs80AQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBQRENCLHNIaBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIJATENBzfqYJECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAoIiAgF7kkNYgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZyAgJ7zM02AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECRQQE9CKHtAYBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQI5AQE9JyfaQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoIiCgFzmkNQgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIEAgJyCg5/xMEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEARAQG9yCGtQYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQI5AQE952eaAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBIoICOhFDmkNAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIEMgJCOg5P9MECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUERAQC9ySGsQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQE5AQM/5mSZAgAABAgQIECBAgAABAgQIECBAgAABAgQILTju2AAAAqBJREFUECBAgACBIgICepFDWoMAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEcgICes7PNAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgUERDQixzSGgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCQExDQc36mCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCIgIBe5JDWIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIGcgICe8zNNgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAkUEBPQih7QGAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECOQEBPScn2kCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQKCIgoBc5pDUIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAICcgoOf8TBMgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBAEQEBvcghrUGAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECOQEBPednmgABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgSKCAjoRQ5pDQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBDICQjoOT/TBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFBEQEAvckhrECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEBOQEDP+ZkmQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHIC3wEmunhtjTKdlQAAAABJRU5ErkJggg=="],"webgl":["data:image/png;base64,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","extensions:ANGLE_instanced_arrays;EXT_blend_minmax;EXT_clip_control;EXT_color_buffer_half_float;EXT_depth_clamp;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_polygon_offset_clamp;EXT_shader_texture_lod;EXT_texture_compression_bptc;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_texture_mirror_clamp_to_edge;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_blend_func_extended;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw;WEBGL_polygon_mode","webgl aliased line width range:[1, 1]","webgl aliased point size range:[1, 1024]","webgl alpha bits:8","webgl antialiasing:yes","webgl blue bits:8","webgl depth bits:24","webgl green bits:8","webgl max anisotropy:16","webgl max combined texture image units:32","webgl max cube map texture size:16384","webgl max fragment uniform vectors:1024","webgl max render buffer size:16384","webgl max texture image units:16","webgl max texture size:16384","webgl max varying vectors:30","webgl max vertex attribs:16","webgl max vertex texture image units:16","webgl max vertex uniform vectors:4095","webgl max viewport dims:[32767, 32767]","webgl red bits:8","webgl renderer:WebKit WebGL","webgl shading language version:WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)","webgl stencil bits:0","webgl vendor:WebKit","webgl version:WebGL 1.0 (OpenGL ES 2.0 Chromium)","webgl unmasked vendor:Google Inc. (NVIDIA)","webgl unmasked renderer:ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)","webgl vertex shader high float precision:23","webgl vertex shader high float precision rangeMin:127","webgl vertex shader high float precision rangeMax:127","webgl vertex shader medium float precision:23","webgl vertex shader medium float precision rangeMin:127","webgl vertex shader medium float precision rangeMax:127","webgl vertex shader low float precision:23","webgl vertex shader low float precision rangeMin:127","webgl vertex shader low float precision rangeMax:127","webgl fragment shader high float precision:23","webgl fragment shader high float precision rangeMin:127","webgl fragment shader high float precision rangeMax:127","webgl fragment shader medium float precision:23","webgl fragment shader medium float precision rangeMin:127","webgl fragment shader medium float precision rangeMax:127","webgl fragment shader low float precision:23","webgl fragment shader low float precision rangeMin:127","webgl fragment shader low float precision rangeMax:127","webgl vertex shader high int precision:0","webgl vertex shader high int precision rangeMin:31","webgl vertex shader high int precision rangeMax:30","webgl vertex shader medium int precision:0","webgl vertex shader medium int precision rangeMin:31","webgl vertex shader medium int precision rangeMax:30","webgl vertex shader low int precision:0","webgl vertex shader low int precision rangeMin:31","webgl vertex shader low int precision rangeMax:30","webgl fragment shader high int precision:0","webgl fragment shader high int precision rangeMin:31","webgl fragment shader high int precision rangeMax:30","webgl fragment shader medium int precision:0","webgl fragment shader medium int precision rangeMin:31","webgl fragment shader medium int precision rangeMax:30","webgl fragment shader low int precision:0","webgl fragment shader low int precision rangeMin:31","webgl fragment shader low int precision rangeMax:30"],"webglVendorAndRenderer":"Google Inc. (NVIDIA)~ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)","adBlock":true,"hasLiedLanguages":false,"hasLiedResolution":false,"hasLiedOs":false,"hasLiedBrowser":false,"touchSupport":[1,false,false],"fonts":["Arial","Arial Black","Arial Narrow","Calibri","Cambria","Cambria Math","Comic Sans MS","Consolas","Courier","Courier New","Georgia","Helvetica","Impact","Lucida Console","Lucida Sans Unicode","Microsoft Sans Serif","MS Gothic","MS PGothic","MS Sans Serif","MS Serif","Palatino Linotype","Segoe Print","Segoe Script","Segoe UI","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Tahoma","Times","Times New Roman","Trebuchet MS","Verdana","Wingdings"],"audio":"124.04347527516074"}'
// "canvas fp:data:image/png;base64,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QIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHICAnrOzzQBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIFBEQ0Isc0hoECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgkBMQ0HN+pgkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgiICAXuSQ1iBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgACBnICAnvMzTYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQJFBAT0Ioe0BgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAjkBAT0nJ9pAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECgiIKAXOaQ1CBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQCAnIKDn/EwTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQBEBAb3IIa1BgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAjkBAT3nZ5oAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEiggI6EUOaQ0CBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQyAkI6Dk/0wQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBQREBAL3JIaxAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBATkBAz/mZJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIEiAgJ6kUNagwABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgRyAgJ6zs80AQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBQRENCLHNIaBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIJATENBzfqYJECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAoIiAgF7kkNYgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZyAgJ7zM02AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECRQQE9CKHtAYBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQI5AQE9JyfaQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoIiCgFzmkNQgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIEAgJyCg5/xMEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEARAQG9yCGtQYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQI5AQE952eaAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBIoICOhFDmkNAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIEMgJCOg5P9MECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUERAQC9ySGsQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQE5AQM/5mSZAgAABAgQIECBAgAABAgQIECBAgAABAgQILTju2AAAAqBJREFUECBAgACBIgICepFDWoMAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEcgICes7PNAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgUERDQixzSGgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCQExDQc36mCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCIgIBe5JDWIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIGcgICe8zNNgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAkUEBPQih7QGAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECOQEBPScn2kCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQKCIgoBc5pDUIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAICcgoOf8TBMgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBAEQEBvcghrUGAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECOQEBPednmgABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgSKCAjoRQ5pDQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBDICQjoOT/TBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFBEQEAvckhrECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEBOQEDP+ZkmQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHIC3wEmunhtjTKdlQAAAABJRU5ErkJggg=="
e_json=[{"key":"userAgent","value":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"},{"key":"webdriver","value":false},{"key":"language","value":"zh-CN"},{"key":"colorDepth","value":24},{"key":"deviceMemory","value":8},{"key":"hardwareConcurrency","value":12},{"key":"screenResolution","value":[2560,1440]},{"key":"availableScreenResolution","value":[2560,1400]},{"key":"timezoneOffset","value":-480},{"key":"timezone","value":"Asia/Shanghai"},{"key":"sessionStorage","value":true},{"key":"localStorage","value":true},{"key":"indexedDb","value":true},{"key":"addBehavior","value":false},{"key":"openDatabase","value":false},{"key":"cpuClass","value":"not available"},{"key":"platform","value":"Win32"},{"key":"plugins","value":[["PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["Chrome PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["Chromium PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["Microsoft Edge PDF Viewer","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]],["WebKit built-in PDF","Portable Document Format",[["application/pdf","pdf"],["text/pdf","pdf"]]]]},{"key":"canvas","value":["canvas winding:yes","canvas fp:data:image/png;base64,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QIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHICAnrOzzQBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIFBEQ0Isc0hoECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgkBMQ0HN+pgkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgiICAXuSQ1iBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgACBnICAnvMzTYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQJFBAT0Ioe0BgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAjkBAT0nJ9pAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECgiIKAXOaQ1CBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQCAnIKDn/EwTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQBEBAb3IIa1BgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAjkBAT3nZ5oAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEiggI6EUOaQ0CBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQyAkI6Dk/0wQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBQREBAL3JIaxAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBATkBAz/mZJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIEiAgJ6kUNagwABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgRyAgJ6zs80AQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBQRENCLHNIaBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIJATENBzfqYJECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAoIiAgF7kkNYgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZyAgJ7zM02AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECRQQE9CKHtAYBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQI5AQE9JyfaQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoIiCgFzmkNQgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIEAgJyCg5/xMEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEARAQG9yCGtQYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQI5AQE952eaAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBIoICOhFDmkNAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIEMgJCOg5P9MECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUERAQC9ySGsQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQE5AQM/5mSZAgAABAgQIECBAgAABAgQIECBAgAABAgQILTju2AAAAqBJREFUECBAgACBIgICepFDWoMAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEcgICes7PNAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgUERDQixzSGgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCQExDQc36mCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCIgIBe5JDWIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIGcgICe8zNNgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAkUEBPQih7QGAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECOQEBPScn2kCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQKCIgoBc5pDUIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAICcgoOf8TBMgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBAEQEBvcghrUGAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECOQEBPednmgABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgSKCAjoRQ5pDQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBDICQjoOT/TBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFBEQEAvckhrECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEBOQEDP+ZkmQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHIC3wEmunhtjTKdlQAAAABJRU5ErkJggg=="]},{"key":"webgl","value":["data:image/png;base64,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","extensions:ANGLE_instanced_arrays;EXT_blend_minmax;EXT_clip_control;EXT_color_buffer_half_float;EXT_depth_clamp;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_polygon_offset_clamp;EXT_shader_texture_lod;EXT_texture_compression_bptc;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_texture_mirror_clamp_to_edge;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_blend_func_extended;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw;WEBGL_polygon_mode","webgl aliased line width range:[1, 1]","webgl aliased point size range:[1, 1024]","webgl alpha bits:8","webgl antialiasing:yes","webgl blue bits:8","webgl depth bits:24","webgl green bits:8","webgl max anisotropy:16","webgl max combined texture image units:32","webgl max cube map texture size:16384","webgl max fragment uniform vectors:1024","webgl max render buffer size:16384","webgl max texture image units:16","webgl max texture size:16384","webgl max varying vectors:30","webgl max vertex attribs:16","webgl max vertex texture image units:16","webgl max vertex uniform vectors:4095","webgl max viewport dims:[32767, 32767]","webgl red bits:8","webgl renderer:WebKit WebGL","webgl shading language version:WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)","webgl stencil bits:0","webgl vendor:WebKit","webgl version:WebGL 1.0 (OpenGL ES 2.0 Chromium)","webgl unmasked vendor:Google Inc. (NVIDIA)","webgl unmasked renderer:ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)","webgl vertex shader high float precision:23","webgl vertex shader high float precision rangeMin:127","webgl vertex shader high float precision rangeMax:127","webgl vertex shader medium float precision:23","webgl vertex shader medium float precision rangeMin:127","webgl vertex shader medium float precision rangeMax:127","webgl vertex shader low float precision:23","webgl vertex shader low float precision rangeMin:127","webgl vertex shader low float precision rangeMax:127","webgl fragment shader high float precision:23","webgl fragment shader high float precision rangeMin:127","webgl fragment shader high float precision rangeMax:127","webgl fragment shader medium float precision:23","webgl fragment shader medium float precision rangeMin:127","webgl fragment shader medium float precision rangeMax:127","webgl fragment shader low float precision:23","webgl fragment shader low float precision rangeMin:127","webgl fragment shader low float precision rangeMax:127","webgl vertex shader high int precision:0","webgl vertex shader high int precision rangeMin:31","webgl vertex shader high int precision rangeMax:30","webgl vertex shader medium int precision:0","webgl vertex shader medium int precision rangeMin:31","webgl vertex shader medium int precision rangeMax:30","webgl vertex shader low int precision:0","webgl vertex shader low int precision rangeMin:31","webgl vertex shader low int precision rangeMax:30","webgl fragment shader high int precision:0","webgl fragment shader high int precision rangeMin:31","webgl fragment shader high int precision rangeMax:30","webgl fragment shader medium int precision:0","webgl fragment shader medium int precision rangeMin:31","webgl fragment shader medium int precision rangeMax:30","webgl fragment shader low int precision:0","webgl fragment shader low int precision rangeMin:31","webgl fragment shader low int precision rangeMax:30"]},{"key":"webglVendorAndRenderer","value":"Google Inc. (NVIDIA)~ANGLE (NVIDIA, NVIDIA GeForce RTX 3070 (0x00002484) Direct3D11 vs_5_0 ps_5_0, D3D11)"},{"key":"adBlock","value":true},{"key":"hasLiedLanguages","value":false},{"key":"hasLiedResolution","value":false},{"key":"hasLiedOs","value":false},{"key":"hasLiedBrowser","value":false},{"key":"touchSupport","value":[1,false,false]},{"key":"canvas","value":["canvas winding:yes","canvas fp:data:image/png;base64,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QIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHICAnrOzzQBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIFBEQ0Isc0hoECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgkBMQ0HN+pgkQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECgiICAXuSQ1iBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgACBnICAnvMzTYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQJFBAT0Ioe0BgECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAjkBAT0nJ9pAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECgiIKAXOaQ1CBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQCAnIKDn/EwTIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQBEBAb3IIa1BgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAjkBAT3nZ5oAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEiggI6EUOaQ0CBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQyAkI6Dk/0wQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBQREBAL3JIaxAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBATkBAz/mZJkCAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIEiAgJ6kUNagwABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgRyAgJ6zs80AQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBQRENCLHNIaBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIJATENBzfqYJECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAoIiAgF7kkNYgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgZyAgJ7zM02AAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECRQQE9CKHtAYBAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQI5AQE9JyfaQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoIiCgFzmkNQgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIEAgJyCg5/xMEyBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEARAQG9yCGtQYAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQI5AQE952eaAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBIoICOhFDmkNAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIEMgJCOg5P9MECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgUERAQC9ySGsQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAQE5AQM/5mSZAgAABAgQIECBAgAABAgQIECBAgAABAgQILTju2AAAAqBJREFUECBAgACBIgICepFDWoMAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIEcgICes7PNAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgUERDQixzSGgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCQExDQc36mCRAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQKCIgIBe5JDWIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAIGcgICe8zNNgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAkUEBPQih7QGAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECOQEBPScn2kCBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQKCIgoBc5pDUIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAICcgoOf8TBMgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIBAEQEBvcghrUGAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECOQEBPednmgABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgSKCAjoRQ5pDQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBDICQjoOT/TBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIFBEQEAvckhrECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgEBOQEDP+ZkmQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAgSICAnqRQ1qDAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBHIC3wEmunhtjTKdlQAAAABJRU5ErkJggg=="]},{"key":"fonts","value":["Arial","Arial Black","Arial Narrow","Calibri","Cambria","Cambria Math","Comic Sans MS","Consolas","Courier","Courier New","Georgia","Helvetica","Impact","Lucida Console","Lucida Sans Unicode","Microsoft Sans Serif","MS Gothic","MS PGothic","MS Sans Serif","MS Serif","Palatino Linotype","Segoe Print","Segoe Script","Segoe UI","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Tahoma","Times","Times New Roman","Trebuchet MS","Verdana","Wingdings"]}]

function get_collections(pubkey) {
    let e={},
    t = (e_json.forEach(function(e_json) {
                    e[e_json.key] = e_json.value
                }),
                generateKey())

    // console.log(t)
    let i = window.CryptoJS.enc.Utf8.parse(t)
    const r = window.CryptoJS.enc.Utf8.parse(e_string)
    const n = window.CryptoJS.AES.encrypt(r, i, {
                    mode: window.CryptoJS.mode.ECB,
                    padding: window.CryptoJS.pad.Pkcs7
                }).toString()
    var e_obj=new window.JSEncrypt
    const pubkey_result = (e_obj.setPublicKey(pubkey), i = String(t), e_obj.encrypt(i));
    console.log(pubkey_result)
    return pubkey_result + "#" + n
}




i='959c7e1e5f7d7641'
console.log(get_collections('-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxS7QTSCoGWPJxn+Ye1NNxwcXKKv4GnO8cWFB8lsHPJWNuHS3BoktZ24uboq0/IMK9kb/yxgyN5aBHrRkTBKOBWIkSN3kZ8GuK1tjiYxbnkWN66cR8KsWL4xM6WDdgnt4XBNHLIdT6c2O+23a+bQFpw2USuJpyDshRwofwQb4VcwIDAQAB-----END PUBLIC KEY-----'))
