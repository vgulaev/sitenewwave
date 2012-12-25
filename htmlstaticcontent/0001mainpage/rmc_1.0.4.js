/*
 * Copyright 2010 Russian Multimedia Company
 * $Date: 2010-11-12 15:25:52 +0500 (Fri, 12 Nov 2010) $
 */
(function(z, v) {
	function la() {
		if (!c.isReady) {
			try {
				r.documentElement.doScroll("left")
			} catch(a) {
				setTimeout(la, 1);
				return
			}
			c.ready()
		}
	}

	function Ma(a, b) {
		b.src ? c.ajax({
			url : b.src,
			async : false,
			dataType : "script"
		}) : c.globalEval(b.text || b.textContent || b.innerHTML || "");
		b.parentNode && b.parentNode.removeChild(b)
	}

	function X(a, b, d, f, e, i) {
		var j = a.length;
		if ( typeof b === "object") {
			for (var n in b)X(a, n, b[n], f, e, d);
			return a
		}
		if (d !== v) {
			f = !i && f && c.isFunction(d);
			for ( n = 0; n < j; n++)
				e(a[n], b, f ? d.call(a[n], n, e(a[n], b)) : d, i);
			return a
		}
		return j ? e(a[0], b) : null
	}

	function J() {
		return (new Date).getTime()
	}

	function Y() {
		return false
	}

	function Z() {
		return true
	}

	function ma(a, b, d) {
		d[0].type = a;
		return c.event.handle.apply(b, d)
	}

	function na(a) {
		var b, d = [], f = [], e = arguments, i, j, n, o, m, s, x = c.extend({}, c.data(this, "events").live);
		if (!(a.button && a.type === "click")) {
			for (o in x) {
				j = x[o];
				if (j.live === a.type || j.altLive && c.inArray(a.type, j.altLive) > -1) {
					i = j.data;
					i.beforeFilter && i.beforeFilter[a.type] && !i.beforeFilter[a.type](a) || f.push(j.selector)
				} else
					delete x[o]
			}
			i = c(a.target).closest(f, a.currentTarget);
			m = 0;
			for ( s = i.length; m < s; m++)
				for (o in x) {
					j = x[o];
					n = i[m].elem;
					f = null;
					if (i[m].selector === j.selector) {
						if (j.live === "mouseenter" || j.live === "mouseleave")
							f = c(a.relatedTarget).closest(j.selector)[0];
						if (!f || f !== n)
							d.push({
								elem : n,
								fn : j
							})
					}
				}
			m = 0;
			for ( s = d.length; m < s; m++) {
				i = d[m];
				a.currentTarget = i.elem;
				a.data = i.fn.data;
				if (i.fn.apply(i.elem, e) === false) {
					b = false;
					break
				}
			}
			return b
		}
	}

	function oa(a, b) {
		return "live." + ( a ? a + "." : "") + b.replace(/\./g, "`").replace(/ /g, "&")
	}

	function pa(a) {
		return !a || !a.parentNode || a.parentNode.nodeType === 11
	}

	function qa(a, b) {
		var d = 0;
		b.each(function() {
			if (this.nodeName === (a[d] && a[d].nodeName)) {
				var f = c.data(a[d++]), e = c.data(this, f);
				if ( f = f && f.events) {
					delete e.handle;
					e.events = {};
					for (var i in f)
					for (var j in f[i])
					c.event.add(this, i, f[i][j], f[i][j].data)
				}
			}
		})
	}

	function ra(a, b, d) {
		var f, e, i;
		if (a.length === 1 && typeof a[0] === "string" && a[0].length < 512 && a[0].indexOf("<option") < 0 && (c.support.checkClone || !sa.test(a[0]))) {
			e = true;
			if ( i = c.fragments[a[0]])
				if (i !== 1)
					f = i
		}
		if (!f) {
			b = b && b[0] ? b[0].ownerDocument || b[0] : r;
			f = b.createDocumentFragment();
			c.clean(a, b, f, d)
		}
		if (e)
			c.fragments[a[0]] = i ? f : 1;
		return {
			fragment : f,
			cacheable : e
		}
	}

	function K(a, b) {
		var d = {};
		c.each(ta.concat.apply([], ta.slice(0, b)), function() {
			d[this] = a
		});
		return d
	}

	function ua(a) {
		return "scrollTo" in a && a.document ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : false
	}

	var c = function(a, b) {
		return new c.fn.init(a, b)
	}, Na = z.jQuery, Oa = z.$, r = z.document, S, Pa = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/, Qa = /^.[^:#\[\.,]*$/, Ra = /\S/, Sa = /^(\s|\u00A0)+|(\s|\u00A0)+$/g, Ta = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, O = navigator.userAgent, va = false, P = [], L, $ = Object.prototype.toString, aa = Object.prototype.hasOwnProperty, ba = Array.prototype.push, Q = Array.prototype.slice, wa = Array.prototype.indexOf;
	c.fn = c.prototype = {
		init : function(a, b) {
			var d, f;
			if (!a)
				return this;
			if (a.nodeType) {
				this.context = this[0] = a;
				this.length = 1;
				return this
			}
			if ( typeof a === "string")
				if (( d = Pa.exec(a)) && (d[1] || !b))
					if (d[1]) {
						f = b ? b.ownerDocument || b : r;
						if ( a = Ta.exec(a))
							if (c.isPlainObject(b)) {
								a = [r.createElement(a[1])];
								c.fn.attr.call(a, b, true)
							} else
								a = [f.createElement(a[1])];
						else {
							a = ra([d[1]], [f]);
							a = (a.cacheable ? a.fragment.cloneNode(true) : a.fragment).childNodes
						}
					} else {
						if ( b = r.getElementById(d[2])) {
							if (b.id !== d[2])
								return S.find(a);
							this.length = 1;
							this[0] = b
						}
						this.context = r;
						this.selector = a;
						return this
					}
				else if (!b && /^\w+$/.test(a)) {
					this.selector = a;
					this.context = r;
					a = r.getElementsByTagName(a)
				} else
					return !b || b.jquery ? (b || S).find(a) : c(b).find(a);
			else if (c.isFunction(a))
				return S.ready(a);
			if (a.selector !== v) {
				this.selector = a.selector;
				this.context = a.context
			}
			return c.isArray(a) ? this.setArray(a) : c.makeArray(a, this)
		},
		selector : "",
		jquery : "1.4.1",
		length : 0,
		size : function() {
			return this.length
		},
		toArray : function() {
			return Q.call(this, 0)
		},
		get : function(a) {
			return a == null ? this.toArray() : a < 0 ? this.slice(a)[0] : this[a]
		},
		pushStack : function(a, b, d) {
			a = c(a || null);
			a.prevObject = this;
			a.context = this.context;
			if (b === "find")
				a.selector = this.selector + (this.selector ? " " : "") + d;
			else if (b)
				a.selector = this.selector + "." + b + "(" + d + ")";
			return a
		},
		setArray : function(a) {
			this.length = 0;
			ba.apply(this, a);
			return this
		},
		each : function(a, b) {
			return c.each(this, a, b)
		},
		ready : function(a) {
			c.bindReady();
			if (c.isReady)
				a.call(r, c);
			else
				P && P.push(a);
			return this
		},
		eq : function(a) {
			return a === -1 ? this.slice(a) : this.slice(a, +a + 1)
		},
		first : function() {
			return this.eq(0)
		},
		last : function() {
			return this.eq(-1)
		},
		slice : function() {
			return this.pushStack(Q.apply(this, arguments), "slice", Q.call(arguments).join(","))
		},
		map : function(a) {
			return this.pushStack(c.map(this, function(b, d) {
				return a.call(b, d, b)
			}))
		},
		end : function() {
			return this.prevObject || c(null)
		},
		push : ba,
		sort : [].sort,
		splice : [].splice
	};
	c.fn.init.prototype = c.fn;
	c.extend = c.fn.extend = function() {
		var a = arguments[0] || {}, b = 1, d = arguments.length, f = false, e, i, j, n;
		if ( typeof a === "boolean") {
			f = a;
			a = arguments[1] || {};
			b = 2
		}
		if ( typeof a !== "object" && !c.isFunction(a))
			a = {};
		if (d === b) {
			a = this;
			--b
		}
		for (; b < d; b++)
			if (( e = arguments[b]) != null)
				for (i in e) {
					j = a[i];
					n = e[i];
					if (a !== n)
						if (f && n && (c.isPlainObject(n) || c.isArray(n))) {
							j = j && (c.isPlainObject(j) || c.isArray(j)) ? j : c.isArray(n) ? [] : {};
							a[i] = c.extend(f, j, n)
						} else if (n !== v)
							a[i] = n
				}
		return a
	};
	c.extend({
		noConflict : function(a) {
			z.$ = Oa;
			if (a)
				z.jQuery = Na;
			return c
		},
		isReady : false,
		ready : function() {
			if (!c.isReady) {
				if (!r.body)
					return setTimeout(c.ready, 13);
				c.isReady = true;
				if (P) {
					for (var a, b = 0; a = P[b++]; )
						a.call(r, c);
					P = null
				}
				c.fn.triggerHandler && c(r).triggerHandler("ready")
			}
		},
		bindReady : function() {
			if (!va) {
				va = true;
				if (r.readyState === "complete")
					return c.ready();
				if (r.addEventListener) {
					r.addEventListener("DOMContentLoaded", L, false);
					z.addEventListener("load", c.ready, false)
				} else if (r.attachEvent) {
					r.attachEvent("onreadystatechange", L);
					z.attachEvent("onload", c.ready);
					var a = false;
					try {
						a = z.frameElement == null
					} catch(b) {
					}
					r.documentElement.doScroll && a && la()
				}
			}
		},
		isFunction : function(a) {
			return $.call(a) === "[object Function]"
		},
		isArray : function(a) {
			return $.call(a) === "[object Array]"
		},
		isPlainObject : function(a) {
			if (!a || $.call(a) !== "[object Object]" || a.nodeType || a.setInterval)
				return false;
			if (a.constructor && !aa.call(a, "constructor") && !aa.call(a.constructor.prototype, "isPrototypeOf"))
				return false;
			var b;
			for (b in a);
			return b === v || aa.call(a, b)
		},
		isEmptyObject : function(a) {
			for (var b in a)
			return false;
			return true
		},
		error : function(a) {
			throw a
		},
		parseJSON : function(a) {
			if ( typeof a !== "string" || !a)
				return null;
			if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
				return z.JSON && z.JSON.parse ? z.JSON.parse(a) : (new Function("return " + a))();
			else
				c.error("Invalid JSON: " + a)
		},
		noop : function() {
		},
		globalEval : function(a) {
			if (a && Ra.test(a)) {
				var b = r.getElementsByTagName("head")[0] || r.documentElement, d = r.createElement("script");
				d.type = "text/javascript";
				if (c.support.scriptEval)
					d.appendChild(r.createTextNode(a));
				else
					d.text = a;
				b.insertBefore(d, b.firstChild);
				b.removeChild(d)
			}
		},
		nodeName : function(a, b) {
			return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
		},
		each : function(a, b, d) {
			var f, e = 0, i = a.length, j = i === v || c.isFunction(a);
			if (d)
				if (j)
					for (f in a) {
						if (b.apply(a[f], d) === false)
							break
					}
				else
					for (; e < i; ) {
						if (b.apply(a[e++], d) === false)
							break
					}
			else if (j)
				for (f in a) {
					if (b.call(a[f], f, a[f]) === false)
						break
				}
			else
				for ( d = a[0]; e < i && b.call(d, e, d) !== false; d = a[++e]);
			return a
		},
		trim : function(a) {
			return (a || "").replace(Sa, "")
		},
		makeArray : function(a, b) {
			b = b || [];
			if (a != null)
				a.length == null || typeof a === "string" || c.isFunction(a) || typeof a !== "function" && a.setInterval ? ba.call(b, a) : c.merge(b, a);
			return b
		},
		inArray : function(a, b) {
			if (b.indexOf)
				return b.indexOf(a);
			for (var d = 0, f = b.length; d < f; d++)
				if (b[d] === a)
					return d;
			return -1
		},
		merge : function(a, b) {
			var d = a.length, f = 0;
			if ( typeof b.length === "number")
				for (var e = b.length; f < e; f++)
					a[d++] = b[f];
			else
				for (; b[f] !== v; )
					a[d++] = b[f++];
			a.length = d;
			return a
		},
		grep : function(a, b, d) {
			for (var f = [], e = 0, i = a.length; e < i; e++)
				!d !== !b(a[e], e) && f.push(a[e]);
			return f
		},
		map : function(a, b, d) {
			for (var f = [], e, i = 0, j = a.length; i < j; i++) {
				e = b(a[i], i, d);
				if (e != null)
					f[f.length] = e
			}
			return f.concat.apply([], f)
		},
		guid : 1,
		proxy : function(a, b, d) {
			if (arguments.length === 2)
				if ( typeof b === "string") {
					d = a;
					a = d[b];
					b = v
				} else if (b && !c.isFunction(b)) {
					d = b;
					b = v
				}
			if (!b && a)
				b = function() {
					return a.apply(d || this, arguments)
				};
			if (a)
				b.guid = a.guid = a.guid || b.guid || c.guid++;
			return b
		},
		uaMatch : function(a) {
			a = a.toLowerCase();
			a = /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || !/compatible/.test(a) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(a) || [];
			return {
				browser : a[1] || "",
				version : a[2] || "0"
			}
		},
		browser : {}
	});
	O = c.uaMatch(O);
	if (O.browser) {
		c.browser[O.browser] = true;
		c.browser.version = O.version
	}
	if (c.browser.webkit)
		c.browser.safari = true;
	if (wa)
		c.inArray = function(a, b) {
			return wa.call(b, a)
		};
	S = c(r);
	if (r.addEventListener)
		L = function() {
			r.removeEventListener("DOMContentLoaded", L, false);
			c.ready()
		};
	else if (r.attachEvent)
		L = function() {
			if (r.readyState === "complete") {
				r.detachEvent("onreadystatechange", L);
				c.ready()
			}
		};
	(function() {
		c.support = {};
		var a = r.documentElement, b = r.createElement("script"), d = r.createElement("div"), f = "script" + J();
		d.style.display = "none";
		d.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
		var e = d.getElementsByTagName("*"), i = d.getElementsByTagName("a")[0];
		if (!(!e || !e.length || !i)) {
			c.support = {
				leadingWhitespace : d.firstChild.nodeType === 3,
				tbody : !d.getElementsByTagName("tbody").length,
				htmlSerialize : !!d.getElementsByTagName("link").length,
				style : /red/.test(i.getAttribute("style")),
				hrefNormalized : i.getAttribute("href") === "/a",
				opacity : /^0.55$/.test(i.style.opacity),
				cssFloat : !!i.style.cssFloat,
				checkOn : d.getElementsByTagName("input")[0].value === "on",
				optSelected : r.createElement("select").appendChild(r.createElement("option")).selected,
				checkClone : false,
				scriptEval : false,
				noCloneEvent : true,
				boxModel : null
			};
			b.type = "text/javascript";
			try {
				b.appendChild(r.createTextNode("window." + f + "=1;"))
			} catch(j) {
			}
			a.insertBefore(b, a.firstChild);
			if (z[f]) {
				c.support.scriptEval = true;
				delete z[f]
			}
			a.removeChild(b);
			if (d.attachEvent && d.fireEvent) {
				d.attachEvent("onclick", function n() {
					c.support.noCloneEvent = false;
					d.detachEvent("onclick", n)
				});
				d.cloneNode(true).fireEvent("onclick")
			}
			d = r.createElement("div");
			d.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
			a = r.createDocumentFragment();
			a.appendChild(d.firstChild);
			c.support.checkClone = a.cloneNode(true).cloneNode(true).lastChild.checked;
			c(function() {
				var n = r.createElement("div");
				n.style.width = n.style.paddingLeft = "1px";
				r.body.appendChild(n);
				c.boxModel = c.support.boxModel = n.offsetWidth === 2;
				r.body.removeChild(n).style.display = "none"
			});
			a = function(n) {
				var o = r.createElement("div");
				n = "on" + n;
				var m = n in o;
				if (!m) {
					o.setAttribute(n, "return;");
					m = typeof o[n] === "function"
				}
				return m
			};
			c.support.submitBubbles = a("submit");
			c.support.changeBubbles = a("change");
			a = b = d = e = i = null
		}
	})();
	c.props = {
		"for" : "htmlFor",
		"class" : "className",
		readonly : "readOnly",
		maxlength : "maxLength",
		cellspacing : "cellSpacing",
		rowspan : "rowSpan",
		colspan : "colSpan",
		tabindex : "tabIndex",
		usemap : "useMap",
		frameborder : "frameBorder"
	};
	var G = "jQuery" + J(), Ua = 0, xa = {}, Va = {};
	c.extend({
		cache : {},
		expando : G,
		noData : {
			embed : true,
			object : true,
			applet : true
		},
		data : function(a, b, d) {
			if (!(a.nodeName && c.noData[a.nodeName.toLowerCase()])) {
				a = a == z ? xa : a;
				var f = a[G], e = c.cache;
				if (!b && !f)
					return null;
				f || ( f = ++Ua);
				if ( typeof b === "object") {
					a[G] = f;
					e = e[f] = c.extend(true, {}, b)
				} else
					e = e[f] ? e[f] : typeof d === "undefined" ? Va : (e[f] = {});
				if (d !== v) {
					a[G] = f;
					e[b] = d
				}
				return typeof b === "string" ? e[b] : e
			}
		},
		removeData : function(a, b) {
			if (!(a.nodeName && c.noData[a.nodeName.toLowerCase()])) {
				a = a == z ? xa : a;
				var d = a[G], f = c.cache, e = f[d];
				if (b) {
					if (e) {
						delete e[b];
						c.isEmptyObject(e) && c.removeData(a)
					}
				} else {
					try {
						delete a[G]
					} catch(i) {
						a.removeAttribute && a.removeAttribute(G)
					}
					delete f[d]
				}
			}
		}
	});
	c.fn.extend({
		data : function(a, b) {
			if ( typeof a === "undefined" && this.length)
				return c.data(this[0]);
			else if ( typeof a === "object")
				return this.each(function() {
					c.data(this, a)
				});
			var d = a.split(".");
			d[1] = d[1] ? "." + d[1] : "";
			if (b === v) {
				var f = this.triggerHandler("getData" + d[1] + "!", [d[0]]);
				if (f === v && this.length)
					f = c.data(this[0], a);
				return f === v && d[1] ? this.data(d[0]) : f
			} else
				return this.trigger("setData" + d[1] + "!", [d[0], b]).each(function() {
					c.data(this, a, b)
				})
		},
		removeData : function(a) {
			return this.each(function() {
				c.removeData(this, a)
			})
		}
	});
	c.extend({
		queue : function(a, b, d) {
			if (a) {
				b = (b || "fx") + "queue";
				var f = c.data(a, b);
				if (!d)
					return f || [];
				if (!f || c.isArray(d))
					f = c.data(a, b, c.makeArray(d));
				else
					f.push(d);
				return f
			}
		},
		dequeue : function(a, b) {
			b = b || "fx";
			var d = c.queue(a, b), f = d.shift();
			if (f === "inprogress")
				f = d.shift();
			if (f) {
				b === "fx" && d.unshift("inprogress");
				f.call(a, function() {
					c.dequeue(a, b)
				})
			}
		}
	});
	c.fn.extend({
		queue : function(a, b) {
			if ( typeof a !== "string") {
				b = a;
				a = "fx"
			}
			if (b === v)
				return c.queue(this[0], a);
			return this.each(function() {
				var d = c.queue(this, a, b);
				a === "fx" && d[0] !== "inprogress" && c.dequeue(this, a)
			})
		},
		dequeue : function(a) {
			return this.each(function() {
				c.dequeue(this, a)
			})
		},
		delay : function(a, b) {
			a = c.fx ? c.fx.speeds[a] || a : a;
			b = b || "fx";
			return this.queue(b, function() {
				var d = this;
				setTimeout(function() {
					c.dequeue(d, b)
				}, a)
			})
		},
		clearQueue : function(a) {
			return this.queue(a || "fx", [])
		}
	});
	var ya = /[\n\t]/g, ca = /\s+/, Wa = /\r/g, Xa = /href|src|style/, Ya = /(button|input)/i, Za = /(button|input|object|select|textarea)/i, $a = /^(a|area)$/i, za = /radio|checkbox/;
	c.fn.extend({
		attr : function(a, b) {
			return X(this, a, b, true, c.attr)
		},
		removeAttr : function(a) {
			return this.each(function() {
				c.attr(this, a, "");
				this.nodeType === 1 && this.removeAttribute(a)
			})
		},
		addClass : function(a) {
			if (c.isFunction(a))
				return this.each(function(o) {
					var m = c(this);
					m.addClass(a.call(this, o, m.attr("class")))
				});
			if (a && typeof a === "string")
				for (var b = (a || "").split(ca), d = 0, f = this.length; d < f; d++) {
					var e = this[d];
					if (e.nodeType === 1)
						if (e.className)
							for (var i = " " + e.className + " ", j = 0, n = b.length; j < n; j++) {
								if (i.indexOf(" " + b[j] + " ") < 0)
									e.className += " " + b[j]
							}
						else
							e.className = a
				}
			return this
		},
		removeClass : function(a) {
			if (c.isFunction(a))
				return this.each(function(o) {
					var m = c(this);
					m.removeClass(a.call(this, o, m.attr("class")))
				});
			if (a && typeof a === "string" || a === v)
				for (var b = (a || "").split(ca), d = 0, f = this.length; d < f; d++) {
					var e = this[d];
					if (e.nodeType === 1 && e.className)
						if (a) {
							for (var i = (" " + e.className + " ").replace(ya, " "), j = 0, n = b.length; j < n; j++)
								i = i.replace(" " + b[j] + " ", " ");
							e.className = i.substring(1, i.length - 1)
						} else
							e.className = ""
				}
			return this
		},
		toggleClass : function(a, b) {
			var d = typeof a, f = typeof b === "boolean";
			if (c.isFunction(a))
				return this.each(function(e) {
					var i = c(this);
					i.toggleClass(a.call(this, e, i.attr("class"), b), b)
				});
			return this.each(function() {
				if (d === "string")
					for (var e, i = 0, j = c(this), n = b, o = a.split(ca); e = o[i++]; ) {
						n = f ? n : !j.hasClass(e);
						j[n?"addClass":"removeClass"](e)
					}
				else if (d === "undefined" || d === "boolean") {
					this.className && c.data(this, "__className__", this.className);
					this.className = this.className || a === false ? "" : c.data(this, "__className__") || ""
				}
			})
		},
		hasClass : function(a) {
			a = " " + a + " ";
			for (var b = 0, d = this.length; b < d; b++)
				if ((" " + this[b].className + " ").replace(ya, " ").indexOf(a) > -1)
					return true;
			return false
		},
		val : function(a) {
			if (a === v) {
				var b = this[0];
				if (b) {
					if (c.nodeName(b, "option"))
						return (b.attributes.value || {}).specified ? b.value : b.text;
					if (c.nodeName(b, "select")) {
						var d = b.selectedIndex, f = [], e = b.options;
						b = b.type === "select-one";
						if (d < 0)
							return null;
						var i = b ? d : 0;
						for ( d = b ? d + 1 : e.length; i < d; i++) {
							var j = e[i];
							if (j.selected) {
								a = c(j).val();
								if (b)
									return a;
								f.push(a)
							}
						}
						return f
					}
					if (za.test(b.type) && !c.support.checkOn)
						return b.getAttribute("value") === null ? "on" : b.value;
					return (b.value || "").replace(Wa, "")
				}
				return v
			}
			var n = c.isFunction(a);
			return this.each(function(o) {
				var m = c(this), s = a;
				if (this.nodeType === 1) {
					if (n)
						s = a.call(this, o, m.val());
					if ( typeof s === "number")
						s += "";
					if (c.isArray(s) && za.test(this.type))
						this.checked = c.inArray(m.val(), s) >= 0;
					else if (c.nodeName(this, "select")) {
						var x = c.makeArray(s);
						c("option", this).each(function() {
							this.selected = c.inArray(c(this).val(), x) >= 0
						});
						if (!x.length)
							this.selectedIndex = -1
					} else
						this.value = s
				}
			})
		}
	});
	c.extend({
		attrFn : {
			val : true,
			css : true,
			html : true,
			text : true,
			data : true,
			width : true,
			height : true,
			offset : true
		},
		attr : function(a, b, d, f) {
			if (!a || a.nodeType === 3 || a.nodeType === 8)
				return v;
			if (f && b in c.attrFn)
				return c(a)[b](d);
			f = a.nodeType !== 1 || !c.isXMLDoc(a);
			var e = d !== v;
			b = f && c.props[b] || b;
			if (a.nodeType === 1) {
				var i = Xa.test(b);
				if ( b in a && f && !i) {
					if (e) {
						b === "type" && Ya.test(a.nodeName) && a.parentNode && c.error("type property can't be changed");
						a[b] = d
					}
					if (c.nodeName(a, "form") && a.getAttributeNode(b))
						return a.getAttributeNode(b).nodeValue;
					if (b === "tabIndex")
						return ( b = a.getAttributeNode("tabIndex")) && b.specified ? b.value : Za.test(a.nodeName) || $a.test(a.nodeName) && a.href ? 0 : v;
					return a[b]
				}
				if (!c.support.style && f && b === "style") {
					if (e)
						a.style.cssText = "" + d;
					return a.style.cssText
				}
				e && a.setAttribute(b, "" + d);
				a = !c.support.hrefNormalized && f && i ? a.getAttribute(b, 2) : a.getAttribute(b);
				return a === null ? v : a
			}
			return c.style(a, b, d)
		}
	});
	var ab = function(a) {
		return a.replace(/[^\w\s\.\|`]/g, function(b) {
			return "\\" + b
		})
	};
	c.event = {
		add : function(a, b, d, f) {
			if (!(a.nodeType === 3 || a.nodeType === 8)) {
				if (a.setInterval && a !== z && !a.frameElement)
					a = z;
				if (!d.guid)
					d.guid = c.guid++;
				if (f !== v) {
					d = c.proxy(d);
					d.data = f
				}
				var e = c.data(a, "events") || c.data(a, "events", {}), i = c.data(a, "handle"), j;
				if (!i) {
					j = function() {
						return typeof c !== "undefined" && !c.event.triggered ? c.event.handle.apply(j.elem, arguments) : v
					};
					i = c.data(a, "handle", j)
				}
				if (i) {
					i.elem = a;
					b = b.split(/\s+/);
					for (var n, o = 0; n = b[o++]; ) {
						var m = n.split(".");
						n = m.shift();
						if (o > 1) {
							d = c.proxy(d);
							if (f !== v)
								d.data = f
						}
						d.type = m.slice(0).sort().join(".");
						var s = e[n], x = this.special[n] || {};
						if (!s) {
							s = e[n] = {};
							if (!x.setup || x.setup.call(a, f, m, d) === false)
								if (a.addEventListener)
									a.addEventListener(n, i, false);
								else
									a.attachEvent && a.attachEvent("on" + n, i)
						}
						if (x.add)
							if (( m = x.add.call(a, d, f, m, s)) && c.isFunction(m)) {
								m.guid = m.guid || d.guid;
								m.data = m.data || d.data;
								m.type = m.type || d.type;
								d = m
							}
						s[d.guid] = d;
						this.global[n] = true
					}
					a = null
				}
			}
		},
		global : {},
		remove : function(a, b, d) {
			if (!(a.nodeType === 3 || a.nodeType === 8)) {
				var f = c.data(a, "events"), e, i, j;
				if (f) {
					if (b === v || typeof b === "string" && b.charAt(0) === ".")
						for (i in f)
						this.remove(a, i + (b || ""));
					else {
						if (b.type) {
							d = b.handler;
							b = b.type
						}
						b = b.split(/\s+/);
						for (var n = 0; i = b[n++]; ) {
							var o = i.split(".");
							i = o.shift();
							var m = !o.length, s = c.map(o.slice(0).sort(), ab);
							s = new RegExp("(^|\\.)" + s.join("\\.(?:.*\\.)?") + "(\\.|$)");
							var x = this.special[i] || {};
							if (f[i]) {
								if (d) {
									j = f[i][d.guid];
									delete f[i][d.guid]
								} else
									for (var A in f[i])
									if (m || s.test(f[i][A].type))
										delete f[i][A];
								x.remove && x.remove.call(a, o, j);
								for (e in f[i])
								break;
								if (!e) {
									if (!x.teardown || x.teardown.call(a, o) === false)
										if (a.removeEventListener)
											a.removeEventListener(i, c.data(a, "handle"), false);
										else
											a.detachEvent && a.detachEvent("on" + i, c.data(a, "handle"));
									e = null;
									delete f[i]
								}
							}
						}
					}
					for (e in f)
					break;
					if (!e) {
						if ( A = c.data(a, "handle"))
							A.elem = null;
						c.removeData(a, "events");
						c.removeData(a, "handle")
					}
				}
			}
		},
		trigger : function(a, b, d, f) {
			var e = a.type || a;
			if (!f) {
				a = typeof a === "object" ? a[G] ? a : c.extend(c.Event(e), a) : c.Event(e);
				if (e.indexOf("!") >= 0) {
					a.type = e = e.slice(0, -1);
					a.exclusive = true
				}
				if (!d) {
					a.stopPropagation();
					this.global[e] && c.each(c.cache, function() {
						this.events && this.events[e] && c.event.trigger(a, b, this.handle.elem)
					})
				}
				if (!d || d.nodeType === 3 || d.nodeType === 8)
					return v;
				a.result = v;
				a.target = d;
				b = c.makeArray(b);
				b.unshift(a)
			}
			a.currentTarget = d;
			( f = c.data(d, "handle")) && f.apply(d, b);
			f = d.parentNode || d.ownerDocument;
			try {
				if (!(d && d.nodeName && c.noData[d.nodeName.toLowerCase()]))
					if (d["on" + e] && d["on" + e].apply(d, b) === false)
						a.result = false
			} catch(i) {
			}
			if (!a.isPropagationStopped() && f)
				c.event.trigger(a, b, f, true);
			else if (!a.isDefaultPrevented()) {
				d = a.target;
				var j;
				if (!(c.nodeName(d, "a") && e === "click") && !(d && d.nodeName && c.noData[d.nodeName.toLowerCase()])) {
					try {
						if (d[e]) {
							if ( j = d["on" + e])
								d["on" + e] = null;
							this.triggered = true;
							d[e]()
						}
					} catch(n) {
					}
					if (j)
						d["on" + e] = j;
					this.triggered = false
				}
			}
		},
		handle : function(a) {
			var b, d;
			a = arguments[0] = c.event.fix(a || z.event);
			a.currentTarget = this;
			d = a.type.split(".");
			a.type = d.shift();
			b = !d.length && !a.exclusive;
			var f = new RegExp("(^|\\.)" + d.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
			d = (c.data(this,"events")||{})[a.type];
			for (var e in d) {
				var i = d[e];
				if (b || f.test(i.type)) {
					a.handler = i;
					a.data = i.data;
					i = i.apply(this, arguments);
					if (i !== v) {
						a.result = i;
						if (i === false) {
							a.preventDefault();
							a.stopPropagation()
						}
					}
					if (a.isImmediatePropagationStopped())
						break
				}
			}
			return a.result
		},
		props : "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
		fix : function(a) {
			if (a[G])
				return a;
			var b = a;
			a = c.Event(b);
			for (var d = this.props.length, f; d; ) {
				f = this.props[--d];
				a[f] = b[f]
			}
			if (!a.target)
				a.target = a.srcElement || r;
			if (a.target.nodeType === 3)
				a.target = a.target.parentNode;
			if (!a.relatedTarget && a.fromElement)
				a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement;
			if (a.pageX == null && a.clientX != null) {
				b = r.documentElement;
				d = r.body;
				a.pageX = a.clientX + (b && b.scrollLeft || d && d.scrollLeft || 0) - (b && b.clientLeft || d && d.clientLeft || 0);
				a.pageY = a.clientY + (b && b.scrollTop || d && d.scrollTop || 0) - (b && b.clientTop || d && d.clientTop || 0)
			}
			if (!a.which && (a.charCode || a.charCode === 0 ? a.charCode : a.keyCode))
				a.which = a.charCode || a.keyCode;
			if (!a.metaKey && a.ctrlKey)
				a.metaKey = a.ctrlKey;
			if (!a.which && a.button !== v)
				a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0;
			return a
		},
		guid : 1E8,
		proxy : c.proxy,
		special : {
			ready : {
				setup : c.bindReady,
				teardown : c.noop
			},
			live : {
				add : function(a, b) {
					c.extend(a, b || {});
					a.guid += b.selector + b.live;
					b.liveProxy = a;
					c.event.add(this, b.live, na, b)
				},
				remove : function(a) {
					if (a.length) {
						var b = 0, d = new RegExp("(^|\\.)" + a[0] + "(\\.|$)");
						c.each(c.data(this, "events").live || {}, function() {
							d.test(this.type) && b++
						});
						b < 1 && c.event.remove(this, a[0], na)
					}
				},
				special : {}
			},
			beforeunload : {
				setup : function(a, b, d) {
					if (this.setInterval)
						this.onbeforeunload = d;
					return false
				},
				teardown : function(a, b) {
					if (this.onbeforeunload === b)
						this.onbeforeunload = null
				}
			}
		}
	};
	c.Event = function(a) {
		if (!this.preventDefault)
			return new c.Event(a);
		if (a && a.type) {
			this.originalEvent = a;
			this.type = a.type
		} else
			this.type = a;
		this.timeStamp = J();
		this[G] = true
	};
	c.Event.prototype = {
		preventDefault : function() {
			this.isDefaultPrevented = Z;
			var a = this.originalEvent;
			if (a) {
				a.preventDefault && a.preventDefault();
				a.returnValue = false
			}
		},
		stopPropagation : function() {
			this.isPropagationStopped = Z;
			var a = this.originalEvent;
			if (a) {
				a.stopPropagation && a.stopPropagation();
				a.cancelBubble = true
			}
		},
		stopImmediatePropagation : function() {
			this.isImmediatePropagationStopped = Z;
			this.stopPropagation()
		},
		isDefaultPrevented : Y,
		isPropagationStopped : Y,
		isImmediatePropagationStopped : Y
	};
	var Aa = function(a) {
		for (var b = a.relatedTarget; b && b !== this; )
			try {
				b = b.parentNode
			} catch(d) {
				break
			}
		if (b !== this) {
			a.type = a.data;
			c.event.handle.apply(this, arguments)
		}
	}, Ba = function(a) {
		a.type = a.data;
		c.event.handle.apply(this, arguments)
	};
	c.each({
		mouseenter : "mouseover",
		mouseleave : "mouseout"
	}, function(a, b) {
		c.event.special[a] = {
			setup : function(d) {
				c.event.add(this, b, d && d.selector ? Ba : Aa, a)
			},
			teardown : function(d) {
				c.event.remove(this, b, d && d.selector ? Ba : Aa)
			}
		}
	});
	if (!c.support.submitBubbles)
		c.event.special.submit = {
			setup : function(a, b, d) {
				if (this.nodeName.toLowerCase() !== "form") {
					c.event.add(this, "click.specialSubmit." + d.guid, function(f) {
						var e = f.target, i = e.type;
						if ((i === "submit" || i === "image") && c(e).closest("form").length)
							return ma("submit", this, arguments)
					});
					c.event.add(this, "keypress.specialSubmit." + d.guid, function(f) {
						var e = f.target, i = e.type;
						if ((i === "text" || i === "password") && c(e).closest("form").length && f.keyCode === 13)
							return ma("submit", this, arguments)
					})
				} else
					return false
			},
			remove : function(a, b) {
				c.event.remove(this, "click.specialSubmit" + ( b ? "." + b.guid : ""));
				c.event.remove(this, "keypress.specialSubmit" + ( b ? "." + b.guid : ""))
			}
		};
	if (!c.support.changeBubbles) {
		var da = /textarea|input|select/i;
		function Ca(a) {
			var b = a.type, d = a.value;
			if (b === "radio" || b === "checkbox")
				d = a.checked;
			else if (b === "select-multiple")
				d = a.selectedIndex > -1 ? c.map(a.options, function(f) {
					return f.selected
				}).join("-") : "";
			else if (a.nodeName.toLowerCase() === "select")
				d = a.selectedIndex;
			return d
		}

		function ea(a, b) {
			var d = a.target, f, e;
			if (!(!da.test(d.nodeName) || d.readOnly)) {
				f = c.data(d, "_change_data");
				e = Ca(d);
				if (a.type !== "focusout" || d.type !== "radio")
					c.data(d, "_change_data", e);
				if (!(f === v || e === f))
					if (f != null || e) {
						a.type = "change";
						return c.event.trigger(a, b, d)
					}
			}
		}
		c.event.special.change = {
			filters : {
				focusout : ea,
				click : function(a) {
					var b = a.target, d = b.type;
					if (d === "radio" || d === "checkbox" || b.nodeName.toLowerCase() === "select")
						return ea.call(this, a)
				},
				keydown : function(a) {
					var b = a.target, d = b.type;
					if (a.keyCode === 13 && b.nodeName.toLowerCase() !== "textarea" || a.keyCode === 32 && (d === "checkbox" || d === "radio") || d === "select-multiple")
						return ea.call(this, a)
				},
				beforeactivate : function(a) {
					a = a.target;
					a.nodeName.toLowerCase() === "input" && a.type === "radio" && c.data(a, "_change_data", Ca(a))
				}
			},
			setup : function(a, b, d) {
				for (var f in T)
				c.event.add(this, f + ".specialChange." + d.guid, T[f]);
				return da.test(this.nodeName)
			},
			remove : function(a, b) {
				for (var d in T)
				c.event.remove(this, d + ".specialChange" + ( b ? "." + b.guid : ""), T[d]);
				return da.test(this.nodeName)
			}
		};
		var T = c.event.special.change.filters
	}
	r.addEventListener && c.each({
		focus : "focusin",
		blur : "focusout"
	}, function(a, b) {
		function d(f) {
			f = c.event.fix(f);
			f.type = b;
			return c.event.handle.call(this, f)
		}

		c.event.special[b] = {
			setup : function() {
				this.addEventListener(a, d, true)
			},
			teardown : function() {
				this.removeEventListener(a, d, true)
			}
		}
	});
	c.each(["bind", "one"], function(a, b) {
		c.fn[b] = function(d, f, e) {
			if ( typeof d === "object") {
				for (var i in d)this[b](i, f, d[i], e);
				return this
			}
			if (c.isFunction(f)) {
				e = f;
				f = v
			}
			var j = b === "one" ? c.proxy(e, function(n) {
				c(this).unbind(n, j);
				return e.apply(this, arguments)
			}) : e;
			return d === "unload" && b !== "one" ? this.one(d, f, e) : this.each(function() {
				c.event.add(this, d, j, f)
			})
		}
	});
	c.fn.extend({
		unbind : function(a, b) {
			if ( typeof a === "object" && !a.preventDefault) {
				for (var d in a)
				this.unbind(d, a[d]);
				return this
			}
			return this.each(function() {
				c.event.remove(this, a, b)
			})
		},
		trigger : function(a, b) {
			return this.each(function() {
				c.event.trigger(a, b, this)
			})
		},
		triggerHandler : function(a, b) {
			if (this[0]) {
				a = c.Event(a);
				a.preventDefault();
				a.stopPropagation();
				c.event.trigger(a, b, this[0]);
				return a.result
			}
		},
		toggle : function(a) {
			for (var b = arguments, d = 1; d < b.length; )
				c.proxy(a, b[d++]);
			return this.click(c.proxy(a, function(f) {
				var e = (c.data(this, "lastToggle" + a.guid) || 0) % d;
				c.data(this, "lastToggle" + a.guid, e + 1);
				f.preventDefault();
				return b[e].apply(this, arguments) || false
			}))
		},
		hover : function(a, b) {
			return this.mouseenter(a).mouseleave(b || a)
		}
	});
	c.each(["live", "die"], function(a, b) {
		c.fn[b] = function(d, f, e) {
			var i, j = 0;
			if (c.isFunction(f)) {
				e = f;
				f = v
			}
			for ( d = (d || "").split(/\s+/); ( i = d[j++]) != null; ) {
				i = i === "focus" ? "focusin" : i === "blur" ? "focusout" : i === "hover" ? d.push("mouseleave") && "mouseenter" : i;
				b === "live" ? c(this.context).bind(oa(i, this.selector), {
					data : f,
					selector : this.selector,
					live : i
				}, e) : c(this.context).unbind(oa(i, this.selector), e ? {
					guid : e.guid + this.selector + i
				} : null)
			}
			return this
		}
	});
	c.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "), function(a, b) {
		c.fn[b] = function(d) {
			return d ? this.bind(b, d) : this.trigger(b)
		};
		if (c.attrFn)
			c.attrFn[b] = true
	});
	z.attachEvent && !z.addEventListener && z.attachEvent("onunload", function() {
		for (var a in c.cache)
		if (c.cache[a].handle)
			try {
				c.event.remove(c.cache[a].handle.elem)
			} catch(b) {
			}
	});
	(function() {
		function a(g) {
			for (var h = "", k, l = 0; g[l]; l++) {
				k = g[l];
				if (k.nodeType === 3 || k.nodeType === 4)
					h += k.nodeValue;
				else if (k.nodeType !== 8)
					h += a(k.childNodes)
			}
			return h
		}

		function b(g, h, k, l, q, p) {
			q = 0;
			for (var u = l.length; q < u; q++) {
				var t = l[q];
				if (t) {
					t = t[g];
					for (var y = false; t; ) {
						if (t.sizcache === k) {
							y = l[t.sizset];
							break
						}
						if (t.nodeType === 1 && !p) {
							t.sizcache = k;
							t.sizset = q
						}
						if (t.nodeName.toLowerCase() === h) {
							y = t;
							break
						}
						t = t[g]
					}
					l[q] = y
				}
			}
		}

		function d(g, h, k, l, q, p) {
			q = 0;
			for (var u = l.length; q < u; q++) {
				var t = l[q];
				if (t) {
					t = t[g];
					for (var y = false; t; ) {
						if (t.sizcache === k) {
							y = l[t.sizset];
							break
						}
						if (t.nodeType === 1) {
							if (!p) {
								t.sizcache = k;
								t.sizset = q
							}
							if ( typeof h !== "string") {
								if (t === h) {
									y = true;
									break
								}
							} else if (o.filter(h, [t]).length > 0) {
								y = t;
								break
							}
						}
						t = t[g]
					}
					l[q] = y
				}
			}
		}

		var f = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, e = 0, i = Object.prototype.toString, j = false, n = true;
		[0, 0].sort(function() {
			n = false;
			return 0
		});
		var o = function(g, h, k, l) {
			k = k || [];
			var q = h = h || r;
			if (h.nodeType !== 1 && h.nodeType !== 9)
				return [];
			if (!g || typeof g !== "string")
				return k;
			for (var p = [], u, t, y, R, H = true, M = w(h), I = g; (f.exec(""), u = f.exec(I)) !== null; ) {
				I = u[3];
				p.push(u[1]);
				if (u[2]) {
					R = u[3];
					break
				}
			}
			if (p.length > 1 && s.exec(g))
				if (p.length === 2 && m.relative[p[0]])
					t = fa(p[0] + p[1], h);
				else
					for ( t = m.relative[p[0]] ? [h] : o(p.shift(), h); p.length; ) {
						g = p.shift();
						if (m.relative[g])
							g += p.shift();
						t = fa(g, t)
					}
			else {
				if (!l && p.length > 1 && h.nodeType === 9 && !M && m.match.ID.test(p[0]) && !m.match.ID.test(p[p.length - 1])) {
					u = o.find(p.shift(), h, M);
					h = u.expr ? o.filter(u.expr,u.set)[0] : u.set[0]
				}
				if (h) {
					u = l ? {
						expr : p.pop(),
						set : A(l)
					} : o.find(p.pop(), p.length === 1 && (p[0] === "~" || p[0] === "+") && h.parentNode ? h.parentNode : h, M);
					t = u.expr ? o.filter(u.expr, u.set) : u.set;
					if (p.length > 0)
						y = A(t);
					else
						H = false;
					for (; p.length; ) {
						var D = p.pop();
						u = D;
						if (m.relative[D])
							u = p.pop();
						else
							D = "";
						if (u == null)
							u = h;
						m.relative[D](y, u, M)
					}
				} else
					y = []
			}
			y || ( y = t);
			y || o.error(D || g);
			if (i.call(y) === "[object Array]")
				if (H)
					if (h && h.nodeType === 1)
						for ( g = 0; y[g] != null; g++) {
							if (y[g] && (y[g] === true || y[g].nodeType === 1 && E(h, y[g])))
								k.push(t[g])
						}
					else
						for ( g = 0; y[g] != null; g++)
							y[g] && y[g].nodeType === 1 && k.push(t[g]);
				else
					k.push.apply(k, y);
			else
				A(y, k);
			if (R) {
				o(R, q, k, l);
				o.uniqueSort(k)
			}
			return k
		};
		o.uniqueSort = function(g) {
			if (C) {
				j = n;
				g.sort(C);
				if (j)
					for (var h = 1; h < g.length; h++)
						g[h] === g[h - 1] && g.splice(h--, 1)
			}
			return g
		};
		o.matches = function(g, h) {
			return o(g, null, null, h)
		};
		o.find = function(g, h, k) {
			var l, q;
			if (!g)
				return [];
			for (var p = 0, u = m.order.length; p < u; p++) {
				var t = m.order[p];
				if ( q = m.leftMatch[t].exec(g)) {
					var y = q[1];
					q.splice(1, 1);
					if (y.substr(y.length - 1) !== "\\") {
						q[1] = (q[1] || "").replace(/\\/g, "");
						l = m.find[t](q, h, k);
						if (l != null) {
							g = g.replace(m.match[t], "");
							break
						}
					}
				}
			}
			l || ( l = h.getElementsByTagName("*"));
			return {
				set : l,
				expr : g
			}
		};
		o.filter = function(g, h, k, l) {
			for (var q = g, p = [], u = h, t, y, R = h && h[0] && w(h[0]); g && h.length; ) {
				for (var H in m.filter)
				if (( t = m.leftMatch[H].exec(g)) != null && t[2]) {
					var M = m.filter[H], I, D;
					D = t[1];
					y = false;
					t.splice(1, 1);
					if (D.substr(D.length - 1) !== "\\") {
						if (u === p)
							p = [];
						if (m.preFilter[H])
							if ( t = m.preFilter[H](t, u, k, p, l, R)) {
								if (t === true)
									continue
							} else
								y = I = true;
						if (t)
							for (var U = 0; ( D = u[U]) != null; U++)
								if (D) {
									I = M(D, t, U, u);
									var Da = l ^ !!I;
									if (k && I != null)
										if (Da)
											y = true;
										else
											u[U] = false;
									else if (Da) {
										p.push(D);
										y = true
									}
								}
						if (I !== v) {
							k || ( u = p);
							g = g.replace(m.match[H], "");
							if (!y)
								return [];
							break
						}
					}
				}
				if (g === q)
					if (y == null)
						o.error(g);
					else
						break;
				q = g
			}
			return u
		};
		o.error = function(g) {
			throw "Syntax error, unrecognized expression: " + g
		};
		var m = o.selectors = {
			order : ["ID", "NAME", "TAG"],
			match : {
				ID : /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
				CLASS : /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
				NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
				ATTR : /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
				TAG : /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
				CHILD : /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
				POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
				PSEUDO : /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
			},
			leftMatch : {},
			attrMap : {
				"class" : "className",
				"for" : "htmlFor"
			},
			attrHandle : {
				href : function(g) {
					return g.getAttribute("href")
				}
			},
			relative : {
				"+" : function(g, h) {
					var k = typeof h === "string", l = k && !/\W/.test(h);
					k = k && !l;
					if (l)
						h = h.toLowerCase();
					l = 0;
					for (var q = g.length, p; l < q; l++)
						if ( p = g[l]) {
							for (; ( p = p.previousSibling) && p.nodeType !== 1; );
							g[l] = k || p && p.nodeName.toLowerCase() === h ? p || false : p === h
						}
					k && o.filter(h, g, true)
				},
				">" : function(g, h) {
					var k = typeof h === "string";
					if (k && !/\W/.test(h)) {
						h = h.toLowerCase();
						for (var l = 0, q = g.length; l < q; l++) {
							var p = g[l];
							if (p) {
								k = p.parentNode;
								g[l] = k.nodeName.toLowerCase() === h ? k : false
							}
						}
					} else {
						l = 0;
						for ( q = g.length; l < q; l++)
							if ( p = g[l])
								g[l] = k ? p.parentNode : p.parentNode === h;
						k && o.filter(h, g, true)
					}
				},
				"" : function(g, h, k) {
					var l = e++, q = d;
					if ( typeof h === "string" && !/\W/.test(h)) {
						var p = h = h.toLowerCase();
						q = b
					}
					q("parentNode", h, l, g, p, k)
				},
				"~" : function(g, h, k) {
					var l = e++, q = d;
					if ( typeof h === "string" && !/\W/.test(h)) {
						var p = h = h.toLowerCase();
						q = b
					}
					q("previousSibling", h, l, g, p, k)
				}
			},
			find : {
				ID : function(g, h, k) {
					if ( typeof h.getElementById !== "undefined" && !k)
						return ( g = h.getElementById(g[1])) ? [g] : []
				},
				NAME : function(g, h) {
					if ( typeof h.getElementsByName !== "undefined") {
						var k = [];
						h = h.getElementsByName(g[1]);
						for (var l = 0, q = h.length; l < q; l++)
							h[l].getAttribute("name") === g[1] && k.push(h[l]);
						return k.length === 0 ? null : k
					}
				},
				TAG : function(g, h) {
					return h.getElementsByTagName(g[1])
				}
			},
			preFilter : {
				CLASS : function(g, h, k, l, q, p) {
					g = " " + g[1].replace(/\\/g, "") + " ";
					if (p)
						return g;
					p = 0;
					for (var u; ( u = h[p]) != null; p++)
						if (u)
							if (q ^ (u.className && (" " + u.className + " ").replace(/[\t\n]/g, " ").indexOf(g) >= 0))
								k || l.push(u);
							else if (k)
								h[p] = false;
					return false
				},
				ID : function(g) {
					return g[1].replace(/\\/g, "")
				},
				TAG : function(g) {
					return g[1].toLowerCase()
				},
				CHILD : function(g) {
					if (g[1] === "nth") {
						var h = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(g[2] === "even" && "2n" || g[2] === "odd" && "2n+1" || !/\D/.test(g[2]) && "0n+" + g[2] || g[2]);
						g[2] = h[1] + (h[2] || 1) - 0;
						g[3] = h[3] - 0
					}
					g[0] = e++;
					return g
				},
				ATTR : function(g, h, k, l, q, p) {
					h = g[1].replace(/\\/g, "");
					if (!p && m.attrMap[h])
						g[1] = m.attrMap[h];
					if (g[2] === "~=")
						g[4] = " " + g[4] + " ";
					return g
				},
				PSEUDO : function(g, h, k, l, q) {
					if (g[1] === "not")
						if ((f.exec(g[3]) || "").length > 1 || /^\w/.test(g[3]))
							g[3] = o(g[3], null, null, h);
						else {
							g = o.filter(g[3], h, k, true ^ q);
							k || l.push.apply(l, g);
							return false
						}
					else if (m.match.POS.test(g[0]) || m.match.CHILD.test(g[0]))
						return true;
					return g
				},
				POS : function(g) {
					g.unshift(true);
					return g
				}
			},
			filters : {
				enabled : function(g) {
					return g.disabled === false && g.type !== "hidden"
				},
				disabled : function(g) {
					return g.disabled === true
				},
				checked : function(g) {
					return g.checked === true
				},
				selected : function(g) {
					return g.selected === true
				},
				parent : function(g) {
					return !!g.firstChild
				},
				empty : function(g) {
					return !g.firstChild
				},
				has : function(g, h, k) {
					return !!o(k[3], g).length
				},
				header : function(g) {
					return /h\d/i.test(g.nodeName)
				},
				text : function(g) {
					return "text" === g.type
				},
				radio : function(g) {
					return "radio" === g.type
				},
				checkbox : function(g) {
					return "checkbox" === g.type
				},
				file : function(g) {
					return "file" === g.type
				},
				password : function(g) {
					return "password" === g.type
				},
				submit : function(g) {
					return "submit" === g.type
				},
				image : function(g) {
					return "image" === g.type
				},
				reset : function(g) {
					return "reset" === g.type
				},
				button : function(g) {
					return "button" === g.type || g.nodeName.toLowerCase() === "button"
				},
				input : function(g) {
					return /input|select|textarea|button/i.test(g.nodeName)
				}
			},
			setFilters : {
				first : function(g, h) {
					return h === 0
				},
				last : function(g, h, k, l) {
					return h === l.length - 1
				},
				even : function(g, h) {
					return h % 2 === 0
				},
				odd : function(g, h) {
					return h % 2 === 1
				},
				lt : function(g, h, k) {
					return h < k[3] - 0
				},
				gt : function(g, h, k) {
					return h > k[3] - 0
				},
				nth : function(g, h, k) {
					return k[3] - 0 === h
				},
				eq : function(g, h, k) {
					return k[3] - 0 === h
				}
			},
			filter : {
				PSEUDO : function(g, h, k, l) {
					var q = h[1], p = m.filters[q];
					if (p)
						return p(g, k, h, l);
					else if (q === "contains")
						return (g.textContent || g.innerText || a([g]) || "").indexOf(h[3]) >= 0;
					else if (q === "not") {
						h = h[3];
						k = 0;
						for ( l = h.length; k < l; k++)
							if (h[k] === g)
								return false;
						return true
					} else
						o.error("Syntax error, unrecognized expression: " + q)
				},
				CHILD : function(g, h) {
					var k = h[1], l = g;
					switch(k) {
						case"only":
						case"first":
							for (; l = l.previousSibling; )
								if (l.nodeType === 1)
									return false;
							if (k === "first")
								return true;
							l = g;
						case"last":
							for (; l = l.nextSibling; )
								if (l.nodeType === 1)
									return false;
							return true;
						case"nth":
							k = h[2];
							var q = h[3];
							if (k === 1 && q === 0)
								return true;
							h = h[0];
							var p = g.parentNode;
							if (p && (p.sizcache !== h || !g.nodeIndex)) {
								var u = 0;
								for ( l = p.firstChild; l; l = l.nextSibling)
									if (l.nodeType === 1)
										l.nodeIndex = ++u;
								p.sizcache = h
							}
							g = g.nodeIndex - q;
							return k === 0 ? g === 0 : g % k === 0 && g / k >= 0
					}
				},
				ID : function(g, h) {
					return g.nodeType === 1 && g.getAttribute("id") === h
				},
				TAG : function(g, h) {
					return h === "*" && g.nodeType === 1 || g.nodeName.toLowerCase() === h
				},
				CLASS : function(g, h) {
					return (" " + (g.className || g.getAttribute("class")) + " ").indexOf(h) > -1
				},
				ATTR : function(g, h) {
					var k = h[1];
					g = m.attrHandle[k] ? m.attrHandle[k](g) : g[k] != null ? g[k] : g.getAttribute(k);
					k = g + "";
					var l = h[2];
					h = h[4];
					return g == null ? l === "!=" : l === "=" ? k === h : l === "*=" ? k.indexOf(h) >= 0 : l === "~=" ? (" " + k + " ").indexOf(h) >= 0 : !h ? k && g !== false : l === "!=" ? k !== h : l === "^=" ? k.indexOf(h) === 0 : l === "$=" ? k.substr(k.length - h.length) === h : l === "|=" ? k === h || k.substr(0, h.length + 1) === h + "-" : false
				},
				POS : function(g, h, k, l) {
					var q = m.setFilters[h[2]];
					if (q)
						return q(g, k, h, l)
				}
			}
		}, s = m.match.POS;
		for (var x in m.match) {
			m.match[x] = new RegExp(m.match[x].source + /(?![^\[]*\])(?![^\(]*\))/.source);
			m.leftMatch[x] = new RegExp(/(^(?:.|\r|\n)*?)/.source + m.match[x].source.replace(/\\(\d+)/g, function(g, h) {
				return "\\" + (h - 0 + 1)
			}))
		}
		var A = function(g, h) {
			g = Array.prototype.slice.call(g, 0);
			if (h) {
				h.push.apply(h, g);
				return h
			}
			return g
		};
		try {
			Array.prototype.slice.call(r.documentElement.childNodes, 0)
		} catch(B) {
			A = function(g, h) {
				h = h || [];
				if (i.call(g) === "[object Array]")
					Array.prototype.push.apply(h, g);
				else if ( typeof g.length === "number")
					for (var k = 0, l = g.length; k < l; k++)
						h.push(g[k]);
				else
					for ( k = 0; g[k]; k++)
						h.push(g[k]);
				return h
			}
		}
		var C;
		if (r.documentElement.compareDocumentPosition)
			C = function(g, h) {
				if (!g.compareDocumentPosition || !h.compareDocumentPosition) {
					if (g == h)
						j = true;
					return g.compareDocumentPosition ? -1 : 1
				}
				g = g.compareDocumentPosition(h) & 4 ? -1 : g === h ? 0 : 1;
				if (g === 0)
					j = true;
				return g
			};
		else if ("sourceIndex" in r.documentElement)
			C = function(g, h) {
				if (!g.sourceIndex || !h.sourceIndex) {
					if (g == h)
						j = true;
					return g.sourceIndex ? -1 : 1
				}
				g = g.sourceIndex - h.sourceIndex;
				if (g === 0)
					j = true;
				return g
			};
		else if (r.createRange)
			C = function(g, h) {
				if (!g.ownerDocument || !h.ownerDocument) {
					if (g == h)
						j = true;
					return g.ownerDocument ? -1 : 1
				}
				var k = g.ownerDocument.createRange(), l = h.ownerDocument.createRange();
				k.setStart(g, 0);
				k.setEnd(g, 0);
				l.setStart(h, 0);
				l.setEnd(h, 0);
				g = k.compareBoundaryPoints(Range.START_TO_END, l);
				if (g === 0)
					j = true;
				return g
			};
		(function() {
			var g = r.createElement("div"), h = "script" + (new Date).getTime();
			g.innerHTML = "<a name='" + h + "'/>";
			var k = r.documentElement;
			k.insertBefore(g, k.firstChild);
			if (r.getElementById(h)) {
				m.find.ID = function(l, q, p) {
					if ( typeof q.getElementById !== "undefined" && !p)
						return ( q = q.getElementById(l[1])) ? q.id === l[1] || typeof q.getAttributeNode !== "undefined" && q.getAttributeNode("id").nodeValue === l[1] ? [q] : v : []
				};
				m.filter.ID = function(l, q) {
					var p = typeof l.getAttributeNode !== "undefined" && l.getAttributeNode("id");
					return l.nodeType === 1 && p && p.nodeValue === q
				}
			}
			k.removeChild(g);
			k = g = null
		})();
		(function() {
			var g = r.createElement("div");
			g.appendChild(r.createComment(""));
			if (g.getElementsByTagName("*").length > 0)
				m.find.TAG = function(h, k) {
					k = k.getElementsByTagName(h[1]);
					if (h[1] === "*") {
						h = [];
						for (var l = 0; k[l]; l++)
							k[l].nodeType === 1 && h.push(k[l]);
						k = h
					}
					return k
				};
			g.innerHTML = "<a href='#'></a>";
			if (g.firstChild && typeof g.firstChild.getAttribute !== "undefined" && g.firstChild.getAttribute("href") !== "#")
				m.attrHandle.href = function(h) {
					return h.getAttribute("href", 2)
				};
			g = null
		})();
		r.querySelectorAll && function() {
			var g = o, h = r.createElement("div");
			h.innerHTML = "<p class='TEST'></p>";
			if (!(h.querySelectorAll && h.querySelectorAll(".TEST").length === 0)) {
				o = function(l, q, p, u) {
					q = q || r;
					if (!u && q.nodeType === 9 && !w(q))
						try {
							return A(q.querySelectorAll(l), p)
						} catch(t) {
						}
					return g(l, q, p, u)
				};
				for (var k in g)
				o[k] = g[k];
				h = null
			}
		}();
		(function() {
			var g = r.createElement("div");
			g.innerHTML = "<div class='test e'></div><div class='test'></div>";
			if (!(!g.getElementsByClassName || g.getElementsByClassName("e").length === 0)) {
				g.lastChild.className = "e";
				if (g.getElementsByClassName("e").length !== 1) {
					m.order.splice(1, 0, "CLASS");
					m.find.CLASS = function(h, k, l) {
						if ( typeof k.getElementsByClassName !== "undefined" && !l)
							return k.getElementsByClassName(h[1])
					};
					g = null
				}
			}
		})();
		var E = r.compareDocumentPosition ? function(g, h) {
			return g.compareDocumentPosition(h) & 16
		} : function(g, h) {
			return g !== h && (g.contains ? g.contains(h) : true)
		}, w = function(g) {
			return ( g = ( g ? g.ownerDocument || g : 0).documentElement) ? g.nodeName !== "HTML" : false
		}, fa = function(g, h) {
			var k = [], l = "", q;
			for ( h = h.nodeType ? [h] : h; q = m.match.PSEUDO.exec(g); ) {
				l += q[0];
				g = g.replace(m.match.PSEUDO, "")
			}
			g = m.relative[g] ? g + "*" : g;
			q = 0;
			for (var p = h.length; q < p; q++)
				o(g, h[q], k);
			return o.filter(l, k)
		};
		c.find = o;
		c.expr = o.selectors;
		c.expr[":"] = c.expr.filters;
		c.unique = o.uniqueSort;
		c.getText = a;
		c.isXMLDoc = w;
		c.contains = E
	})();
	var bb = /Until$/, cb = /^(?:parents|prevUntil|prevAll)/, db = /,/;
	Q = Array.prototype.slice;
	var Ea = function(a, b, d) {
		if (c.isFunction(b))
			return c.grep(a, function(e, i) {
				return !!b.call(e, i, e) === d
			});
		else if (b.nodeType)
			return c.grep(a, function(e) {
				return e === b === d
			});
		else if ( typeof b === "string") {
			var f = c.grep(a, function(e) {
				return e.nodeType === 1
			});
			if (Qa.test(b))
				return c.filter(b, f, !d);
			else
				b = c.filter(b, f)
		}
		return c.grep(a, function(e) {
			return c.inArray(e, b) >= 0 === d
		})
	};
	c.fn.extend({
		find : function(a) {
			for (var b = this.pushStack("", "find", a), d = 0, f = 0, e = this.length; f < e; f++) {
				d = b.length;
				c.find(a, this[f], b);
				if (f > 0)
					for (var i = d; i < b.length; i++)
						for (var j = 0; j < d; j++)
							if (b[j] === b[i]) {
								b.splice(i--, 1);
								break
							}
			}
			return b
		},
		has : function(a) {
			var b = c(a);
			return this.filter(function() {
				for (var d = 0, f = b.length; d < f; d++)
					if (c.contains(this, b[d]))
						return true
			})
		},
		not : function(a) {
			return this.pushStack(Ea(this, a, false), "not", a)
		},
		filter : function(a) {
			return this.pushStack(Ea(this, a, true), "filter", a)
		},
		is : function(a) {
			return !!a && c.filter(a, this).length > 0
		},
		closest : function(a, b) {
			if (c.isArray(a)) {
				var d = [], f = this[0], e, i = {}, j;
				if (f && a.length) {
					e = 0;
					for (var n = a.length; e < n; e++) {
						j = a[e];
						i[j] || (i[j] = c.expr.match.POS.test(j) ? c(j, b || this.context) : j)
					}
					for (; f && f.ownerDocument && f !== b; ) {
						for (j in i) {
							e = i[j];
							if (e.jquery ? e.index(f) > -1 : c(f).is(e)) {
								d.push({
									selector : j,
									elem : f
								});
								delete i[j]
							}
						}
						f = f.parentNode
					}
				}
				return d
			}
			var o = c.expr.match.POS.test(a) ? c(a, b || this.context) : null;
			return this.map(function(m, s) {
				for (; s && s.ownerDocument && s !== b; ) {
					if ( o ? o.index(s) > -1 : c(s).is(a))
						return s;
					s = s.parentNode
				}
				return null
			})
		},
		index : function(a) {
			if (!a || typeof a === "string")
				return c.inArray(this[0], a ? c(a) : this.parent().children());
			return c.inArray(a.jquery ? a[0] : a, this)
		},
		add : function(a, b) {
			a = typeof a === "string" ? c(a, b || this.context) : c.makeArray(a);
			b = c.merge(this.get(), a);
			return this.pushStack(pa(a[0]) || pa(b[0]) ? b : c.unique(b))
		},
		andSelf : function() {
			return this.add(this.prevObject)
		}
	});
	c.each({
		parent : function(a) {
			return ( a = a.parentNode) && a.nodeType !== 11 ? a : null
		},
		parents : function(a) {
			return c.dir(a, "parentNode")
		},
		parentsUntil : function(a, b, d) {
			return c.dir(a, "parentNode", d)
		},
		next : function(a) {
			return c.nth(a, 2, "nextSibling")
		},
		prev : function(a) {
			return c.nth(a, 2, "previousSibling")
		},
		nextAll : function(a) {
			return c.dir(a, "nextSibling")
		},
		prevAll : function(a) {
			return c.dir(a, "previousSibling")
		},
		nextUntil : function(a, b, d) {
			return c.dir(a, "nextSibling", d)
		},
		prevUntil : function(a, b, d) {
			return c.dir(a, "previousSibling", d)
		},
		siblings : function(a) {
			return c.sibling(a.parentNode.firstChild, a)
		},
		children : function(a) {
			return c.sibling(a.firstChild)
		},
		contents : function(a) {
			return c.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : c.makeArray(a.childNodes)
		}
	}, function(a, b) {
		c.fn[a] = function(d, f) {
			var e = c.map(this, b, d);
			bb.test(a) || ( f = d);
			if (f && typeof f === "string")
				e = c.filter(f, e);
			e = this.length > 1 ? c.unique(e) : e;
			if ((this.length > 1 || db.test(f)) && cb.test(a))
				e = e.reverse();
			return this.pushStack(e, a, Q.call(arguments).join(","))
		}
	});
	c.extend({
		filter : function(a, b, d) {
			if (d)
				a = ":not(" + a + ")";
			return c.find.matches(a, b)
		},
		dir : function(a, b, d) {
			var f = [];
			for ( a = a[b]; a && a.nodeType !== 9 && (d === v || a.nodeType !== 1 || !c(a).is(d)); ) {
				a.nodeType === 1 && f.push(a);
				a = a[b]
			}
			return f
		},
		nth : function(a, b, d) {
			b = b || 1;
			for (var f = 0; a; a = a[d])
				if (a.nodeType === 1 && ++f === b)
					break;
			return a
		},
		sibling : function(a, b) {
			for (var d = []; a; a = a.nextSibling)
				a.nodeType === 1 && a !== b && d.push(a);
			return d
		}
	});
	var Fa = / jQuery\d+="(?:\d+|null)"/g, V = /^\s+/, Ga = /(<([\w:]+)[^>]*?)\/>/g, eb = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i, Ha = /<([\w:]+)/, fb = /<tbody/i, gb = /<|&\w+;/, sa = /checked\s*(?:[^=]|=\s*.checked.)/i, Ia = function(a, b, d) {
		return eb.test(d) ? a : b + "></" + d + ">"
	}, F = {
		option : [1, "<select multiple='multiple'>", "</select>"],
		legend : [1, "<fieldset>", "</fieldset>"],
		thead : [1, "<table>", "</table>"],
		tr : [2, "<table><tbody>", "</tbody></table>"],
		td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		area : [1, "<map>", "</map>"],
		_default : [0, "", ""]
	};
	F.optgroup = F.option;
	F.tbody = F.tfoot = F.colgroup = F.caption = F.thead;
	F.th = F.td;
	if (!c.support.htmlSerialize)
		F._default = [1, "div<div>", "</div>"];
	c.fn.extend({
		text : function(a) {
			if (c.isFunction(a))
				return this.each(function(b) {
					var d = c(this);
					d.text(a.call(this, b, d.text()))
				});
			if ( typeof a !== "object" && a !== v)
				return this.empty().append((this[0] && this[0].ownerDocument || r).createTextNode(a));
			return c.getText(this)
		},
		wrapAll : function(a) {
			if (c.isFunction(a))
				return this.each(function(d) {
					c(this).wrapAll(a.call(this, d))
				});
			if (this[0]) {
				var b = c(a, this[0].ownerDocument).eq(0).clone(true);
				this[0].parentNode && b.insertBefore(this[0]);
				b.map(function() {
					for (var d = this; d.firstChild && d.firstChild.nodeType === 1; )
						d = d.firstChild;
					return d
				}).append(this)
			}
			return this
		},
		wrapInner : function(a) {
			if (c.isFunction(a))
				return this.each(function(b) {
					c(this).wrapInner(a.call(this, b))
				});
			return this.each(function() {
				var b = c(this), d = b.contents();
				d.length ? d.wrapAll(a) : b.append(a)
			})
		},
		wrap : function(a) {
			return this.each(function() {
				c(this).wrapAll(a)
			})
		},
		unwrap : function() {
			return this.parent().each(function() {
				c.nodeName(this, "body") || c(this).replaceWith(this.childNodes)
			}).end()
		},
		append : function() {
			return this.domManip(arguments, true, function(a) {
				this.nodeType === 1 && this.appendChild(a)
			})
		},
		prepend : function() {
			return this.domManip(arguments, true, function(a) {
				this.nodeType === 1 && this.insertBefore(a, this.firstChild)
			})
		},
		before : function() {
			if (this[0] && this[0].parentNode)
				return this.domManip(arguments, false, function(b) {
					this.parentNode.insertBefore(b, this)
				});
			else if (arguments.length) {
				var a = c(arguments[0]);
				a.push.apply(a, this.toArray());
				return this.pushStack(a, "before", arguments)
			}
		},
		after : function() {
			if (this[0] && this[0].parentNode)
				return this.domManip(arguments, false, function(b) {
					this.parentNode.insertBefore(b, this.nextSibling)
				});
			else if (arguments.length) {
				var a = this.pushStack(this, "after", arguments);
				a.push.apply(a, c(arguments[0]).toArray());
				return a
			}
		},
		clone : function(a) {
			var b = this.map(function() {
				if (!c.support.noCloneEvent && !c.isXMLDoc(this)) {
					var d = this.outerHTML, f = this.ownerDocument;
					if (!d) {
						d = f.createElement("div");
						d.appendChild(this.cloneNode(true));
						d = d.innerHTML
					}
					return c.clean([d.replace(Fa,"").replace(V,"")],f)[0]
				} else
					return this.cloneNode(true)
			});
			if (a === true) {
				qa(this, b);
				qa(this.find("*"), b.find("*"))
			}
			return b
		},
		html : function(a) {
			if (a === v)
				return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(Fa, "") : null;
			else if ( typeof a === "string" && !/<script/i.test(a) && (c.support.leadingWhitespace || !V.test(a)) && !F[(Ha.exec(a)||["",""])[1].toLowerCase()]) {
				a = a.replace(Ga, Ia);
				try {
					for (var b = 0, d = this.length; b < d; b++)
						if (this[b].nodeType === 1) {
							c.cleanData(this[b].getElementsByTagName("*"));
							this[b].innerHTML = a
						}
				} catch(f) {
					this.empty().append(a)
				}
			} else
				c.isFunction(a) ? this.each(function(e) {
					var i = c(this), j = i.html();
					i.empty().append(function() {
						return a.call(this, e, j)
					})
				}) : this.empty().append(a);
			return this
		},
		replaceWith : function(a) {
			if (this[0] && this[0].parentNode) {
				if (c.isFunction(a))
					return this.each(function(b) {
						var d = c(this), f = d.html();
						d.replaceWith(a.call(this, b, f))
					});
				else
					a = c(a).detach();
				return this.each(function() {
					var b = this.nextSibling, d = this.parentNode;
					c(this).remove();
					b ? c(b).before(a) : c(d).append(a)
				})
			} else
				return this.pushStack(c(c.isFunction(a) ? a() : a), "replaceWith", a)
		},
		detach : function(a) {
			return this.remove(a, true)
		},
		domManip : function(a, b, d) {
			function f(s) {
				return c.nodeName(s, "table") ? s.getElementsByTagName("tbody")[0] || s.appendChild(s.ownerDocument.createElement("tbody")) : s
			}

			var e, i, j = a[0], n = [];
			if (!c.support.checkClone && arguments.length === 3 && typeof j === "string" && sa.test(j))
				return this.each(function() {
					c(this).domManip(a, b, d, true)
				});
			if (c.isFunction(j))
				return this.each(function(s) {
					var x = c(this);
					a[0] = j.call(this, s, b ? x.html() : v);
					x.domManip(a, b, d)
				});
			if (this[0]) {
				e = a[0] && a[0].parentNode && a[0].parentNode.nodeType === 11 ? {
					fragment : a[0].parentNode
				} : ra(a, this, n);
				if ( i = e.fragment.firstChild) {
					b = b && c.nodeName(i, "tr");
					for (var o = 0, m = this.length; o < m; o++)
						d.call( b ? f(this[o], i) : this[o], e.cacheable || this.length > 1 || o > 0 ? e.fragment.cloneNode(true) : e.fragment)
				}
				n && c.each(n, Ma)
			}
			return this
		}
	});
	c.fragments = {};
	c.each({
		appendTo : "append",
		prependTo : "prepend",
		insertBefore : "before",
		insertAfter : "after",
		replaceAll : "replaceWith"
	}, function(a, b) {
		c.fn[a] = function(d) {
			var f = [];
			d = c(d);
			for (var e = 0, i = d.length; e < i; e++) {
				var j = (e > 0 ? this.clone(true) : this).get();
				c.fn[b].apply(c(d[e]), j);
				f = f.concat(j)
			}
			return this.pushStack(f, a, d.selector)
		}
	});
	c.each({
		remove : function(a, b) {
			if (!a || c.filter(a, [this]).length) {
				if (!b && this.nodeType === 1) {
					c.cleanData(this.getElementsByTagName("*"));
					c.cleanData([this])
				}
				this.parentNode && this.parentNode.removeChild(this)
			}
		},
		empty : function() {
			for (this.nodeType === 1 && c.cleanData(this.getElementsByTagName("*")); this.firstChild; )
				this.removeChild(this.firstChild)
		}
	}, function(a, b) {
		c.fn[a] = function() {
			return this.each(b, arguments)
		}
	});
	c.extend({
		clean : function(a, b, d, f) {
			b = b || r;
			if ( typeof b.createElement === "undefined")
				b = b.ownerDocument || b[0] && b[0].ownerDocument || r;
			var e = [];
			c.each(a, function(i, j) {
				if ( typeof j === "number")
					j += "";
				if (j) {
					if ( typeof j === "string" && !gb.test(j))
						j = b.createTextNode(j);
					else if ( typeof j === "string") {
						j = j.replace(Ga, Ia);
						var n = (Ha.exec(j)||["",""])[1].toLowerCase(), o = F[n] || F._default, m = o[0];
						i = b.createElement("div");
						for (i.innerHTML = o[1] + j + o[2]; m--; )
							i = i.lastChild;
						if (!c.support.tbody) {
							m = fb.test(j);
							n = n === "table" && !m ? i.firstChild && i.firstChild.childNodes : o[1] === "<table>" && !m ? i.childNodes : [];
							for ( o = n.length - 1; o >= 0; --o)
								c.nodeName(n[o], "tbody") && !n[o].childNodes.length && n[o].parentNode.removeChild(n[o])
						}
						!c.support.leadingWhitespace && V.test(j) && i.insertBefore(b.createTextNode(V.exec(j)[0]), i.firstChild);
						j = c.makeArray(i.childNodes)
					}
					if (j.nodeType)
						e.push(j);
					else
						e = c.merge(e, j)
				}
			});
			if (d)
				for ( a = 0; e[a]; a++)
					if (f && c.nodeName(e[a], "script") && (!e[a].type || e[a].type.toLowerCase() === "text/javascript"))
						f.push(e[a].parentNode ? e[a].parentNode.removeChild(e[a]) : e[a]);
					else {
						e[a].nodeType === 1 && e.splice.apply(e, [a + 1, 0].concat(c.makeArray(e[a].getElementsByTagName("script"))));
						d.appendChild(e[a])
					}
			return e
		},
		cleanData : function(a) {
			for (var b = 0, d; ( d = a[b]) != null; b++) {
				c.event.remove(d);
				c.removeData(d)
			}
		}
	});
	var hb = /z-?index|font-?weight|opacity|zoom|line-?height/i, Ja = /alpha\([^)]*\)/, Ka = /opacity=([^)]*)/, ga = /float/i, ha = /-([a-z])/ig, ib = /([A-Z])/g, jb = /^-?\d+(?:px)?$/i, kb = /^-?\d/, lb = {
		position : "absolute",
		visibility : "hidden",
		display : "block"
	}, mb = ["Left", "Right"], nb = ["Top", "Bottom"], ob = r.defaultView && r.defaultView.getComputedStyle, La = c.support.cssFloat ? "cssFloat" : "styleFloat", ia = function(a, b) {
		return b.toUpperCase()
	};
	c.fn.css = function(a, b) {
		return X(this, a, b, true, function(d, f, e) {
			if (e === v)
				return c.curCSS(d, f);
			if ( typeof e === "number" && !hb.test(f))
				e += "px";
			c.style(d, f, e)
		})
	};
	c.extend({
		style : function(a, b, d) {
			if (!a || a.nodeType === 3 || a.nodeType === 8)
				return v;
			if ((b === "width" || b === "height") && parseFloat(d) < 0)
				d = v;
			var f = a.style || a, e = d !== v;
			if (!c.support.opacity && b === "opacity") {
				if (e) {
					f.zoom = 1;
					b = parseInt(d, 10) + "" === "NaN" ? "" : "alpha(opacity=" + d * 100 + ")";
					a = f.filter || c.curCSS(a, "filter") || "";
					f.filter = Ja.test(a) ? a.replace(Ja, b) : b
				}
				return f.filter && f.filter.indexOf("opacity=") >= 0 ? parseFloat(Ka.exec(f.filter)[1]) / 100 + "" : ""
			}
			if (ga.test(b))
				b = La;
			b = b.replace(ha, ia);
			if (e)
				f[b] = d;
			return f[b]
		},
		css : function(a, b, d, f) {
			if (b === "width" || b === "height") {
				var e, i = b === "width" ? mb : nb;
				function j() {
					e = b === "width" ? a.offsetWidth : a.offsetHeight;
					f !== "border" && c.each(i, function() {
						f || (e -= parseFloat(c.curCSS(a, "padding" + this, true)) || 0);
						if (f === "margin")
							e += parseFloat(c.curCSS(a, "margin" + this, true)) || 0;
						else
							e -= parseFloat(c.curCSS(a, "border" + this + "Width", true)) || 0
					})
				}
				a.offsetWidth !== 0 ? j() : c.swap(a, lb, j);
				return Math.max(0, Math.round(e))
			}
			return c.curCSS(a, b, d)
		},
		curCSS : function(a, b, d) {
			var f, e = a.style;
			if (!c.support.opacity && b === "opacity" && a.currentStyle) {
				f = Ka.test(a.currentStyle.filter || "") ? parseFloat(RegExp.$1) / 100 + "" : "";
				return f === "" ? "1" : f
			}
			if (ga.test(b))
				b = La;
			if (!d && e && e[b])
				f = e[b];
			else if (ob) {
				if (ga.test(b))
					b = "float";
				b = b.replace(ib, "-$1").toLowerCase();
				e = a.ownerDocument.defaultView;
				if (!e)
					return null;
				if ( a = e.getComputedStyle(a, null))
					f = a.getPropertyValue(b);
				if (b === "opacity" && f === "")
					f = "1"
			} else if (a.currentStyle) {
				d = b.replace(ha, ia);
				f = a.currentStyle[b] || a.currentStyle[d];
				if (!jb.test(f) && kb.test(f)) {
					b = e.left;
					var i = a.runtimeStyle.left;
					a.runtimeStyle.left = a.currentStyle.left;
					e.left = d === "fontSize" ? "1em" : f || 0;
					f = e.pixelLeft + "px";
					e.left = b;
					a.runtimeStyle.left = i
				}
			}
			return f
		},
		swap : function(a, b, d) {
			var f = {};
			for (var e in b) {
				f[e] = a.style[e];
				a.style[e] = b[e]
			}
			d.call(a);
			for (e in b)
			a.style[e] = f[e]
		}
	});
	if (c.expr && c.expr.filters) {
		c.expr.filters.hidden = function(a) {
			var b = a.offsetWidth, d = a.offsetHeight, f = a.nodeName.toLowerCase() === "tr";
			return b === 0 && d === 0 && !f ? true : b > 0 && d > 0 && !f ? false : c.curCSS(a, "display") === "none"
		};
		c.expr.filters.visible = function(a) {
			return !c.expr.filters.hidden(a)
		}
	}
	var pb = J(), qb = /<script(.|\s)*?\/script>/gi, rb = /select|textarea/i, sb = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i, N = /=\?(&|$)/, ja = /\?/, tb = /(\?|&)_=.*?(&|$)/, ub = /^(\w+:)?\/\/([^\/?#]+)/, vb = /%20/g;
	c.fn.extend({
		_load : c.fn.load,
		load : function(a, b, d) {
			if ( typeof a !== "string")
				return this._load(a);
			else if (!this.length)
				return this;
			var f = a.indexOf(" ");
			if (f >= 0) {
				var e = a.slice(f, a.length);
				a = a.slice(0, f)
			}
			f = "GET";
			if (b)
				if (c.isFunction(b)) {
					d = b;
					b = null
				} else if ( typeof b === "object") {
					b = c.param(b, c.ajaxSettings.traditional);
					f = "POST"
				}
			var i = this;
			c.ajax({
				url : a,
				type : f,
				dataType : "html",
				data : b,
				complete : function(j, n) {
					if (n === "success" || n === "notmodified")
						i.html( e ? c("<div />").append(j.responseText.replace(qb, "")).find(e) : j.responseText);
					d && i.each(d, [j.responseText, n, j])
				}
			});
			return this
		},
		serialize : function() {
			return c.param(this.serializeArray())
		},
		serializeArray : function() {
			return this.map(function() {
				return this.elements ? c.makeArray(this.elements) : this
			}).filter(function() {
				return this.name && !this.disabled && (this.checked || rb.test(this.nodeName) || sb.test(this.type))
			}).map(function(a, b) {
				a = c(this).val();
				return a == null ? null : c.isArray(a) ? c.map(a, function(d) {
					return {
						name : b.name,
						value : d
					}
				}) : {
					name : b.name,
					value : a
				}
			}).get()
		}
	});
	c.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
		c.fn[b] = function(d) {
			return this.bind(b, d)
		}
	});
	c.extend({
		get : function(a, b, d, f) {
			if (c.isFunction(b)) {
				f = f || d;
				d = b;
				b = null
			}
			return c.ajax({
				type : "GET",
				url : a,
				data : b,
				success : d,
				dataType : f
			})
		},
		getScript : function(a, b) {
			return c.get(a, null, b, "script")
		},
		getJSON : function(a, b, d) {
			return c.get(a, b, d, "json")
		},
		post : function(a, b, d, f) {
			if (c.isFunction(b)) {
				f = f || d;
				d = b;
				b = {}
			}
			return c.ajax({
				type : "POST",
				url : a,
				data : b,
				success : d,
				dataType : f
			})
		},
		ajaxSetup : function(a) {
			c.extend(c.ajaxSettings, a)
		},
		ajaxSettings : {
			url : location.href,
			global : true,
			type : "GET",
			contentType : "application/x-www-form-urlencoded",
			processData : true,
			async : true,
			xhr : z.XMLHttpRequest && (z.location.protocol !== "file:" || !z.ActiveXObject) ? function() {
				return new z.XMLHttpRequest
			} : function() {
				try {
					return new z.ActiveXObject("Microsoft.XMLHTTP")
				} catch(a) {
				}
			},
			accepts : {
				xml : "application/xml, text/xml",
				html : "text/html",
				script : "text/javascript, application/javascript",
				json : "application/json, text/javascript",
				text : "text/plain",
				_default : "*/*"
			}
		},
		lastModified : {},
		etag : {},
		ajax : function(a) {
			function b() {
				e.success && e.success.call(o, n, j, w);
				e.global && f("ajaxSuccess", [w, e])
			}

			function d() {
				e.complete && e.complete.call(o, w, j);
				e.global && f("ajaxComplete", [w, e]);
				e.global && !--c.active && c.event.trigger("ajaxStop")
			}

			function f(q, p) {
				(e.context ? c(e.context) : c.event).trigger(q, p)
			}

			var e = c.extend(true, {}, c.ajaxSettings, a), i, j, n, o = a && a.context || e, m = e.type.toUpperCase();
			if (e.data && e.processData && typeof e.data !== "string")
				e.data = c.param(e.data, e.traditional);
			if (e.dataType === "jsonp") {
				if (m === "GET")
					N.test(e.url) || (e.url += (ja.test(e.url) ? "&" : "?") + (e.jsonp || "callback") + "=?");
				else if (!e.data || !N.test(e.data))
					e.data = (e.data ? e.data + "&" : "") + (e.jsonp || "callback") + "=?";
				e.dataType = "json"
			}
			if (e.dataType === "json" && (e.data && N.test(e.data) || N.test(e.url))) {
				i = e.jsonpCallback || "jsonp" + pb++;
				if (e.data)
					e.data = (e.data + "").replace(N, "=" + i + "$1");
				e.url = e.url.replace(N, "=" + i + "$1");
				e.dataType = "script";
				z[i] = z[i] ||
				function(q) {
					n = q;
					b();
					d();
					z[i] = v;
					try {
						delete z[i]
					} catch(p) {
					}
					A && A.removeChild(B)
				}

			}
			if (e.dataType === "script" && e.cache === null)
				e.cache = false;
			if (e.cache === false && m === "GET") {
				var s = J(), x = e.url.replace(tb, "$1_=" + s + "$2");
				e.url = x + (x === e.url ? (ja.test(e.url) ? "&" : "?") + "_=" + s : "")
			}
			if (e.data && m === "GET")
				e.url += (ja.test(e.url) ? "&" : "?") + e.data;
			e.global && !c.active++ && c.event.trigger("ajaxStart");
			s = ( s = ub.exec(e.url)) && (s[1] && s[1] !== location.protocol || s[2] !== location.host);
			if (e.dataType === "script" && m === "GET" && s) {
				var A = r.getElementsByTagName("head")[0] || r.documentElement, B = r.createElement("script");
				B.src = e.url;
				if (e.scriptCharset)
					B.charset = e.scriptCharset;
				if (!i) {
					var C = false;
					B.onload = B.onreadystatechange = function() {
						if (!C && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
							C = true;
							b();
							d();
							B.onload = B.onreadystatechange = null;
							A && B.parentNode && A.removeChild(B)
						}
					}
				}
				A.insertBefore(B, A.firstChild);
				return v
			}
			var E = false, w = e.xhr();
			if (w) {
				e.username ? w.open(m, e.url, e.async, e.username, e.password) : w.open(m, e.url, e.async);
				try {
					if (e.data || a && a.contentType)
						w.setRequestHeader("Content-Type", e.contentType);
					if (e.ifModified) {
						c.lastModified[e.url] && w.setRequestHeader("If-Modified-Since", c.lastModified[e.url]);
						c.etag[e.url] && w.setRequestHeader("If-None-Match", c.etag[e.url])
					}
					s || w.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					w.setRequestHeader("Accept", e.dataType && e.accepts[e.dataType] ? e.accepts[e.dataType] + ", */*" : e.accepts._default)
				} catch(fa) {
				}
				if (e.beforeSend && e.beforeSend.call(o, w, e) === false) {
					e.global && !--c.active && c.event.trigger("ajaxStop");
					w.abort();
					return false
				}
				e.global && f("ajaxSend", [w, e]);
				var g = w.onreadystatechange = function(q) {
					if (!w || w.readyState === 0 || q === "abort") {
						E || d();
						E = true;
						if (w)
							w.onreadystatechange = c.noop
					} else if (!E && w && (w.readyState === 4 || q === "timeout")) {
						E = true;
						w.onreadystatechange = c.noop;
						j = q === "timeout" ? "timeout" : !c.httpSuccess(w) ? "error" : e.ifModified && c.httpNotModified(w, e.url) ? "notmodified" : "success";
						var p;
						if (j === "success")
							try {
								n = c.httpData(w, e.dataType, e)
							} catch(u) {
								j = "parsererror";
								p = u
							}
						if (j === "success" || j === "notmodified")
							i || b();
						else
							c.handleError(e, w, j, p);
						d();
						q === "timeout" && w.abort();
						if (e.async)
							w = null
					}
				};
				try {
					var h = w.abort;
					w.abort = function() {
						w && h.call(w);
						g("abort")
					}
				} catch(k) {
				}
				e.async && e.timeout > 0 && setTimeout(function() {
					w && !E && g("timeout")
				}, e.timeout);
				try {
					w.send(m === "POST" || m === "PUT" || m === "DELETE" ? e.data : null)
				} catch(l) {
					c.handleError(e, w, null, l);
					d()
				}
				e.async || g();
				return w
			}
		},
		handleError : function(a, b, d, f) {
			if (a.error)
				a.error.call(a.context || a, b, d, f);
			if (a.global)
				(a.context ? c(a.context) : c.event).trigger("ajaxError", [b, a, f])
		},
		active : 0,
		httpSuccess : function(a) {
			try {
				return !a.status && location.protocol === "file:" || a.status >= 200 && a.status < 300 || a.status === 304 || a.status === 1223 || a.status === 0
			} catch(b) {
			}
			return false
		},
		httpNotModified : function(a, b) {
			var d = a.getResponseHeader("Last-Modified"), f = a.getResponseHeader("Etag");
			if (d)
				c.lastModified[b] = d;
			if (f)
				c.etag[b] = f;
			return a.status === 304 || a.status === 0
		},
		httpData : function(a, b, d) {
			var f = a.getResponseHeader("content-type") || "", e = b === "xml" || !b && f.indexOf("xml") >= 0;
			a = e ? a.responseXML : a.responseText;
			e && a.documentElement.nodeName === "parsererror" && c.error("parsererror");
			if (d && d.dataFilter)
				a = d.dataFilter(a, b);
			if ( typeof a === "string")
				if (b === "json" || !b && f.indexOf("json") >= 0)
					a = c.parseJSON(a);
				else if (b === "script" || !b && f.indexOf("javascript") >= 0)
					c.globalEval(a);
			return a
		},
		param : function(a, b) {
			function d(j, n) {
				if (c.isArray(n))
					c.each(n, function(o, m) {
						b ? f(j, m) : d(j + "[" + ( typeof m === "object" || c.isArray(m) ? o : "") + "]", m)
					});
				else
					!b && n != null && typeof n === "object" ? c.each(n, function(o, m) {
						d(j + "[" + o + "]", m)
					}) : f(j, n)
			}

			function f(j, n) {
				n = c.isFunction(n) ? n() : n;
				e[e.length] = encodeURIComponent(j) + "=" + encodeURIComponent(n)
			}

			var e = [];
			if (b === v)
				b = c.ajaxSettings.traditional;
			if (c.isArray(a) || a.jquery)
				c.each(a, function() {
					f(this.name, this.value)
				});
			else
				for (var i in a)d(i, a[i]);
			return e.join("&").replace(vb, "+")
		}
	});
	var ka = {}, wb = /toggle|show|hide/, xb = /^([+-]=)?([\d+-.]+)(.*)$/, W, ta = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]];
	c.fn.extend({
		show : function(a, b) {
			if (a || a === 0)
				return this.animate(K("show", 3), a, b);
			else {
				a = 0;
				for ( b = this.length; a < b; a++) {
					var d = c.data(this[a], "olddisplay");
					this[a].style.display = d || "";
					if (c.css(this[a], "display") === "none") {
						d = this[a].nodeName;
						var f;
						if (ka[d])
							f = ka[d];
						else {
							var e = c("<" + d + " />").appendTo("body");
							f = e.css("display");
							if (f === "none")
								f = "block";
							e.remove();
							ka[d] = f
						}
						c.data(this[a], "olddisplay", f)
					}
				}
				a = 0;
				for ( b = this.length; a < b; a++)
					this[a].style.display = c.data(this[a], "olddisplay") || "";
				return this
			}
		},
		hide : function(a, b) {
			if (a || a === 0)
				return this.animate(K("hide", 3), a, b);
			else {
				a = 0;
				for ( b = this.length; a < b; a++) {
					var d = c.data(this[a], "olddisplay");
					!d && d !== "none" && c.data(this[a], "olddisplay", c.css(this[a], "display"))
				}
				a = 0;
				for ( b = this.length; a < b; a++)
					this[a].style.display = "none";
				return this
			}
		},
		_toggle : c.fn.toggle,
		toggle : function(a, b) {
			var d = typeof a === "boolean";
			if (c.isFunction(a) && c.isFunction(b))
				this._toggle.apply(this, arguments);
			else
				a == null || d ? this.each(function() {
					var f = d ? a : c(this).is(":hidden");
					c(this)[f?"show":"hide"]()
				}) : this.animate(K("toggle", 3), a, b);
			return this
		},
		fadeTo : function(a, b, d) {
			return this.filter(":hidden").css("opacity", 0).show().end().animate({
				opacity : b
			}, a, d)
		},
		animate : function(a, b, d, f) {
			var e = c.speed(b, d, f);
			if (c.isEmptyObject(a))
				return this.each(e.complete);
			return this[e.queue===false?"each":"queue"](function() {
				var i = c.extend({}, e), j, n = this.nodeType === 1 && c(this).is(":hidden"), o = this;
				for (j in a) {
					var m = j.replace(ha, ia);
					if (j !== m) {
						a[m] = a[j];
						delete a[j];
						j = m
					}
					if (a[j] === "hide" && n || a[j] === "show" && !n)
						return i.complete.call(this);
					if ((j === "height" || j === "width") && this.style) {
						i.display = c.css(this, "display");
						i.overflow = this.style.overflow
					}
					if (c.isArray(a[j])) {
						(i.specialEasing=i.specialEasing||{})[j] = a[j][1];
						a[j] = a[j][0]
					}
				}
				if (i.overflow != null)
					this.style.overflow = "hidden";
				i.curAnim = c.extend({}, a);
				c.each(a, function(s, x) {
					var A = new c.fx(o, i, s);
					if (wb.test(x))
						A[x==="toggle"?n?"show":"hide":x](a);
					else {
						var B = xb.exec(x), C = A.cur(true) || 0;
						if (B) {
							x = parseFloat(B[2]);
							var E = B[3] || "px";
							if (E !== "px") {
								o.style[s] = (x || 1) + E;
								C = (x || 1) / A.cur(true) * C;
								o.style[s] = C + E
							}
							if (B[1])
								x = (B[1] === "-=" ? -1 : 1) * x + C;
							A.custom(C, x, E)
						} else
							A.custom(C, x, "")
					}
				});
				return true
			})
		},
		stop : function(a, b) {
			var d = c.timers;
			a && this.queue([]);
			this.each(function() {
				for (var f = d.length - 1; f >= 0; f--)
					if (d[f].elem === this) {
						b && d[f](true);
						d.splice(f, 1)
					}
			});
			b || this.dequeue();
			return this
		}
	});
	c.each({
		slideDown : K("show", 1),
		slideUp : K("hide", 1),
		slideToggle : K("toggle", 1),
		fadeIn : {
			opacity : "show"
		},
		fadeOut : {
			opacity : "hide"
		}
	}, function(a, b) {
		c.fn[a] = function(d, f) {
			return this.animate(b, d, f)
		}
	});
	c.extend({
		speed : function(a, b, d) {
			var f = a && typeof a === "object" ? a : {
				complete : d || !d && b || c.isFunction(a) && a,
				duration : a,
				easing : d && b || b && !c.isFunction(b) && b
			};
			f.duration = c.fx.off ? 0 : typeof f.duration === "number" ? f.duration : c.fx.speeds[f.duration] || c.fx.speeds._default;
			f.old = f.complete;
			f.complete = function() {
				f.queue !== false && c(this).dequeue();
				c.isFunction(f.old) && f.old.call(this)
			};
			return f
		},
		easing : {
			linear : function(a, b, d, f) {
				return d + f * a
			},
			swing : function(a, b, d, f) {
				return (-Math.cos(a * Math.PI) / 2 + 0.5) * f + d
			}
		},
		timers : [],
		fx : function(a, b, d) {
			this.options = b;
			this.elem = a;
			this.prop = d;
			if (!b.orig)
				b.orig = {}
		}
	});
	c.fx.prototype = {
		update : function() {
			this.options.step && this.options.step.call(this.elem, this.now, this);
			(c.fx.step[this.prop] || c.fx.step._default)(this);
			if ((this.prop === "height" || this.prop === "width") && this.elem.style)
				this.elem.style.display = "block"
		},
		cur : function(a) {
			if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null))
				return this.elem[this.prop];
			return ( a = parseFloat(c.css(this.elem, this.prop, a))) && a > -10000 ? a : parseFloat(c.curCSS(this.elem, this.prop)) || 0
		},
		custom : function(a, b, d) {
			function f(i) {
				return e.step(i)
			}
			this.startTime = J();
			this.start = a;
			this.end = b;
			this.unit = d || this.unit || "px";
			this.now = this.start;
			this.pos = this.state = 0;
			var e = this;
			f.elem = this.elem;
			if (f() && c.timers.push(f) && !W)
				W = setInterval(c.fx.tick, 13)
		},
		show : function() {
			this.options.orig[this.prop] = c.style(this.elem, this.prop);
			this.options.show = true;
			this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
			c(this.elem).show()
		},
		hide : function() {
			this.options.orig[this.prop] = c.style(this.elem, this.prop);
			this.options.hide = true;
			this.custom(this.cur(), 0)
		},
		step : function(a) {
			var b = J(), d = true;
			if (a || b >= this.options.duration + this.startTime) {
				this.now = this.end;
				this.pos = this.state = 1;
				this.update();
				this.options.curAnim[this.prop] = true;
				for (var f in this.options.curAnim)
				if (this.options.curAnim[f] !== true)
					d = false;
				if (d) {
					if (this.options.display != null) {
						this.elem.style.overflow = this.options.overflow;
						a = c.data(this.elem, "olddisplay");
						this.elem.style.display = a ? a : this.options.display;
						if (c.css(this.elem, "display") === "none")
							this.elem.style.display = "block"
					}
					this.options.hide && c(this.elem).hide();
					if (this.options.hide || this.options.show)
						for (var e in this.options.curAnim)
						c.style(this.elem, e, this.options.orig[e]);
					this.options.complete.call(this.elem)
				}
				return false
			} else {
				e = b - this.startTime;
				this.state = e / this.options.duration;
				a = this.options.easing || (c.easing.swing ? "swing" : "linear");
				this.pos = c.easing[this.options.specialEasing&&this.options.specialEasing[this.prop]||a](this.state, e, 0, 1, this.options.duration);
				this.now = this.start + (this.end - this.start) * this.pos;
				this.update()
			}
			return true
		}
	};
	c.extend(c.fx, {
		tick : function() {
			for (var a = c.timers, b = 0; b < a.length; b++)
				a[b]() || a.splice(b--, 1);
			a.length || c.fx.stop()
		},
		stop : function() {
			clearInterval(W);
			W = null
		},
		speeds : {
			slow : 600,
			fast : 200,
			_default : 400
		},
		step : {
			opacity : function(a) {
				c.style(a.elem, "opacity", a.now)
			},
			_default : function(a) {
				if (a.elem.style && a.elem.style[a.prop] != null)
					a.elem.style[a.prop] = (a.prop === "width" || a.prop === "height" ? Math.max(0, a.now) : a.now) + a.unit;
				else
					a.elem[a.prop] = a.now
			}
		}
	});
	if (c.expr && c.expr.filters)
		c.expr.filters.animated = function(a) {
			return c.grep(c.timers, function(b) {
				return a === b.elem
			}).length
		};
	c.fn.offset = "getBoundingClientRect" in r.documentElement ? function(a) {
		var b = this[0];
		if (a)
			return this.each(function(e) {
				c.offset.setOffset(this, a, e)
			});
		if (!b || !b.ownerDocument)
			return null;
		if (b === b.ownerDocument.body)
			return c.offset.bodyOffset(b);
		var d = b.getBoundingClientRect(), f = b.ownerDocument;
		b = f.body;
		f = f.documentElement;
		return {
			top : d.top + (self.pageYOffset || c.support.boxModel && f.scrollTop || b.scrollTop) - (f.clientTop || b.clientTop || 0),
			left : d.left + (self.pageXOffset || c.support.boxModel && f.scrollLeft || b.scrollLeft) - (f.clientLeft || b.clientLeft || 0)
		}
	} : function(a) {
		var b = this[0];
		if (a)
			return this.each(function(s) {
				c.offset.setOffset(this, a, s)
			});
		if (!b || !b.ownerDocument)
			return null;
		if (b === b.ownerDocument.body)
			return c.offset.bodyOffset(b);
		c.offset.initialize();
		var d = b.offsetParent, f = b, e = b.ownerDocument, i, j = e.documentElement, n = e.body;
		f = ( e = e.defaultView) ? e.getComputedStyle(b, null) : b.currentStyle;
		for (var o = b.offsetTop, m = b.offsetLeft; ( b = b.parentNode) && b !== n && b !== j; ) {
			if (c.offset.supportsFixedPosition && f.position === "fixed")
				break;
			i = e ? e.getComputedStyle(b, null) : b.currentStyle;
			o -= b.scrollTop;
			m -= b.scrollLeft;
			if (b === d) {
				o += b.offsetTop;
				m += b.offsetLeft;
				if (c.offset.doesNotAddBorder && !(c.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(b.nodeName))) {
					o += parseFloat(i.borderTopWidth) || 0;
					m += parseFloat(i.borderLeftWidth) || 0
				}
				f = d;
				d = b.offsetParent
			}
			if (c.offset.subtractsBorderForOverflowNotVisible && i.overflow !== "visible") {
				o += parseFloat(i.borderTopWidth) || 0;
				m += parseFloat(i.borderLeftWidth) || 0
			}
			f = i
		}
		if (f.position === "relative" || f.position === "static") {
			o += n.offsetTop;
			m += n.offsetLeft
		}
		if (c.offset.supportsFixedPosition && f.position === "fixed") {
			o += Math.max(j.scrollTop, n.scrollTop);
			m += Math.max(j.scrollLeft, n.scrollLeft)
		}
		return {
			top : o,
			left : m
		}
	};
	c.offset = {
		initialize : function() {
			var a = r.body, b = r.createElement("div"), d, f, e, i = parseFloat(c.curCSS(a, "marginTop", true)) || 0;
			c.extend(b.style, {
				position : "absolute",
				top : 0,
				left : 0,
				margin : 0,
				border : 0,
				width : "1px",
				height : "1px",
				visibility : "hidden"
			});
			b.innerHTML = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
			a.insertBefore(b, a.firstChild);
			d = b.firstChild;
			f = d.firstChild;
			e = d.nextSibling.firstChild.firstChild;
			this.doesNotAddBorder = f.offsetTop !== 5;
			this.doesAddBorderForTableAndCells = e.offsetTop === 5;
			f.style.position = "fixed";
			f.style.top = "20px";
			this.supportsFixedPosition = f.offsetTop === 20 || f.offsetTop === 15;
			f.style.position = f.style.top = "";
			d.style.overflow = "hidden";
			d.style.position = "relative";
			this.subtractsBorderForOverflowNotVisible = f.offsetTop === -5;
			this.doesNotIncludeMarginInBodyOffset = a.offsetTop !== i;
			a.removeChild(b);
			c.offset.initialize = c.noop
		},
		bodyOffset : function(a) {
			var b = a.offsetTop, d = a.offsetLeft;
			c.offset.initialize();
			if (c.offset.doesNotIncludeMarginInBodyOffset) {
				b += parseFloat(c.curCSS(a, "marginTop", true)) || 0;
				d += parseFloat(c.curCSS(a, "marginLeft", true)) || 0
			}
			return {
				top : b,
				left : d
			}
		},
		setOffset : function(a, b, d) {
			if (/static/.test(c.curCSS(a, "position")))
				a.style.position = "relative";
			var f = c(a), e = f.offset(), i = parseInt(c.curCSS(a, "top", true), 10) || 0, j = parseInt(c.curCSS(a, "left", true), 10) || 0;
			if (c.isFunction(b))
				b = b.call(a, d, e);
			d = {
				top : b.top - e.top + i,
				left : b.left - e.left + j
			};
			"using" in b ? b.using.call(a, d) : f.css(d)
		}
	};
	c.fn.extend({
		position : function() {
			if (!this[0])
				return null;
			var a = this[0], b = this.offsetParent(), d = this.offset(), f = /^body|html$/i.test(b[0].nodeName) ? {
				top : 0,
				left : 0
			} : b.offset();
			d.top -= parseFloat(c.curCSS(a, "marginTop", true)) || 0;
			d.left -= parseFloat(c.curCSS(a, "marginLeft", true)) || 0;
			f.top += parseFloat(c.curCSS(b[0], "borderTopWidth", true)) || 0;
			f.left += parseFloat(c.curCSS(b[0], "borderLeftWidth", true)) || 0;
			return {
				top : d.top - f.top,
				left : d.left - f.left
			}
		},
		offsetParent : function() {
			return this.map(function() {
				for (var a = this.offsetParent || r.body; a && !/^body|html$/i.test(a.nodeName) && c.css(a, "position") === "static"; )
					a = a.offsetParent;
				return a
			})
		}
	});
	c.each(["Left", "Top"], function(a, b) {
		var d = "scroll" + b;
		c.fn[d] = function(f) {
			var e = this[0], i;
			if (!e)
				return null;
			if (f !== v)
				return this.each(function() {
					if ( i = ua(this))
						i.scrollTo(!a ? f : c(i).scrollLeft(), a ? f : c(i).scrollTop());
					else
						this[d] = f
				});
			else
				return ( i = ua(e)) ? "pageXOffset" in i ? i[ a ? "pageYOffset" : "pageXOffset"] : c.support.boxModel && i.document.documentElement[d] || i.document.body[d] : e[d]
		}
	});
	c.each(["Height", "Width"], function(a, b) {
		var d = b.toLowerCase();
		c.fn["inner" + b] = function() {
			return this[0] ? c.css(this[0], d, false, "padding") : null
		};
		c.fn["outer" + b] = function(f) {
			return this[0] ? c.css(this[0], d, false, f ? "margin" : "border") : null
		};
		c.fn[d] = function(f) {
			var e = this[0];
			if (!e)
				return f == null ? null : this;
			if (c.isFunction(f))
				return this.each(function(i) {
					var j = c(this);
					j[d](f.call(this, i, j[d]()))
				});
			return "scrollTo" in e && e.document ? e.document.compatMode === "CSS1Compat" && e.document.documentElement["client" + b] || e.document.body["client" + b] : e.nodeType === 9 ? Math.max(e.documentElement["client" + b], e.body["scroll" + b], e.documentElement["scroll" + b], e.body["offset" + b], e.documentElement["offset" + b]) : f === v ? c.css(e, d) : this.css(d, typeof f === "string" ? f : f + "px")
		}
	});
	z.jQuery = z.$ = c
})(window);
;
jQuery.ui || (function($) {
	var _remove = $.fn.remove, isFF2 = $.browser.mozilla && (parseFloat($.browser.version) < 1.9);
	$.ui = {
		version : "1.7.2",
		plugin : {
			add : function(module, option, set) {
				var proto = $.ui[module].prototype;
				for (var i in set) {
					proto.plugins[i] = proto.plugins[i] || [];
					proto.plugins[i].push([option, set[i]])
				}
			},
			call : function(instance, name, args) {
				var set = instance.plugins[name];
				if (!set || !instance.element[0].parentNode) {
					return
				}
				for (var i = 0; i < set.length; i++) {
					if (instance.options[set[i][0]]) {
						set[i][1].apply(instance.element, args)
					}
				}
			}
		},
		contains : function(a, b) {
			return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
		},
		hasScroll : function(el, a) {
			if ($(el).css('overflow') == 'hidden') {
				return false
			}
			var scroll = (a && a == 'left') ? 'scrollLeft' : 'scrollTop', has = false;
			if (el[scroll] > 0) {
				return true
			}
			el[scroll] = 1;
			has = (el[scroll] > 0);
			el[scroll] = 0;
			return has
		},
		isOverAxis : function(x, reference, size) {
			return (x > reference) && (x < (reference + size))
		},
		isOver : function(y, x, top, left, height, width) {
			return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width)
		},
		keyCode : {
			BACKSPACE : 8,
			CAPS_LOCK : 20,
			COMMA : 188,
			CONTROL : 17,
			DELETE : 46,
			DOWN : 40,
			END : 35,
			ENTER : 13,
			ESCAPE : 27,
			HOME : 36,
			INSERT : 45,
			LEFT : 37,
			NUMPAD_ADD : 107,
			NUMPAD_DECIMAL : 110,
			NUMPAD_DIVIDE : 111,
			NUMPAD_ENTER : 108,
			NUMPAD_MULTIPLY : 106,
			NUMPAD_SUBTRACT : 109,
			PAGE_DOWN : 34,
			PAGE_UP : 33,
			PERIOD : 190,
			RIGHT : 39,
			SHIFT : 16,
			SPACE : 32,
			TAB : 9,
			UP : 38
		}
	};
	if (isFF2) {
		var attr = $.attr, removeAttr = $.fn.removeAttr, ariaNS = "http://www.w3.org/2005/07/aaa", ariaState = /^aria-/, ariaRole = /^wairole:/;
		$.attr = function(elem, name, value) {
			var set = value !== undefined;
			return (name == 'role' ? ( set ? attr.call(this, elem, name, "wairole:" + value) : (attr.apply(this, arguments) || "").replace(ariaRole, "")) : (ariaState.test(name) ? ( set ? elem.setAttributeNS(ariaNS, name.replace(ariaState, "aaa:"), value) : attr.call(this, elem, name.replace(ariaState, "aaa:"))) : attr.apply(this, arguments)))
		};
		$.fn.removeAttr = function(name) {
			return (ariaState.test(name) ? this.each(function() {
				this.removeAttributeNS(ariaNS, name.replace(ariaState, ""))
			}) : removeAttr.call(this, name))
		}
	}
	$.fn.extend({
		remove : function() {
			$("*", this).add(this).each(function() {
				$(this).triggerHandler("remove")
			});
			return _remove.apply(this, arguments)
		},
		enableSelection : function() {
			return this.attr('unselectable', 'off').css('MozUserSelect', '').unbind('selectstart.ui')
		},
		disableSelection : function() {
			return this.attr('unselectable', 'on').css('MozUserSelect', 'none').bind('selectstart.ui', function() {
				return false
			})
		},
		scrollParent : function() {
			var scrollParent;
			if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
				scrollParent = this.parents().filter(function() {
					return (/(relative|absolute|fixed)/).test($.curCSS(this, 'position', 1)) && (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1))
				}).eq(0)
			} else {
				scrollParent = this.parents().filter(function() {
					return (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1))
				}).eq(0)
			}
			return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent
		}
	});
	$.extend($.expr[':'], {
		data : function(elem, i, match) {
			return !!$.data(elem, match[3])
		},
		focusable : function(element) {
			var nodeName = element.nodeName.toLowerCase(), tabIndex = $.attr(element, 'tabindex');
			return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : 'a' == nodeName || 'area' == nodeName ? element.href || !isNaN(tabIndex) : !isNaN(tabIndex)) && !$(element)['area'==nodeName?'parents':'closest'](':hidden').length
		},
		tabbable : function(element) {
			var tabIndex = $.attr(element, 'tabindex');
			return (isNaN(tabIndex) || tabIndex >= 0) && $(element).is(':focusable')
		}
	});
	function getter(namespace, plugin, method, args) {
		function getMethods(type) {
			var methods = $[namespace][plugin][type] || [];
			return ( typeof methods == 'string' ? methods.split(/,?\s+/) : methods)
		}

		var methods = getMethods('getter');
		if (args.length == 1 && typeof args[0] == 'string') {
			methods = methods.concat(getMethods('getterSetter'))
		}
		return ($.inArray(method, methods) != -1)
	}
	$.widget = function(name, prototype) {
		var namespace = name.split(".")[0];
		name = name.split(".")[1];
		$.fn[name] = function(options) {
			var isMethodCall = ( typeof options == 'string'), args = Array.prototype.slice.call(arguments, 1);
			if (isMethodCall && options.substring(0, 1) == '_') {
				return this
			}
			if (isMethodCall && getter(namespace, name, options, args)) {
				var instance = $.data(this[0], name);
				return ( instance ? instance[options].apply(instance, args) : undefined)
			}
			return this.each(function() {
				var instance = $.data(this, name);
				(!instance && !isMethodCall && $.data(this, name, new $[namespace][name](this, options))._init());
				(instance && isMethodCall && $.isFunction(instance[options]) && instance[options].apply(instance, args))
			})
		};
		$[namespace] = $[namespace] || {};
		$[namespace][name] = function(element, options) {
			var self = this;
			this.namespace = namespace;
			this.widgetName = name;
			this.widgetEventPrefix = $[namespace][name].eventPrefix || name;
			this.widgetBaseClass = namespace + '-' + name;
			this.options = $.extend({}, $.widget.defaults, $[namespace][name].defaults, $.metadata && $.metadata.get(element)[name], options);
			this.element = $(element).bind('setData.' + name, function(event, key, value) {
				if (event.target == element) {
					return self._setData(key, value)
				}
			}).bind('getData.' + name, function(event, key) {
				if (event.target == element) {
					return self._getData(key)
				}
			}).bind('remove', function() {
				return self.destroy()
			})
		};
		$[namespace][name].prototype = $.extend({}, $.widget.prototype, prototype);
		$[namespace][name].getterSetter = 'option'
	};
	$.widget.prototype = {
		_init : function() {
		},
		destroy : function() {
			this.element.removeData(this.widgetName).removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled').removeAttr('aria-disabled')
		},
		option : function(key, value) {
			var options = key, self = this;
			if ( typeof key == "string") {
				if (value === undefined) {
					return this._getData(key)
				}
				options = {};
				options[key] = value
			}
			$.each(options, function(key, value) {
				self._setData(key, value)
			})
		},
		_getData : function(key) {
			return this.options[key]
		},
		_setData : function(key, value) {
			this.options[key] = value;
			if (key == 'disabled') {
				this.element[value?'addClass':'removeClass'](this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled').attr("aria-disabled", value)
			}
		},
		enable : function() {
			this._setData('disabled', false)
		},
		disable : function() {
			this._setData('disabled', true)
		},
		_trigger : function(type, event, data) {
			var callback = this.options[type], eventName = (type == this.widgetEventPrefix ? type : this.widgetEventPrefix + type);
			event = $.Event(event);
			event.type = eventName;
			if (event.originalEvent) {
				for (var i = $.event.props.length, prop; i; ) {
					prop = $.event.props[--i];
					event[prop] = event.originalEvent[prop]
				}
			}
			this.element.trigger(event, data);
			return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false || event.isDefaultPrevented())
		}
	};
	$.widget.defaults = {
		disabled : false
	};
	$.ui.mouse = {
		_mouseInit : function() {
			var self = this;
			this.element.bind('mousedown.' + this.widgetName, function(event) {
				return self._mouseDown(event)
			}).bind('click.' + this.widgetName, function(event) {
				if (self._preventClickEvent) {
					self._preventClickEvent = false;
					event.stopImmediatePropagation();
					return false
				}
			});
			if ($.browser.msie) {
				this._mouseUnselectable = this.element.attr('unselectable');
				this.element.attr('unselectable', 'on')
			}
			this.started = false
		},
		_mouseDestroy : function() {
			this.element.unbind('.' + this.widgetName);
			($.browser.msie && this.element.attr('unselectable', this._mouseUnselectable))
		},
		_mouseDown : function(event) {
			event.originalEvent = event.originalEvent || {};
			if (event.originalEvent.mouseHandled) {
				return
			}(this._mouseStarted && this._mouseUp(event));
			this._mouseDownEvent = event;
			var self = this, btnIsLeft = (event.which == 1), elIsCancel = ( typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
			if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
				return true
			}
			this.mouseDelayMet = !this.options.delay;
			if (!this.mouseDelayMet) {
				this._mouseDelayTimer = setTimeout(function() {
					self.mouseDelayMet = true
				}, this.options.delay)
			}
			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = (this._mouseStart(event) !== false);
				if (!this._mouseStarted) {
					event.preventDefault();
					return true
				}
			}
			this._mouseMoveDelegate = function(event) {
				return self._mouseMove(event)
			};
			this._mouseUpDelegate = function(event) {
				return self._mouseUp(event)
			};
			$(document).bind('mousemove.' + this.widgetName, this._mouseMoveDelegate).bind('mouseup.' + this.widgetName, this._mouseUpDelegate);
			($.browser.safari || event.preventDefault());
			event.originalEvent.mouseHandled = true;
			return true
		},
		_mouseMove : function(event) {
			if ($.browser.msie && !event.button) {
				return this._mouseUp(event)
			}
			if (this._mouseStarted) {
				this._mouseDrag(event);
				return event.preventDefault()
			}
			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false);
				(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event))
			}
			return !this._mouseStarted
		},
		_mouseUp : function(event) {
			$(document).unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate).unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);
			if (this._mouseStarted) {
				this._mouseStarted = false;
				this._preventClickEvent = (event.target == this._mouseDownEvent.target);
				this._mouseStop(event)
			}
			return false
		},
		_mouseDistanceMet : function(event) {
			return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance)
		},
		_mouseDelayMet : function(event) {
			return this.mouseDelayMet
		},
		_mouseStart : function(event) {
		},
		_mouseDrag : function(event) {
		},
		_mouseStop : function(event) {
		},
		_mouseCapture : function(event) {
			return true
		}
	};
	$.ui.mouse.defaults = {
		cancel : null,
		distance : 1,
		delay : 0
	}
})(jQuery);
(function($) {
	$.widget("ui.tabs", {
		_init : function() {
			if (this.options.deselectable !== undefined) {
				this.options.collapsible = this.options.deselectable
			}
			this._tabify(true)
		},
		_setData : function(key, value) {
			if (key == 'selected') {
				if (this.options.collapsible && value == this.options.selected) {
					return
				}
				this.select(value)
			} else {
				this.options[key] = value;
				if (key == 'deselectable') {
					this.options.collapsible = value
				}
				this._tabify()
			}
		},
		_tabId : function(a) {
			return a.title && a.title.replace(/\s/g, '_').replace(/[^A-Za-z0-9\-_:\.]/g, '') || this.options.idPrefix + $.data(a)
		},
		_sanitizeSelector : function(hash) {
			return hash.replace(/:/g, '\\:')
		},
		_cookie : function() {
			var cookie = this.cookie || (this.cookie = this.options.cookie.name || 'ui-tabs-' + $.data(this.list[0]));
			return $.cookie.apply(null, [cookie].concat($.makeArray(arguments)))
		},
		_ui : function(tab, panel) {
			return {
				tab : tab,
				panel : panel,
				index : this.anchors.index(tab)
			}
		},
		_cleanup : function() {
			this.lis.filter('.ui-state-processing').removeClass('ui-state-processing').find('span:data(label.tabs)').each(function() {
				var el = $(this);
				el.html(el.data('label.tabs')).removeData('label.tabs')
			})
		},
		_tabify : function(init) {
			this.list = this.element.children('ul:first');
			this.lis = $('li:has(a[href])', this.list);
			this.anchors = this.lis.map(function() {
				return $('a',this)[0]
			});
			this.panels = $([]);
			var self = this, o = this.options;
			var fragmentId = /^#.+/;
			this.anchors.each(function(i, a) {
				var href = $(a).attr('href');
				var hrefBase = href.split('#')[0], baseEl;
				if (hrefBase && (hrefBase === location.toString().split('#')[0] || ( baseEl = $('base')[0]) && hrefBase === baseEl.href)) {
					href = a.hash;
					a.href = href
				}
				if (fragmentId.test(href)) {
					self.panels = self.panels.add(self._sanitizeSelector(href))
				} else if (href != '#') {
					$.data(a, 'href.tabs', href);
					$.data(a, 'load.tabs', href.replace(/#.*$/, ''));
					var id = self._tabId(a);
					a.href = '#' + id;
					var $panel = $('#' + id);
					if (!$panel.length) {
						$panel = $(o.panelTemplate).attr('id', id).addClass('ui-tabs-panel ui-widget-content ui-corner-bottom').insertAfter(self.panels[i - 1] || self.list);
						$panel.data('destroy.tabs', true)
					}
					self.panels = self.panels.add($panel)
				} else {
					o.disabled.push(i)
				}
			});
			if (init) {
				this.element.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
				this.list.addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
				this.lis.addClass('ui-state-default ui-corner-top');
				this.panels.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');
				if (o.selected === undefined) {
					if (location.hash) {
						this.anchors.each(function(i, a) {
							if (a.hash == location.hash) {
								o.selected = i;
								return false
							}
						})
					}
					if ( typeof o.selected != 'number' && o.cookie) {
						o.selected = parseInt(self._cookie(), 10)
					}
					if ( typeof o.selected != 'number' && this.lis.filter('.ui-tabs-selected').length) {
						o.selected = this.lis.index(this.lis.filter('.ui-tabs-selected'))
					}
					o.selected = o.selected || 0
				} else if (o.selected === null) {
					o.selected = -1
				}
				o.selected = ((o.selected >= 0 && this.anchors[o.selected]) || o.selected < 0) ? o.selected : 0;
				o.disabled = $.unique(o.disabled.concat($.map(this.lis.filter('.ui-state-disabled'), function(n, i) {
					return self.lis.index(n)
				}))).sort();
				if ($.inArray(o.selected, o.disabled) != -1) {
					o.disabled.splice($.inArray(o.selected, o.disabled), 1)
				}
				this.panels.addClass('ui-tabs-hide');
				this.lis.removeClass('ui-tabs-selected ui-state-active');
				if (o.selected >= 0 && this.anchors.length) {
					this.panels.eq(o.selected).removeClass('ui-tabs-hide');
					this.lis.eq(o.selected).addClass('ui-tabs-selected ui-state-active');
					self.element.queue("tabs", function() {
						self._trigger('show', null, self._ui(self.anchors[o.selected], self.panels[o.selected]))
					});
					this.load(o.selected)
				}
				$(window).bind('unload', function() {
					self.lis.add(self.anchors).unbind('.tabs');
					self.lis = self.anchors = self.panels = null
				})
			} else {
				o.selected = this.lis.index(this.lis.filter('.ui-tabs-selected'))
			}
			this.element[o.collapsible?'addClass':'removeClass']('ui-tabs-collapsible');
			if (o.cookie) {
				this._cookie(o.selected, o.cookie)
			}
			for (var i = 0, li; ( li = this.lis[i]); i++) {
				$(li)[$.inArray(i,o.disabled)!=-1&&!$(li).hasClass('ui-tabs-selected')?'addClass':'removeClass']('ui-state-disabled')
			}
			if (o.cache === false) {
				this.anchors.removeData('cache.tabs')
			}
			this.lis.add(this.anchors).unbind('.tabs');
			if (o.event != 'mouseover') {
				var addState = function(state, el) {
					if (el.is(':not(.ui-state-disabled)')) {
						el.addClass('ui-state-' + state)
					}
				};
				var removeState = function(state, el) {
					el.removeClass('ui-state-' + state)
				};
				this.lis.bind('mouseover.tabs', function() {
					addState('hover', $(this))
				});
				this.lis.bind('mouseout.tabs', function() {
					removeState('hover', $(this))
				});
				this.anchors.bind('focus.tabs', function() {
					addState('focus', $(this).closest('li'))
				});
				this.anchors.bind('blur.tabs', function() {
					removeState('focus', $(this).closest('li'))
				})
			}
			var hideFx, showFx;
			if (o.fx) {
				if ($.isArray(o.fx)) {
					hideFx = o.fx[0];
					showFx = o.fx[1]
				} else {
					hideFx = showFx = o.fx
				}
			}
			function resetStyle($el, fx) {
				$el.css({
					display : ''
				});
				if ($.browser.msie && fx.opacity) {
					$el[0].style.removeAttribute('filter')
				}
			}

			var showTab = showFx ? function(clicked, $show) {
				$(clicked).closest('li').removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active');
				$show.hide().removeClass('ui-tabs-hide').animate(showFx, showFx.duration || 'normal', function() {
					resetStyle($show, showFx);
					self._trigger('show', null, self._ui(clicked, $show[0]))
				})
			} : function(clicked, $show) {
				$(clicked).closest('li').removeClass('ui-state-default').addClass('ui-tabs-selected ui-state-active');
				$show.removeClass('ui-tabs-hide');
				self._trigger('show', null, self._ui(clicked, $show[0]))
			};
			var hideTab = hideFx ? function(clicked, $hide) {
				$hide.animate(hideFx, hideFx.duration || 'normal', function() {
					self.lis.removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');
					$hide.addClass('ui-tabs-hide');
					resetStyle($hide, hideFx);
					self.element.dequeue("tabs")
				})
			} : function(clicked, $hide, $show) {
				self.lis.removeClass('ui-tabs-selected ui-state-active').addClass('ui-state-default');
				$hide.addClass('ui-tabs-hide');
				self.element.dequeue("tabs")
			};
			this.anchors.bind(o.event + '.tabs', function() {
				var el = this, $li = $(this).closest('li'), $hide = self.panels.filter(':not(.ui-tabs-hide)'), $show = $(self._sanitizeSelector(this.hash));
				if (($li.hasClass('ui-tabs-selected') && !o.collapsible) || $li.hasClass('ui-state-disabled') || $li.hasClass('ui-state-processing') || self._trigger('select', null, self._ui(this, $show[0])) === false) {
					this.blur();
					return false
				}
				o.selected = self.anchors.index(this);
				self.abort();
				if (o.collapsible) {
					if ($li.hasClass('ui-tabs-selected')) {
						o.selected = -1;
						if (o.cookie) {
							self._cookie(o.selected, o.cookie)
						}
						self.element.queue("tabs", function() {
							hideTab(el, $hide)
						}).dequeue("tabs");
						this.blur();
						return false
					} else if (!$hide.length) {
						if (o.cookie) {
							self._cookie(o.selected, o.cookie)
						}
						self.element.queue("tabs", function() {
							showTab(el, $show)
						});
						self.load(self.anchors.index(this));
						this.blur();
						return false
					}
				}
				if (o.cookie) {
					self._cookie(o.selected, o.cookie)
				}
				if ($show.length) {
					if ($hide.length) {
						self.element.queue("tabs", function() {
							hideTab(el, $hide)
						})
					}
					self.element.queue("tabs", function() {
						showTab(el, $show)
					});
					self.load(self.anchors.index(this))
				} else {
					throw 'jQuery UI Tabs: Mismatching fragment identifier.'
				}
				if ($.browser.msie) {
					this.blur()
				}
			});
			this.anchors.bind('click.tabs', function() {
				return false
			})
		},
		destroy : function() {
			var o = this.options;
			this.abort();
			this.element.unbind('.tabs').removeClass('ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible').removeData('tabs');
			this.list.removeClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
			this.anchors.each(function() {
				var href = $.data(this, 'href.tabs');
				if (href) {
					this.href = href
				}
				var $this = $(this).unbind('.tabs');
				$.each(['href', 'load', 'cache'], function(i, prefix) {
					$this.removeData(prefix + '.tabs')
				})
			});
			this.lis.unbind('.tabs').add(this.panels).each(function() {
				if ($.data(this, 'destroy.tabs')) {
					$(this).remove()
				} else {
					$(this).removeClass(['ui-state-default', 'ui-corner-top', 'ui-tabs-selected', 'ui-state-active', 'ui-state-hover', 'ui-state-focus', 'ui-state-disabled', 'ui-tabs-panel', 'ui-widget-content', 'ui-corner-bottom', 'ui-tabs-hide'].join(' '))
				}
			});
			if (o.cookie) {
				this._cookie(null, o.cookie)
			}
		},
		add : function(url, label, index) {
			if (index === undefined) {
				index = this.anchors.length
			}
			var self = this, o = this.options, $li = $(o.tabTemplate.replace(/#\{href\}/g, url).replace(/#\{label\}/g, label)), id = !url.indexOf('#') ? url.replace('#', '') : this._tabId($('a',$li)[0]);
			$li.addClass('ui-state-default ui-corner-top').data('destroy.tabs', true);
			var $panel = $('#' + id);
			if (!$panel.length) {
				$panel = $(o.panelTemplate).attr('id', id).data('destroy.tabs', true)
			}
			$panel.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide');
			if (index >= this.lis.length) {
				$li.appendTo(this.list);
				$panel.appendTo(this.list[0].parentNode)
			} else {
				$li.insertBefore(this.lis[index]);
				$panel.insertBefore(this.panels[index])
			}
			o.disabled = $.map(o.disabled, function(n, i) {
				return n >= index ? ++n : n
			});
			this._tabify();
			if (this.anchors.length == 1) {
				$li.addClass('ui-tabs-selected ui-state-active');
				$panel.removeClass('ui-tabs-hide');
				this.element.queue("tabs", function() {
					self._trigger('show', null, self._ui(self.anchors[0], self.panels[0]))
				});
				this.load(0)
			}
			this._trigger('add', null, this._ui(this.anchors[index], this.panels[index]))
		},
		remove : function(index) {
			var o = this.options, $li = this.lis.eq(index).remove(), $panel = this.panels.eq(index).remove();
			if ($li.hasClass('ui-tabs-selected') && this.anchors.length > 1) {
				this.select(index + (index + 1 < this.anchors.length ? 1 : -1))
			}
			o.disabled = $.map($.grep(o.disabled, function(n, i) {
				return n != index
			}), function(n, i) {
				return n >= index ? --n : n
			});
			this._tabify();
			this._trigger('remove', null, this._ui($li.find('a')[0], $panel[0]))
		},
		enable : function(index) {
			var o = this.options;
			if ($.inArray(index, o.disabled) == -1) {
				return
			}
			this.lis.eq(index).removeClass('ui-state-disabled');
			o.disabled = $.grep(o.disabled, function(n, i) {
				return n != index
			});
			this._trigger('enable', null, this._ui(this.anchors[index], this.panels[index]))
		},
		disable : function(index) {
			var self = this, o = this.options;
			if (index != o.selected) {
				this.lis.eq(index).addClass('ui-state-disabled');
				o.disabled.push(index);
				o.disabled.sort();
				this._trigger('disable', null, this._ui(this.anchors[index], this.panels[index]))
			}
		},
		select : function(index) {
			if ( typeof index == 'string') {
				index = this.anchors.index(this.anchors.filter('[href$=' + index + ']'))
			} else if (index === null) {
				index = -1
			}
			if (index == -1 && this.options.collapsible) {
				index = this.options.selected
			}
			this.anchors.eq(index).trigger(this.options.event + '.tabs')
		},
		load : function(index) {
			var self = this, o = this.options, a = this.anchors.eq(index)[0], url = $.data(a, 'load.tabs');
			this.abort();
			if (!url || this.element.queue("tabs").length !== 0 && $.data(a, 'cache.tabs')) {
				this.element.dequeue("tabs");
				return
			}
			this.lis.eq(index).addClass('ui-state-processing');
			if (o.spinner) {
				var span = $('span', a);
				span.data('label.tabs', span.html()).html(o.spinner)
			}
			this.xhr = $.ajax($.extend({}, o.ajaxOptions, {
				url : url,
				success : function(r, s) {
					$(self._sanitizeSelector(a.hash)).html(r);
					self._cleanup();
					if (o.cache) {
						$.data(a, 'cache.tabs', true)
					}
					self._trigger('load', null, self._ui(self.anchors[index], self.panels[index]));
					try {
						o.ajaxOptions.success(r, s)
					} catch(e) {
					}
					self.element.dequeue("tabs")
				}
			}))
		},
		abort : function() {
			this.element.queue([]);
			this.panels.stop(false, true);
			if (this.xhr) {
				this.xhr.abort();
				delete this.xhr
			}
			this._cleanup()
		},
		url : function(index, url) {
			this.anchors.eq(index).removeData('cache.tabs').data('load.tabs', url)
		},
		length : function() {
			return this.anchors.length
		}
	});
	$.extend($.ui.tabs, {
		version : '1.7.2',
		getter : 'length',
		defaults : {
			ajaxOptions : null,
			cache : false,
			cookie : null,
			collapsible : false,
			disabled : [],
			event : 'click',
			fx : null,
			idPrefix : 'ui-tabs-',
			panelTemplate : '<div></div>',
			spinner : '<em>Loading&#8230;</em>',
			tabTemplate : '<li><a href="#{href}"><span>#{label}</span></a></li>'
		}
	});
	$.extend($.ui.tabs.prototype, {
		rotation : null,
		rotate : function(ms, continuing) {
			var self = this, o = this.options;
			var rotate = self._rotate || (self._rotate = function(e) {
				clearTimeout(self.rotation);
				self.rotation = setTimeout(function() {
					var t = o.selected;
					self.select(++t < self.anchors.length ? t : 0)
				}, ms);
				if (e) {
					e.stopPropagation()
				}
			});
			var stop = self._unrotate || (self._unrotate = !continuing ? function(e) {
				if (e.clientX) {
					self.rotate(null)
				}
			} : function(e) {
				t = o.selected;
				rotate()
			});
			if (ms) {
				this.element.bind('tabsshow', rotate);
				this.anchors.bind(o.event + '.tabs', stop);
				rotate()
			} else {
				clearTimeout(self.rotation);
				this.element.unbind('tabsshow', rotate);
				this.anchors.unbind(o.event + '.tabs', stop);
				delete this._rotate;
				delete this._unrotate
			}
		}
	})
})(jQuery);
(function($) {
	$.fn.lightBox = function(settings) {
		settings = jQuery.extend({
			overlayBgColor : '#000',
			overlayOpacity : 0.8,
			fixedNavigation : false,
			imageLoading : 'images/lightbox-ico-loading.gif',
			imageBtnPrev : 'images/lightbox-btn-prev.gif',
			imageBtnNext : 'images/lightbox-btn-next.gif',
			imageBtnClose : 'images/lightbox-btn-close.gif',
			imageBlank : 'images/lightbox-blank.gif',
			containerBorderSize : 10,
			containerResizeSpeed : 400,
			txtImage : 'Image',
			txtOf : 'of',
			keyToClose : 'c',
			keyToPrev : 'p',
			keyToNext : 'n',
			imageArray : [],
			activeImage : 0
		}, settings);
		var jQueryMatchedObj = this;
		function _initialize() {
			_start(this, jQueryMatchedObj);
			return false
		}

		function _start(objClicked, jQueryMatchedObj) {
			$('embed, object, select').css({
				'visibility' : 'hidden'
			});
			_set_interface();
			settings.imageArray.length = 0;
			settings.activeImage = 0;
			if (jQueryMatchedObj.length == 1) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'), objClicked.getAttribute('title')))
			} else {
				for (var i = 0; i < jQueryMatchedObj.length; i++) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'), jQueryMatchedObj[i].getAttribute('title')))
				}
			}
			while (settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href')) {
				settings.activeImage++
			}
			_set_image_to_view()
		}

		function _set_interface() {
			$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"></div></div></div></div>');
			var arrPageSizes = ___getPageSize();
			$('#jquery-overlay').css({
				backgroundColor : settings.overlayBgColor,
				opacity : settings.overlayOpacity,
				width : arrPageSizes[0],
				height : arrPageSizes[1]
			}).fadeIn();
			var arrPageScroll = ___getPageScroll();
			$('#jquery-lightbox').css({
				top : arrPageScroll[1] + (arrPageSizes[3] / 10),
				left : arrPageScroll[0]
			}).show();
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();
			});
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
			$(window).resize(function() {
				var arrPageSizes = ___getPageSize();
				$('#jquery-overlay').css({
					width : arrPageSizes[0],
					height : arrPageSizes[1]
				});
				var arrPageScroll = ___getPageScroll();
				$('#jquery-lightbox').css({
					top : arrPageScroll[1] + (arrPageSizes[3] / 10),
					left : arrPageScroll[0]
				})
			})
		}

		function _set_image_to_view() {
			$('#lightbox-loading').show();
			if (settings.fixedNavigation) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide()
			} else {
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide()
			}
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src', settings.imageArray[settings.activeImage][0]);
				_resize_container_image_box(objImagePreloader.width, objImagePreloader.height);
				objImagePreloader.onload = function() {
				}
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0]
		};
		function _resize_container_image_box(intImageWidth, intImageHeight) {
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2));
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2));
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			$('#lightbox-container-image-box').animate({
				width : intWidth,
				height : intHeight
			}, settings.containerResizeSpeed, function() {
				_show_image()
			});
			if ((intDiffW == 0) && (intDiffH == 0)) {
				if ($.browser.msie) {
					___pause(250)
				} else {
					___pause(100)
				}
			}
			$('#lightbox-container-image-data-box').css({
				width : intImageWidth
			});
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({
				height : intImageHeight + (settings.containerBorderSize * 2)
			})
		};
		function _show_image() {
			$('#lightbox-loading').hide();
			$('#lightbox-image').fadeIn(function() {
				_show_image_data();
				_set_navigation()
			});
			_preload_neighbor_images()
		};
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if (settings.imageArray[settings.activeImage][1]) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show()
			}
			if (settings.imageArray.length > 1) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + (settings.activeImage + 1) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show()
			}
		}

		function _set_navigation() {
			$('#lightbox-nav').show();
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({
				'background' : 'transparent url(' + settings.imageBlank + ') no-repeat'
			});
			if (settings.activeImage != 0) {
				if (settings.fixedNavigation) {
					$('#lightbox-nav-btnPrev').css({
						'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat'
					}).unbind().bind('click', function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false
					})
				} else {
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({
							'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat'
						})
					}, function() {
						$(this).css({
							'background' : 'transparent url(' + settings.imageBlank + ') no-repeat'
						})
					}).show().bind('click', function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false
					})
				}
			}
			if (settings.activeImage != (settings.imageArray.length - 1)) {
				if (settings.fixedNavigation) {
					$('#lightbox-nav-btnNext').css({
						'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat'
					}).unbind().bind('click', function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false
					})
				} else {
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({
							'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat'
						})
					}, function() {
						$(this).css({
							'background' : 'transparent url(' + settings.imageBlank + ') no-repeat'
						})
					}).show().bind('click', function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false
					})
				}
			}
			_enable_keyboard_navigation()
		}

		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent)
			})
		}

		function _disable_keyboard_navigation() {
			$(document).unbind()
		}

		function _keyboard_action(objEvent) {
			if (objEvent == null) {
				keycode = event.keyCode;
				escapeKey = 27
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE
			}
			key = String.fromCharCode(keycode).toLowerCase();
			if ((key == settings.keyToClose) || (key == 'x') || (keycode == escapeKey)) {
				_finish()
			}
			if ((key == settings.keyToPrev) || (keycode == 37)) {
				if (settings.activeImage != 0) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation()
				}
			}
			if ((key == settings.keyToNext) || (keycode == 39)) {
				if (settings.activeImage != (settings.imageArray.length - 1)) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation()
				}
			}
		}

		function _preload_neighbor_images() {
			if ((settings.imageArray.length - 1) > settings.activeImage) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage+1][0]
			}
			if (settings.activeImage > 0) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage-1][0]
			}
		}

		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() {
				$('#jquery-overlay').remove()
			});
			$('embed, object, select').css({
				'visibility' : 'visible'
			})
		}

		function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY
			} else if (document.body.scrollHeight > document.body.offsetHeight) {
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight
			} else {
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {
				if (document.documentElement.clientWidth) {
					windowWidth = document.documentElement.clientWidth
				} else {
					windowWidth = self.innerWidth
				}
				windowHeight = self.innerHeight
			} else if (document.documentElement && document.documentElement.clientHeight) {
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight
			} else if (document.body) {
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight
			}
			if (yScroll < windowHeight) {
				pageHeight = windowHeight
			} else {
				pageHeight = yScroll
			}
			if (xScroll < windowWidth) {
				pageWidth = xScroll
			} else {
				pageWidth = windowWidth
			}
			arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
			return arrayPageSize
		};
		function ___getPageScroll() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset
			} else if (document.documentElement && document.documentElement.scrollTop) {
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft
			} else if (document.body) {
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft
			}
			arrayPageScroll = new Array(xScroll, yScroll);
			return arrayPageScroll
		};
		function ___pause(ms) {
			var date = new Date();
			curDate = null;
			do {
				var curDate = new Date()
			} while(curDate-date<ms)
		};
		return this.unbind('click').click(_initialize)
	}
})(jQuery);
(function($) {
	var types = ['DOMMouseScroll', 'mousewheel'];
	$.event.special.mousewheel = {
		setup : function() {
			if (this.addEventListener)
				for (var i = types.length; i; )
					this.addEventListener(types[--i], handler, false);
			else
				this.onmousewheel = handler
		},
		teardown : function() {
			if (this.removeEventListener)
				for (var i = types.length; i; )
					this.removeEventListener(types[--i], handler, false);
			else
				this.onmousewheel = null
		}
	};
	$.fn.extend({
		mousewheel : function(fn) {
			return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel")
		},
		unmousewheel : function(fn) {
			return this.unbind("mousewheel", fn)
		}
	});
	function handler(event) {
		var args = [].slice.call(arguments, 1), delta = 0, returnValue = true;
		event = $.event.fix(event || window.event);
		event.type = "mousewheel";
		if (event.wheelDelta)
			delta = event.wheelDelta / 120;
		if (event.detail)
			delta = -event.detail / 3;
		args.unshift(event, delta);
		return $.event.handle.apply(this, args)
	}

})(jQuery);
;(function($) {
	var $scrollTo = $.scrollTo = function(target, duration, settings) {
		$(window).scrollTo(target, duration, settings)
	};
	$scrollTo.defaults = {
		axis : 'xy',
		duration : parseFloat($.fn.jquery) >= 1.3 ? 0 : 1
	};
	$scrollTo.window = function(scope) {
		return $(window)._scrollable()
	};
	$.fn._scrollable = function() {
		return this.map(function() {
			var elem = this, isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
			if (!isWin)
				return elem;
			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
			return $.browser.safari || doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement
		})
	};
	$.fn.scrollTo = function(target, duration, settings) {
		if ( typeof duration == 'object') {
			settings = duration;
			duration = 0
		}
		if ( typeof settings == 'function')
			settings = {
				onAfter : settings
			};
		if (target == 'max')
			target = 9e9;
		settings = $.extend({}, $scrollTo.defaults, settings);
		duration = duration || settings.speed || settings.duration;
		settings.queue = settings.queue && settings.axis.length > 1;
		if (settings.queue)
			duration /= 2;
		settings.offset = both(settings.offset);
		settings.over = both(settings.over);
		return this._scrollable().each(function() {
			var elem = this, $elem = $(elem), targ = target, toff, attr = {}, win = $elem.is('html,body');
			switch(typeof targ) {
				case'number':
				case'string':
					if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
						targ = both(targ);
						break
					}
					targ = $(targ, this);
				case'object':
					if (targ.is || targ.style)
						toff = ( targ = $(targ)).offset()
			}
			$.each(settings.axis.split(''), function(i, axis) {
				var Pos = axis == 'x' ? 'Left' : 'Top', pos = Pos.toLowerCase(), key = 'scroll' + Pos, old = elem[key], max = $scrollTo.max(elem, axis);
				if (toff) {
					attr[key] = toff[pos] + ( win ? 0 : old - $elem.offset()[pos]);
					if (settings.margin) {
						attr[key] -= parseInt(targ.css('margin' + Pos)) || 0;
						attr[key] -= parseInt(targ.css('border' + Pos + 'Width')) || 0
					}
					attr[key] += settings.offset[pos] || 0;
					if (settings.over[pos])
						attr[key] += targ[axis=='x'?'width':'height']() * settings.over[pos]
				} else {
					var val = targ[pos];
					attr[key] = val.slice && val.slice(-1) == '%' ? parseFloat(val) / 100 * max : val
				}
				if (/^\d+$/.test(attr[key]))
					attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
				if (!i && settings.queue) {
					if (old != attr[key])
						animate(settings.onAfterFirst);
					delete attr[key]
				}
			});
			animate(settings.onAfter);
			function animate(callback) {
				$elem.animate(attr, duration, settings.easing, callback &&
				function() {
					callback.call(this, target, settings)
				})

			}

		}).end()
	};
	$scrollTo.max = function(elem, axis) {
		var Dim = axis == 'x' ? 'Width' : 'Height', scroll = 'scroll' + Dim;
		if (!$(elem).is('html,body'))
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();
		var size = 'client' + Dim, html = elem.ownerDocument.documentElement, body = elem.ownerDocument.body;
		return Math.max(html[scroll], body[scroll]) - Math.min(html[size], body[size])
	};
	function both(val) {
		return typeof val == 'object' ? val : {
			top : val,
			left : val
		}
	}

})(jQuery);
;(function($) {
	$.oSlideshow = function(options) {
		$.extend($.oSlideshow.conf, options || {});
		this.oImage = ($.oSlideshow.conf['imageContSelector']) ? $($.oSlideshow.conf['imageContSelector']) : {};
		this.oTitle = ($.oSlideshow.conf['titleContSelector']) ? $($.oSlideshow.conf['titleContSelector']) : {};
		this.oText = ($.oSlideshow.conf['textContSelector']) ? $($.oSlideshow.conf['textContSelector']) : {};
		this.aData = [];
		this.iCurrentIndex = 0;
		this.iMaxIndex = 0;
		this.intervalId = null;
		this.init()
	};
	$.oSlideshow.conf = {
		'imageContSelector' : '.obj-photoreports-image',
		'titleContSelector' : '.obj-photoreports-desc h2',
		'textContSelector' : '.obj-photoreports-desc p',
		'switcherItemSelector' : '.obj-photoreports-item',
		'activeClassName' : 'active',
		'slideshow' : true,
		'interval' : 5000,
		'duration' : 500
	};
	$.oSlideshow.prototype.init = function() {
		var oSelf = this;
		$($.oSlideshow.conf['switcherItemSelector']).each(function(i) {
			var oImg = $(this).find('img'), oLink = $(this), sImage = oLink.attr('href'), sTitle = oImg.attr('alt'), sText = oLink.attr('title');
			oSelf.aData[i] = {
				'image' : sImage,
				'title' : sTitle,
				'text' : sText
			};
			oImg.click(function() {
				oSelf.setActiveItem(i);
				if (true == $.oSlideshow.conf['slideshow']) {
					if (null != oSelf.intervalId) {
						clearInterval(oSelf.intervalId)
					}
					oSelf.intervalId = setInterval(function() {
						oSelf.showNextItem()
					}, $.oSlideshow.conf['interval'])
				}
				return false
			})
		});
		oSelf.iMaxIndex = oSelf.aData.length - 1;
		if (true == $.oSlideshow.conf['slideshow']) {
			oSelf.intervalId = setInterval(function() {
				oSelf.showNextItem()
			}, $.oSlideshow.conf['interval'])
		}
	};
	$.oSlideshow.prototype.showNextItem = function() {
		this.iCurrentIndex++;
		if (this.iCurrentIndex > this.iMaxIndex) {
			this.iCurrentIndex = 0
		}
		this.setActiveItem(this.iCurrentIndex)
	};
	$.oSlideshow.prototype.setActiveItem = function(num) {
		$($.oSlideshow.conf['switcherItemSelector']).removeClass($.oSlideshow.conf['activeClassName']);
		$($.oSlideshow.conf['switcherItemSelector']).eq(num).addClass($.oSlideshow.conf['activeClassName']);
		this.oImage.prepend('<img src="' + this.aData[num].image + '" />').find('img:eq(1)').fadeOut($.oSlideshow.conf['duration'], function() {
			$(this).remove()
		});
		this.oTitle.text(this.aData[num].title);
		this.oText.text(this.aData[num].text);
		this.iCurrentIndex = num
	};
	$.fn.extend({
		slideshow : function(options) {
			new $.oSlideshow(options)
		}
	})
})(jQuery);
var globalWeighingGuide = '';
var globalWeighingPriceElementId = 0;
var globalWeighingElementId = 0;
var globalWeighingValue = 0;
var globalWeighingCount = 0;
var globalWeighingData = {
	guide : '',
	priceElementId : 0,
	elementId : 0,
	weight : 0,
	count : 0
};
var globalUpdateInterval = null;
var globalWeighingDimentions = {};
var globalWeighingVesKg = {};
function calc1WeighingAjaxRequest() {
	if (undefined == globalWeighingGuide)
		return false;
	var url = '/bitrix/templates/trimet/ajax/calculator_1.php';
	var data = calc1GetWeighingData(globalWeighingGuide);
	if (!parseFloat($.trim(data.weight)) && !parseFloat($.trim(data.count)) && !parseFloat($.trim(data.length))) {
		return false
	}
	calc1ToggleWeighingLoader(true);
	$.post(url, data, function(response) {
		response = eval('(' + response + ')');
		if (undefined != response.error) {
		} else if (undefined != response.nothing) {
		} else {
			if (undefined != response.guide) {
				calc1SelectGuide(response.guide)
			} else {
				calc1SelectGuide(data.guide)
			}
			globalWeighingData['weight'] = response.weight;
			globalWeighingData['count'] = response.count;
			globalWeighingData['priceElementId'] = response.element;
			globalWeighingData['elementId'] = response.dimention;
			globalWeighingData['canCut'] = parseFloat(response.length) ? 1 : 0;
			calc1UpdateValues(response);
			calc1UpdatePrice(response);
			calc2UpdateFromWeighingCalc()
		}
		$('#calc-1-ton').change();
		if (parseFloat($('#calc-1-ton').val())) {
			$('#weighing-calc-add-to-cart').removeAttr('disabled')
		}
		calc1ToggleWeighingLoader(false);
		manualCalcCut_updateLimits();
		return true
	});
	return true
}

function calc1GetWeighingData(g) {
	if (undefined == g || null == g)
		return false;
	return {
		dimention : $('#calc-1-dim').val(),
		length : $('#calc-1-met').val().replace(/[\,]/, '.'),
		count : $('#calc-1-pie').val().replace(/[\,]/, '.'),
		weight : $('#calc-1-ton').val().replace(/[\,]/, '.'),
		guide : g
	}
}

function calc1UpdateValues(data) {
	if (undefined == data || null == data)
		return false;
	$('#calc-1-met').val(data.length);
	$('#calc-1-pie').val(data.count);
	$('#calc-1-ton').val(data.weight);
	return true
}

function calc1UpdatePrice(data) {
	if (undefined == data || null == data)
		return false;
	$('#calc-1-pri2').text(data.price + ' руб.');
	$('#calc-1-pri').html(data.price + ' <span>руб.</span>');
	return true
}

function calc1ToggleWeighingLoader(show) {
	if (undefined == show)
		return false;
	if (show) {
		$('#calc-weighing-loader').show()
	} else {
		$('#calc-weighing-loader').hide()
	}
	return true
}

function calc1SelectGuide(guide) {
	if (undefined == guide || null == guide) {
		return false
	}
	$('#calc-1-met, #calc-1-ton, #calc-1-pie').removeClass('guide');
	if ('length' == guide) {
		$('#calc-1-met').addClass('guide')
	} else if ('count' == guide) {
		$('#calc-1-pie').addClass('guide')
	} else if ('weight' == guide) {
		$('#calc-1-ton').addClass('guide')
	}
	return true
}

function weighingCalcCheckSizeless() {
	var t = parseInt($('#calc-1-dim option:selected').val()), metr = $('#calc-1-met')[0], shtuk = $('#calc-1-pie')[0];
	if (!metr || !shtuk) {
		return
	}
	metr.disabled = (undefined == globalWeighingDimentions[t] || !parseFloat(globalWeighingDimentions[t])) ? true : false;
	shtuk.disabled = (undefined == globalWeighingVesKg[t] || !parseFloat(globalWeighingVesKg[t])) ? true : false;
	var b = (metr.disabled && shtuk.disabled);
	$('#calc1-calculate-button')[0].disabled = b;
	$('#weighing-calc-add-to-cart')[0].disabled = (!b || (b && !parseFloat($('#calc-1-ton').val())))
}

function weighingAutoUpdate() {
	if ($('#calc-1-met')[0].disabled && $('#calc-1-pie')[0].disabled) {
		return
	}
	if (undefined != globalUpdateInterval) {
		clearInterval(globalUpdateInterval)
	}
	globalUpdateInterval = setInterval(function() {
		calc1WeighingAjaxRequest();
		clearInterval(globalUpdateInterval)
	}, 1000)
}

function weighingCalcGetDimentions() {
	var dimentions = $('#weighingcalc-dimentions').text();
	var i, pair, tmp = dimentions.split(';'), tmp2;
	for ( i = 0; i < tmp.length; ++i) {
		pair = $.trim(tmp[i]);
		if (pair) {
			tmp2 = pair.split(':');
			globalWeighingDimentions[tmp2[0]] = tmp2[1]
		}
	}
	var vesKg = $('#weighingcalc-ves-kg').text();
	tmp = vesKg.split(';');
	for ( i = 0; i < tmp.length; ++i) {
		pair = $.trim(tmp[i]);
		if (pair) {
			tmp2 = pair.split(':');
			globalWeighingVesKg[tmp2[0]] = tmp2[1]
		}
	}
}

function calc2UpdateFromWeighingCalc() {
	var typeCount = $('.add-size-item').length;
	var typeContent = $.trim($('.add-size-item .add-size-scheme-field').val());
	if (1 == typeCount && '' == typeContent) {
		if (undefined != globalWeighingData['count'] && undefined != globalWeighingData['elementId'] && globalWeighingData['count'] > 0 && globalWeighingData['elementId'] > 0 && globalWeighingData['canCut']) {
			var id = $('.add-size-item').attr('id').substr(16);
			$('#add-size-count-t' + id).val(globalWeighingData['count']);
			$('#add-size-types-t' + id + ' li').removeClass('active');
			var active = $('#add-size-types-t' + id + ' li a[href=#' + globalWeighingData['elementId'] + ']');
			active.parent().addClass('active');
			var detailDimention = parseFloat(globalManualCalcDimentions[globalWeighingData['elementId']]);
			$('#add-size-graphic-remain-t' + id + ' span').text(detailDimention)
		}
	}
}

var globalObjectCuttingType = {};
var globalCuttingElements = {};
var globalCatalogElementData = {};
var globalCatalogCuttingData = {};
var globalCatalogCutTypeCount = {};
function calc2AddAutoItem(size, count) {
	var html = calc2GenNewAutoHtml(calc2GetLastId() + 1, size, count);
	$('#auto-content-place').append(html);
	return true
}

function calc2RemoveAutoItem() {
	if ($('#auto-content-place .auto-sc').length < 2) {
		return false
	}
	var id = parseInt($('#auto-content-place .auto-sc:last').attr('id').substr(8));
	$('#auto-content-place #auto-sc-' + id).remove();
	return false
}

function calc2GetLastId() {
	var id = $('#auto-content-place .auto-sc:last').attr('id');
	id = (null == id || undefined == id) ? 0 : id.substr(8);
	return parseInt(id)
}

function calc2GenNewAutoHtml(id, size, count) {
	if (undefined == id || null == id || '' == id) {
		return false
	}
	size = (undefined == size) ? 0 : parseFloat(size);
	count = (undefined == count) ? 0 : parseInt(count);
	var newAutoHtml;
	var c = (id % 2) ? '' : ' odd';
	newAutoHtml = '<tr id="auto-sc-' + id + '" class="auto-sc' + c + '">';
	newAutoHtml += '<td><input type="text" name="auto-sc-c' + id + '" id="auto-sc-c' + id + '" maxlength="12" value="' + count + '" /></td>';
	newAutoHtml += '<td><input type="text" name="auto-sc-s' + id + '" id="auto-sc-s' + id + '" maxlength="12" value="' + size + '" /></td></tr>';
	return newAutoHtml
}

function calc2GetAutoItemsData() {
	var d = {};
	var tmpData = {};
	var totalBefore = $('#auto-content-place .auto-sc').length;
	var totalAfter = 0;
	$('#auto-content-place .auto-sc').each(function() {
		var id = $(this).attr('id').substr(8);
		var c = parseInt($('#auto-sc-c' + id).val());
		var s = parseFloat($('#auto-sc-s' + id).val().replace(/[\,]/, '.'));
		if (c && s) {++totalAfter;
			if (undefined == tmpData[s]) {
				tmpData[s] = 0
			}
			tmpData[s] += c
		}
	});
	if (0 == totalAfter) {
		tmpData = {
			0 : '0'
		};
		showError('#auto-calculate-button', 'Проверьте правильность указаных значений количества и длины', true)
	} else if (totalBefore != totalAfter) {
		showError('#auto-calculate-button', 'Внимание! Некоторые значения оказались пустыми и были убраны из потребности', true)
	}
	$('#auto-content-place tr').remove();
	var html = '';
	var iterator = 0;
	for (var i in tmpData) {++iterator;
		html += calc2GenNewAutoHtml(iterator, i, tmpData[i]);
		if (parseInt(tmpData[i]) && parseFloat(i)) {
			d['auto-sc-' + iterator] = {};
			d['auto-sc-'+iterator][tmpData[i]] = i
		}
	}
	$('#auto-content-place').append(html);
	$('.auto-sc input').unbind('click').click(function() {
		$(this).select()
	}).unbind('change').change(function() {
		$('#auto-add-to-cart').attr({
			disabled : 'disabled'
		})
	});
	return d
}

function calc2AutoAjaxRequest(url, data) {
	if (undefined == url || null == url || '' == url) {
		return false
	}
	$('#calc2-auto-loader').show();
	$('#auto-calculate-button').attr({
		disabled : 'disabled'
	});
	$.post(url, data, function(inCart) {
		inCart = eval('(' + inCart + ')');
		$('#ajax-auto-result').html('');
		if (undefined != inCart.nothing) {
		} else if (undefined != inCart.error) {
			showError('#auto-add-to-cart', inCart.error)
		} else {
			globalCuttingElements = inCart.cuttingElement;
			globalCatalogElementData = inCart.elementData;
			globalCatalogCuttingData = inCart.cuttingData;
			globalCatalogCutTypeCount = inCart.cutTypeCount;
			$('#ajax-auto-result').html(inCart.result);
			calc2UpdateAutoPrice(inCart.price, inCart.priceTip);
			calc2UpdateAutoHandlers();
			if (inCart.canAdd) {
				$('#auto-add-to-cart').removeAttr('disabled')
			} else {
				$('#auto-add-to-cart').attr({
					disabled : 'disabled'
				})
			}
			if (undefined != inCart.showCanAddError) {
				showError('#auto-add-to-cart', inCart.showCanAddError)
			}
		}
		$('#calc2-auto-loader').hide();
		$('#auto-calculate-button').removeAttr('disabled')
	});
	return false
}

function calc2UpdateAutoHandlers() {
	$('.auto-cutres-selector').unbind('click');
	$('.auto-cutres-selector').click(function() {
		calc2UpdateAutoPrice(calc2GetAutoSum(), calc2GetAutoSumTip($(this).val(), $(this).attr('id').substr(12)))
	})
}

function calc2GetAutoSumTip(cuttingElementId, id) {
	var sum = '';
	if (undefined != globalCuttingElements && undefined != globalCatalogElementData) {
		sum = priceFormat(parseFloat(globalCatalogElementData[globalCuttingElements[cuttingElementId]]['price']), 1) + ' руб.';
		sum += ' + ' + priceFormat(parseFloat($('#auto-cutres-price #auto-cutres-price-' + id).text()), 1) + ' руб.'
	}
	return sum
}

function calc2GetAutoSum() {
	var sum = 0;
	$('.auto-cutres-selector:checked').each(function() {
		var id = $(this).attr('id').substr(12);
		sum += parseFloat($('#auto-cutres-price #auto-cutres-price-' + id).text());
		if (undefined != globalCuttingElements && undefined != globalCatalogElementData) {
			sum += parseFloat(globalCatalogElementData[globalCuttingElements[$(this).val()]]['price'])
		}
	});
	return sum
}

function calc2UpdateAutoPrice(price, tip) {
	if (0 == price) {
		$('#calc-auto-price').html('0 <span>руб.</span>');
		$('#calc-auto-title-price').html('0 руб.')
	} else {
		var tipText = '';
		if (undefined != tip || null != tip) {
			tipText = '<span id="auto-result-tip">' + tip + '</span>'
		}
		$('#calc-auto-price').html(priceFormat(price) + ' <span>руб.</span>' + tipText);
		$('#calc-auto-title-price').html(priceFormat(price) + ' руб.')
	}
}

function calc2GetAutoOrderData() {
	var result = {
		cart : {},
		check : []
	};
	$('#ajax-auto-result .auto-cutres-selector:checked').each(function() {
		var id = parseInt($(this).val());
		var prefix = $(this).attr('id').substr(12);
		var cutting = $.trim($('#auto-cutres-data #auto-cutres-data-' + prefix).text());
		if (undefined == result['cart'][id]) {
			result['cart'][id] = cutting
		} else {
			result['cart'][id] += '|' + cutting
		}
		if (undefined != globalCuttingElements && undefined != globalCatalogElementData) {
			result['check'].push(globalCatalogElementData[globalCuttingElements[id]]['element'])
		}
	});
	return result
}

function calc2BlockAutoControls(block) {
	if (undefined == block || null == block) {
		block = true
	}
	if (block) {
		$('#auto-add-to-cart').attr({
			disabled : 'disabled'
		});
		$('#auto-calculate-button').attr({
			disabled : 'disabled'
		});
		$('.auto-cutres-selector').attr({
			disabled : 'disabled'
		})
	} else {
		$('#auto-add-to-cart').removeAttr('disabled');
		$('#auto-calculate-button').removeAttr('disabled');
		$('.auto-cutres-selector:not(.auto-disabled)').removeAttr('disabled')
	}
}

function calc2HideAutoResult() {
	if ($('#ajax-auto-result').html().length > 0) {
		$('#ajax-auto-result').html('');
		calc2UpdateAutoPrice(0)
	}
}

function calc2CompareOrderAndCart(toCart, inCart) {
	if (undefined == toCart || null == toCart || undefined == inCart || null == inCart) {
		return false
	}
	var result = [];
	for (var i in toCart) {
		if (undefined != globalCuttingElements && undefined != globalCatalogElementData) {
			var cutElement = globalCuttingElements[i];
			var catalogElement = globalCatalogElementData[globalCuttingElements[i]]['element'];
			var updateToCart = parseInt(globalCatalogElementData[globalCuttingElements[i]]['count']);
			if (undefined != inCart[catalogElement]) {
				var availableInCart = parseInt(inCart[catalogElement]);
				if (availableInCart - updateToCart < 0) {
					result.push({
						cutId : cutElement,
						elementId : globalCatalogElementData[cutElement]['element'],
						count : updateToCart - availableInCart
					})
				}
			} else {
				result.push({
					cutId : cutElement,
					elementId : globalCatalogElementData[cutElement]['element'],
					count : updateToCart
				})
			}
		}
	}
	return result
}

function priceFormat(price, showEmptyDecimal) {
	price = parseFloat(price);
	function isRound(n) {
		return String(n).length === String(Math.round(n)).length
	}
	return $().number_format(price, {
		numberOfDecimals : (showEmptyDecimal || !isRound(price)) ? 2 : 0,
		decimalSeparator : '.',
		thousandSeparator : '\u00a0'
	})
}

var globalManualCalcSizeTypes = {};
var globalManualCalcPriceIdDimention = {};
var globalManualCalcDimentions = {};
var globalManualCalcCut_maxCount = {};
function manualCalcParseSizeTypes() {
	var id = $('#manual-content-place .add-size-item:first').attr('id').substr(16);
	$('#add-size-types-t' + id + ' a').each(function() {
		var tmp = $(this).attr('href').split('#')[1];
		var dimention = parseFloat(globalManualCalcDimentions[tmp]);
		globalManualCalcSizeTypes[$(this).attr('class')] = {
			dimention : dimention,
			text : $(this).text(),
			href : $(this).attr('href')
		}
	})
}

function manualCalcUpdateProgress(progressArray, contentId) {
	$('#add-size-graphic-t' + contentId + ' span').remove();
	var detailWidth = $('#add-size-graphic-t' + contentId).width();
	var tmp = $('#add-size-types-t'+contentId+' .active a').attr('href').split('#')[1];
	var detailDimention = parseFloat(globalManualCalcDimentions[tmp]);
	var detailBaseWidth = Math.floor(round(detailWidth / detailDimention)) - 2;
	var cutMargin = 2;
	var i;
	var c = progressArray.length;
	var totalDimention = 0;
	var totalWidth = 0;
	for ( i = 0; i < c; i++) {
		var cutDimention = parseFloat(progressArray[i]);
		var cutWidth = round(cutDimention * detailBaseWidth);
		totalDimention = round(totalDimention + cutDimention);
		if (totalDimention == detailDimention) {
			cutWidth = round(detailWidth - totalWidth);
			totalWidth = round(totalWidth + cutWidth)
		} else {
			totalWidth = round(totalWidth + cutWidth + cutMargin)
		}
		var style = 'style="width: ' + cutWidth + 'px"';
		var last = (i == c - 1) ? ' class="last"' : '';
		$('#add-size-graphic-t' + contentId).append('<span' + last + ' ' + style + '><em>' + cutDimention + '&nbsp;м</em></span>')
	}
	var remainVal = round(detailDimention - totalDimention), $remain = $('#add-size-graphic-remain-t' + contentId);
	$('span', $remain).text(remainVal);
	if (remainVal > 0 && totalWidth > 0) {
		$('em', $remain).show();
		var remainWidth = $remain.width();
		if (!((remainWidth + 30) < (detailWidth - totalWidth))) {
			$('em', $remain).hide();
			remainWidth = $remain.width()
		}
		$remain.show().css({
			left : (totalWidth + (detailWidth - totalWidth) / 2 - remainWidth / 2) + 'px'
		})
	} else {
		$remain.hide()
	}
}

function manualCalcParseInputContent(inputContent, options) {
	var schemeArray = inputContent.split(';');
	var newSchemeArray = [];
	var detailDimention = 0;
	var error = '';
	var i;
	if (undefined != options.dimention) {
		detailDimention = parseFloat(options.dimention)
	} else {
		var tmp = $('#add-size-types-t'+options.id+' .active a').attr('href').split('#')[1];
		detailDimention = parseFloat(globalManualCalcDimentions[tmp])
	}
	var totalDimention = 0;
	for ( i = 0; i < schemeArray.length; i++) {
		var schemeCut = $.trim(schemeArray[i]);
		if (schemeCut) {
			var schemeCutArray = schemeCut.match(/([0-9]+(?:(?:\.|\,)[0-9]+)?)/g);
			if (null !== schemeCutArray && schemeCutArray.length > 0) {
				var cutDimention = parseFloat(round(schemeCutArray[0].replace(/[\,]/, '.')));
				if (0 == cutDimention) {
					continue
				}
				if (round(totalDimention + cutDimention) > detailDimention) {
					error = 'Мерность не позволяет произвести желаемые резы';
					break
				}
				totalDimention = round(totalDimention + cutDimention);
				newSchemeArray.push(cutDimention)
			}
		}
	}
	return {
		scheme : newSchemeArray,
		error : error
	}
}

function manualCalcCreateNewTypeSize() {
	var id = parseInt($('.add-size-item:last').attr('id').substr(16)) + 1;
	var num = parseInt($('.add-size-item:last .add-size-number').text()) + 1;
	var dimention = getSizeTypeDimention();
	var dimCountSum = 0;
	$('div.add-size-item').each(function() {
		var sizeId = $('li[class*=active] a',this).attr('href').split('#')[1], count = parseInt($('input.add-size-count', this).val(), 10);
		if (sizeId != dimention.firstId) {
			return
		}
		dimCountSum += count
	});
	var maxCount = globalManualCalcCut_maxCount;
	var count = (dimention.firstId in maxCount && dimCountSum == maxCount[dimention.firstId]) ? 0 : 1;
	var html = '<div class="add-size-item" id="manual-content-t' + id + '">' + '<div class="add-size-header"><ul class="add-size-types" id="add-size-types-t' + id + '">' + dimention.html + '</ul>' + '<p><span id="add-size-number-t' + id + '" class="add-size-number">' + num + '</span>. Резка типоразмера</p>' + '<div class="clear">&nbsp;</div></div>' + '<table class="add-size-fields"><tbody><tr>' + '<td class="add-size-scheme"><input autocomplete="off" type="text" id="add-size-scheme-t' + id + '" class="add-size-scheme-field" name="manual-scheme" value="" title="" /></td>' + '<td>×&nbsp;<input autocomplete="off" type="text" class="add-size-count" id="add-size-count-t' + id + '" name="manual-count" value="' + count + '" />&nbsp;шт.</td></tr></tbody></table>' + '<div class="add-size-graphic"><div class="add-size-graphic-blocks" id="add-size-graphic-t' + id + '"></div>' + '<div id="add-size-graphic-remain-t' + id + '" class="none add-size-graphic-remain"><span>' + dimention.first + '</span>&nbsp;м<em>&nbsp;остаток</em></div>' + '<div class="clear">&nbsp;</div></div></div>';
	return html
}

function getSizeTypeDimention() {
	var result = {
		html : '',
		first : 0,
		firstId : ''
	};
	if ('object' !== typeof globalManualCalcSizeTypes) {
		return result
	}
	var k, id, clas, wasActive = false, maxCount = globalManualCalcCut_maxCount;
	for (k in globalManualCalcSizeTypes) {
		id = globalManualCalcSizeTypes[k].href.split('#')[1];
		if ( id in maxCount && 0 == maxCount[id]) {
			clas = ' class="none"'
		} else if (!wasActive) {
			wasActive = true;
			clas = ' class="active"';
			result.first = globalManualCalcSizeTypes[k].dimention;
			result.firstId = id
		} else {
			clas = ''
		}
		result.html += '<li' + clas + '>' + '<a class="' + k + '" ' + 'href="' + globalManualCalcSizeTypes[k].href + '">' + globalManualCalcSizeTypes[k].text + '</a></li>'
	}
	return result
}

function manualCalcUpdateSizeTypeHandlers() {
	var fn = arguments.callee;
	if (!('wasCall' in fn)) {
		fn.wasCall = true;
		fn.trace = ('console' in window) ? function() {
			console.log.apply(console, ['[manualCalcUpdateSizeTypeHandlers]'].concat([].slice.call(arguments)))
		} : function() {
		}
	}
	var t = fn.trace;
	$('.add-size-types a').unbind('click').click(function() {
		var curSizeId = $(this).attr('href').split('#')[1], maxCount = globalManualCalcCut_maxCount, countInput = $(this).parents('div.add-size-item').find('input.add-size-count')[0], countSum = parseInt(countInput.value, 10);
		$('div.add-size-item').each(function() {
			var sizeId = $('li[class*=active] a',this).attr('href').split('#')[1], count = parseInt($('input.add-size-count', this).val(), 10);
			t('sizeId:', sizeId, 'count:', count);
			if (sizeId != curSizeId) {
				return
			}
			countSum += count
		});
		t('curSizeId:', curSizeId, 'countSum:', countSum, 'maxCount:', maxCount, 'countInput:', countInput);
		if (countSum > maxCount[curSizeId]) {
			countInput.value -= countSum - maxCount[curSizeId];
			if (countInput.value < 0) {
				countInput.value = 0
			}
		}
		if ($(this).parent().hasClass('active')) {
			return false
		}
		var sizeContainerId = $(this).parent().parent().attr('id');
		var id = sizeContainerId.substr(16);
		var typeSize = $(this).attr('href').split('#')[1];
		typeSize = parseFloat(globalManualCalcDimentions[typeSize]);
		var scheme = $.trim($('#add-size-scheme-t' + id).val());
		if (!scheme) {
			$('#' + sizeContainerId + ' .active').removeClass('active');
			$(this).parent().addClass('active');
			$('#add-size-graphic-remain-t' + id + ' span').text(typeSize)
		} else {
			var parseResult = manualCalcParseInputContent(scheme, {
				dimention : typeSize
			});
			if ('' != parseResult.error) {
				showError('#manual-add-to-cart', parseResult.error)
			} else {
				$('#' + sizeContainerId + ' .active').removeClass('active');
				$(this).parent().addClass('active');
				manualCalcUpdateProgress(parseResult.scheme, id)
			}
			manualCalcCalculate()
		}
		return false
	}).unbind('change').change(function() {
		$('#manual-add-to-cart').attr({
			disabled : 'disabled'
		})
	});
	$('.add-size-scheme-field').unbind('keyup').keyup(function(event) {
		if (32 == event.keyCode || 59 == event.keyCode) {
			manualCalcUpdateScheme($(this))
		}
		if (8 == event.keyCode || 46 == event.keyCode) {
			if (!$(this).val()) {
				manualCalcUpdateProgress([], $(this).attr('id').substr(17))
			}
		}
	}).unbind('focus').focus(function() {
		var id = $(this).attr('id').substr(17);
		$('#manual-content-t' + id).addClass('active')
	}).unbind('blur').blur(function() {
		var id = $(this).attr('id').substr(17);
		$('#manual-content-t' + id).removeClass('active')
	}).unbind('change').change(function() {
		$('#manual-add-to-cart').attr({
			disabled : 'disabled'
		});
		var id = $(this).attr('id').substr(17);
		manualCalcAutoUpdateResult(id);
		return false
	});
	$('.add-size-count').unbind('click').click(function() {
		$(this).select()
	}).unbind('change').change(function() {
		$('#manual-add-to-cart').attr({
			disabled : 'disabled'
		});
		var id = $(this).attr('id').substr(16);
		manualCalcAutoUpdateResult(id);
		return false
	})
}

function manualCalcGetItemsData() {
	var data = {};
	$('.add-size-item').each(function() {
		var id = $(this).attr('id').substr(16);
		var count = parseInt($('#add-size-count-t' + id).val());
		var scheme = $.trim($('#add-size-scheme-t' + id).val());
		var dimention = $('#add-size-types-t'+id+' .active a',this).attr('href').split('#')[1];
		if (count && scheme) {
			data[$(this).attr('id')] = {
				dimention : dimention,
				count : count,
				scheme : scheme
			}
		}
	});
	return data
}

function manualCalcCalculateAjaxRequest(url, data) {
	if (undefined == url || null == url || '' == url) {
		return false
	}
	$('#calc2-manual-loader').show();
	$.post(url, data, function(inCart) {
		inCart = eval('(' + inCart + ')');
		$('#ajax-manual-result').html('');
		if (undefined != inCart.nothing) {
		} else if (undefined != inCart.error) {
			if ('empty' == inCart.error) {
				manualCalcUpdatePrice(0)
			}
			if ('nocuts' == inCart.error) {
				showError('#manual-add-to-cart', 'Ваша потребность не содержит резов');
				manualCalcUpdatePrice(0)
			}
		} else {
			globalObjectCuttingType = inCart.cutting;
			globalManualCalcPriceIdDimention = inCart.priceDimention;
			$('#ajax-manual-result').html(inCart.result);
			manualCalcUpdatePrice(inCart.price);
			manualCalcUpdateManualResultHandlers();
			$('#manual-add-to-cart').removeAttr('disabled')
		}
		$('#calc2-manual-loader').hide()
	});
	return false
}

function manualCalcUpdateManualResultHandlers() {
	$('#ajax-manual-result .manual-cutres-selector').unbind('click').click(function() {
		manualCalcUpdatePrice(manualCalcGetSum())
	})
}

function manualCalcGetSum() {
	var sum = 0;
	$('#calc-manual-rescuts .manual-cutres-selector:checked').each(function() {
		var id = $(this).attr('id').substr(14);
		sum += parseFloat($('#manual-cutres-price #manual-cutres-price-' + id).text())
	});
	return sum
}

function manualCalcUpdatePrice(price) {
	if (0 == price) {
		$('#calc-manual-price').html('0 <span>руб.</span>');
		$('#calc-manual-title-price').html('0 руб.')
	} else {
		$('#calc-manual-price').html(priceFormat(price) + ' <span>руб.</span>');
		$('#calc-manual-title-price').html(priceFormat(price) + ' руб.')
	}
}

function manualCalcGetOrderData() {
	var result = {
		cart : {},
		check : []
	};
	$('#ajax-manual-result .manual-cutres-selector:checked').each(function() {
		var id = parseInt($(this).val());
		var dataId = $(this).attr('id').substr(14);
		var cutting = $.trim($('#manual-cutres-data #manual-cutres-data-' + dataId).text());
		if (undefined == result['cart'][id]) {
			result['cart'][id] = cutting
		} else {
			result['cart'][id] += '|' + cutting
		}
		result['check'].push(globalManualCalcPriceIdDimention[id])
	});
	return result
}

function manualCalcCompareOrderAndCart(toCart, inCart) {
	if (undefined == toCart || null == toCart || undefined == inCart || null == inCart) {
		return false
	}
	var result = [];
	for (var i in toCart) {
		if (undefined != globalObjectCuttingType[i]) {
			for (var j in globalObjectCuttingType[i]['item']) {
				var updateToCart = parseInt(globalObjectCuttingType[i]['item'][j]);
				if (undefined != inCart[j]) {
					var availableInCart = parseInt(inCart[j]);
					if (availableInCart - updateToCart < 0) {
						result.push({
							name : globalObjectCuttingType[i]['catalogElementName'],
							count : updateToCart - availableInCart
						})
					}
				} else {
					result.push({
						name : globalObjectCuttingType[i]['catalogElementName'],
						count : updateToCart
					})
				}
			}
		}
	}
	return result
}

function manualCalcUpdateScheme(obj) {
	var id = $(obj).attr('id').substr(17);
	var schemeValue = $(obj).val();
	var parseResult = manualCalcParseInputContent(schemeValue, {
		id : id
	});
	var newSchemeArray = parseResult.scheme;
	var result = '';
	for (var i = 0; i < newSchemeArray.length; i++) {
		result += newSchemeArray[i] + '; '
	}
	$(obj).val(result);
	manualCalcUpdateProgress(newSchemeArray, id)
}

function manualCalcAutoUpdateResult(id) {
	var scheme = $.trim($('#add-size-scheme-t' + id).val());
	var typeSize = $('#add-size-types-t'+id+' .active a').attr('href').split('#')[1];
	typeSize = parseFloat(globalManualCalcDimentions[typeSize]);
	if (scheme) {
		var parseResult = manualCalcParseInputContent(scheme, {
			dimention : typeSize
		});
		if ('' != parseResult.error) {
			showError('#manual-add-to-cart', parseResult.error)
		} else {
			manualCalcUpdateProgress(parseResult.scheme, id)
		}
		manualCalcCalculate()
	}
}

function manualCalcCalculate() {
	$('#manual-add-to-cart').attr({
		disabled : 'disabled'
	});
	var p = $('#manual-ajax-path').val();
	var a = $('#manual-ajax-article').val();
	var d = manualCalcGetItemsData();
	manualCalcCalculateAjaxRequest(p, {
		data : d,
		article : a
	})
}

function manualCalcGetDimentions() {
	var dimentions = $('#manualcalc-dimentions').text();
	var i, tmp = dimentions.split(';');
	for ( i = 0; i < tmp.length; ++i) {
		var pair = $.trim(tmp[i]);
		if (pair) {
			var tmp2 = pair.split(':');
			globalManualCalcDimentions[tmp2[0]] = tmp2[1]
		}
	}
}

function manualCalcCut_updateLimits() {
	var k;
	var fn = arguments.callee;
	if (!('wasCall' in fn)) {
		fn.wasCall = true;
		fn.trace = ('console' in window) ? function() {
			console.log.apply(console, ['[manualCalcCut_updateLimits]'].concat([].slice.call(arguments)))
		} : function() {
		};
		fn.trace('pageData.elKratnostEd:', pageData.elKratnostEd);
		fn.$loader = $('#calc2-manual-loader');
		fn.showLoader = function() {
			fn.$loader.removeClass('none')
		};
		fn.hideLoader = function() {
			fn.$loader.addClass('none')
		};
		fn.elIds = [];
		for (k in pageData.elKratnostEd) {
			fn.elIds.push(k)
		}
		fn.requestNotCut = function(onComplete) {
			fn.showLoader();
			$.post('/bitrix/templates/trimet/ajax/basket_not_cut_count.php', {
				id : fn.elIds
			}, function(data) {
				fn.hideLoader();
				onComplete(eval('(' + data + ')'))
			})
		};
		fn.resetCalc = function() {
			$('div.add-size-item').filter(':not(:first)').remove().end().find('a[href=#' + $('#calc-1-dim').val() + ']').click().end().find('input.add-size-count').val(parseInt($('#calc-1-pie').val(), 10) || 1);
			$('#ajax-manual-result').empty();
			$('#manual-add-to-cart')[0].disabled = true
		};
		fn.calcDisable = function(isDisable) {
			var meth = isDisable ? 'hide' : 'show';
			$('ul.tabs-color2')[meth]().next()[meth]()
		}
	}
	var t = fn.trace;
	var inCalcItemId = $('#calc-1-dim').val(), inCalcCount = parseInt($('#calc-1-pie').val(), 10);
	fn.requestNotCut(function(notCut) {
		var maxCount = globalManualCalcCut_maxCount;
		for (k in notCut) {
			maxCount[k] = notCut[k];
			if (k == inCalcItemId) {
				maxCount[k] += inCalcCount
			}
		}
		t('inCalcItemId:', inCalcItemId, 'inCalcCount:', inCalcCount, 'maxCount:', maxCount);
		var sizesCount = {};
		$('div.add-size-item').each(function() {
			var sizeId = $('li[class*=active] a',this).attr('href').split('#')[1], count = parseInt($('input.add-size-count', this).val(), 10);
			t('sizeId:', sizeId, 'count:', count);
			( sizeId in sizesCount) || (sizesCount[sizeId] = 0);
			sizesCount[sizeId] += count
		});
		t('sizesCount:', sizesCount);
		var isDisable = true;
		for (k in maxCount) {
			if ( k in sizesCount && sizesCount[k] > maxCount[k]) {
				t('По мерности [id:' + k + ' name:' + pageData.elKratnostEd[k].name + '] выбрано больше штук чем допустимо - сбрасываем калькулятор');
				fn.resetCalc()
			}
			if (maxCount[k] > 0) {
				isDisable = false
			}
			$('ul.add-size-types a[href=#'+k+']').parent()[maxCount[k]>0?'removeClass':'addClass']('none')
		}
		if (!$('ul.add-size-types li:not([class*=none])[class*=active]').length) {
			$('ul.add-size-types li:not([class*=none]):first a').click()
		}
		t('Прячем калькулятор?', isDisable);
		fn.calcDisable(isDisable)
	})
}

function round(value) {
	return (0 == value) ? 0 : parseFloat(Math.round(value * 100) / 100)
}
$(document).ready(function() {
	if (!$('body.page-catalog').length) {
		return
	}
	var fn;
	weighingCalcGetDimentions();
	weighingCalcCheckSizeless();
	$('#calc-1-dim').change(function() {
		weighingCalcCheckSizeless();
		globalWeighingData['priceElementId'] = pageData.elToPrice[$('#calc-1-dim').val()];
		calc1SelectGuide(globalWeighingData['guide']);
		weighingAutoUpdate()
	}).change();
	$('#calc-1-met').keyup(function() {
		globalWeighingGuide = 'length';
		calc1SelectGuide(globalWeighingData['guide']);
		weighingAutoUpdate()
	}).change(function() {
		var w = $('#calc-1-ton').val();
		if (0 == globalWeighingData['priceElementId'] || !w || w != globalWeighingData['weight']) {
			$('#weighing-calc-add-to-cart').attr({
				disabled : 'disabled'
			})
		}
	}).click(function() {
		$(this).select()
	});
	$('#calc-1-pie').keyup(function() {
		globalWeighingGuide = 'count';
		calc1SelectGuide(globalWeighingData['guide']);
		weighingAutoUpdate()
	}).change(function() {
		var w = $('#calc-1-ton').val();
		if (0 == globalWeighingData['priceElementId'] || !w || w != globalWeighingData['weight']) {
			$('#weighing-calc-add-to-cart').attr({
				disabled : 'disabled'
			})
		}
	}).click(function() {
		$(this).select()
	});
	fn = function() {
		$('#weighing-calc-add-to-cart')[0].disabled = (!parseFloat($('#calc-1-ton').val()))
	};
	$('#calc-1-ton').keyup(function() {
		if ($('#calc-1-met')[0].disabled && $('#calc-1-pie')[0].disabled) {
			return fn()
		}
		globalWeighingGuide = 'weight';
		calc1SelectGuide(globalWeighingData['guide']);
		weighingAutoUpdate()
	}).change(function() {
		if ($('#calc-1-met')[0].disabled && $('#calc-1-pie')[0].disabled) {
			return fn()
		}
		var w = $('#calc-1-ton').val();
		if (0 == globalWeighingData['priceElementId'] || !w || w != globalWeighingData['weight']) {
			$('#weighing-calc-add-to-cart').attr({
				disabled : 'disabled'
			})
		}
	}).click(function() {
		$(this).select()
	});
	$('#calc1-calculate-button').click(function() {
		calc1WeighingAjaxRequest();
		return false
	});
	$("#catalog-weighing").submit(function() {
		var w = $('#calc-1-ton').val();
		var b = ($('#calc-1-met')[0].disabled && $('#calc-1-pie')[0].disabled);
		if ((b && false) || (!b && (0 == globalWeighingData['priceElementId'] || !w || w != globalWeighingData['weight']))) {
			showError('#weighing-calc-add-to-cart', 'Извините, но значение тоннажа не совпадает с рассчитанным. ' + 'Попробуйте произвести пересчёт');
			return false
		}
		$('#weighing-cart-loading').show();
		$('#weighing-calc-add-to-cart').attr({
			disabled : 'disabled'
		});
		$('#calc1-calculate-button').attr({
			disabled : 'disabled'
		});
		var u = $('#catalog-weighing').attr('action');
		var data = {
			action : 'ADD2BASKET',
			id : globalWeighingData['priceElementId'],
			quantity : parseFloat(w)
		};
		$.post(u, data, function(response) {
			if ('success' != response) {
				showError('#weighing-calc-add-to-cart', 'Товар не добавлен в корзину. ' + 'Попробуйте повторить попытку')
			} else {
				basketInformerUpdate(function() {
					basketShowAdded('#weighing-calc-add-to-cart', [globalWeighingData['elementId']])
				})
			}
			$('#weighing-cart-loading').hide();
			$('#weighing-calc-add-to-cart').removeAttr('disabled');
			if (!b) {
				$('#calc1-calculate-button').removeAttr('disabled')
			}
			manualCalcCut_updateLimits()
		});
		return false
	})
});
$(document).ready(function() {
	$('#auto-add-btn').click(function() {
		calc2AddAutoItem();
		$('.auto-sc input').unbind('click').click(function() {
			$(this).select()
		}).unbind('change').change(function() {
			$('#auto-add-to-cart').attr({
				disabled : 'disabled'
			})
		});
		return false
	});
	$('#auto-remove-btn').click(function() {
		calc2RemoveAutoItem($(this));
		return false
	});
	$('.auto-sc input').click(function() {
		$(this).select()
	}).change(function() {
		$('#auto-add-to-cart').attr({
			disabled : 'disabled'
		})
	});
	$('#auto-calculate-button').click(function() {
		$('#auto-add-to-cart').attr({
			disabled : 'disabled'
		});
		calc2HideAutoResult();
		var p = $('#auto-content #ajax-path').val();
		var a = $('#auto-content #ajax-article').val();
		var d = calc2GetAutoItemsData();
		calc2AutoAjaxRequest(p, {
			data : d,
			article : a
		});
		return false
	});
	$('#auto-add-to-cart').click(function() {
		var url = $('#catalog-cutting').attr('action');
		var __tmp = calc2GetAutoOrderData();
		var checkData = __tmp['check'];
		var cartData = __tmp['cart'];
		if (!cartData || !checkData.length) {
			return false
		}
		if (!globalCuttingElements || !globalCatalogElementData) {
			showError('#auto-add-to-cart', 'Произведите перерасчёт');
			return false
		}
		calc2BlockAutoControls();
		$('#calc-auto-cart-loading').show();
		var __cartCount = 0;
		var i;
		for (i in cartData) {
			__cartCount++
		}
		var __itemAddCount = 0;
		for (i in cartData) {
			var data = {
				action : 'ADD2BASKET',
				id : globalCuttingElements[i],
				quantity : globalCatalogElementData[globalCuttingElements[i]]['weight']
			};
			var __errorCount = 0;
			var __catElementHighlight = [];
			$.post(url, data, function(response) {
				__itemAddCount++;
				if ('success' != response) {
					__errorCount++;
					showError('#auto-add-to-cart', 'Ошибка при добавлении товара ' + globalCatalogElementData[data.id]['name'])
				} else {
					__catElementHighlight.push(globalCatalogElementData[data.id]['element'])
				}
				if (__itemAddCount == __cartCount) {
					if (__errorCount) {
						calc2BlockAutoControls(false);
						$('#calc-auto-cart-loading').hide();
						return false
					}
					for ( i = 0; i < checkData.length; i++) {
						if (undefined != globalCatalogCutTypeCount[checkData[i]] && 0 == parseInt(globalCatalogCutTypeCount[checkData[i]])) {
							calc2BlockAutoControls(false);
							$('#calc-auto-cart-loading').hide();
							basketInformerUpdate(function() {
								basketShowAdded('#auto-add-to-cart', __catElementHighlight)
							});
							return false
						}
					}
					var __checkUrl = '/bitrix/templates/trimet/ajax/basket_not_cut_count.php';
					$.post(__checkUrl, {
						id : checkData
					}, function(response) {
						response = eval('(' + response + ')');
						var __compareResult = calc2CompareOrderAndCart(cartData, response);
						if (__compareResult.length > 0) {
							for (var i = 0; i < __compareResult.length; i++) {
								showError('#auto-add-to-cart', 'В корзине не хватает товара ' + globalCatalogElementData[__compareResult[i]['cutId']]['name'] + ' &mdash; ' + __compareResult[i]['count'] + '&nbsp;шт.')
							}
							calc2BlockAutoControls(false);
							$('#calc-auto-cart-loading').hide();
							return false
						}
						__errorCount = 0;
						var __cutAddCount = 0;
						for (i in cartData) {
							data = {
								action : 'ADD2BASKET',
								id : i,
								cutting : cartData[i]
							};
							$.post(url, data, function(response) {
								__cutAddCount++;
								if ('success' != response) {
									__errorCount++;
									showError('#auto-add-to-cart', 'Ошибка при добавлении резки товара ' + globalCatalogElementData[globalCuttingElements[data.id]]['name'])
								} else {
									__catElementHighlight.push(globalCatalogCuttingData[data.id])
								}
								if (__cutAddCount == __cartCount) {
									calc2BlockAutoControls(false);
									$('#calc-auto-cart-loading').hide();
									if (__errorCount) {
										return false
									}
									basketInformerUpdate(function() {
										basketShowAdded('#auto-add-to-cart', __catElementHighlight)
									})
								}
								return true
							})
						}
						return true
					})
				}
				return true
			})
		}
		return false
	})
});
$(document).ready(function() {
	if ($('#manual-content-place').length) {
		manualCalcCut_updateLimits();
		manualCalcGetDimentions();
		manualCalcParseSizeTypes();
		manualCalcUpdateSizeTypeHandlers()
	}
	(function() {
		$('input.add-size-count').live('keyup change', function() {
			var curSizeId = $(this).parents('div.add-size-item').find('li[class*=active] a').attr('href').split('#')[1];
			var maxCount = globalManualCalcCut_maxCount;
			if (!( curSizeId in maxCount)) {
				return
			}
			var countSum = 0;
			$('div.add-size-item').each(function() {
				var sizeId = $('li[class*=active] a',this).attr('href').split('#')[1], count = parseInt($('input.add-size-count', this).val(), 10);
				if (sizeId != curSizeId) {
					return
				}
				countSum += count
			});
			if (countSum >= maxCount[curSizeId]) {
				if (countSum > maxCount[curSizeId]) {
					this.value -= countSum - maxCount[curSizeId];
					if (this.value < 0) {
						this.value = 0
					}
				}
			} else {
			}
		})
	})();
	$('#manual-content-addbtn').click(function() {
		$('#manual-content-place').append(manualCalcCreateNewTypeSize());
		manualCalcUpdateSizeTypeHandlers();
		return false
	});
	$('#manual-content-removebtn').click(function() {
		if ($('#manual-content-place .add-size-item').length > 1) {
			$('#manual-content-place .add-size-item:last').remove();
			manualCalcCalculate()
		}
		return false
	});
	$('#manual-calculate-button').click(function() {
		manualCalcCalculate();
		return false
	});
	$('#manual-add-to-cart').click(function() {
		var url = $('#catalog-cutting').attr('action');
		var __tmp = manualCalcGetOrderData();
		var checkData = __tmp['check'];
		var cartData = __tmp['cart'];
		var __errorCount = 0;
		var i, j;
		var __cartCount = 0;
		for (i in cartData) {
			__cartCount++
		}
		if (!__cartCount || !checkData.length) {
			return false
		}
		$('#calc-manual-cart-loading').show();
		$('#manual-add-to-cart').attr({
			disabled : 'disabled'
		});
		var __checkUrl = '/bitrix/templates/trimet/ajax/basket_not_cut_count.php';
		$.post(__checkUrl, {
			id : checkData
		}, function(response) {
			response = eval('(' + response + ')');
			var __compareResult = manualCalcCompareOrderAndCart(cartData, response);
			if (__compareResult.length > 0) {
				for ( i = 0; i < __compareResult.length; i++) {
					showError('#manual-add-to-cart', 'Добавьте в корзину как минимум ' + __compareResult[i]['count'] + '&nbsp;шт. товара ' + __compareResult[i]['name'])
				}
				$('#manual-add-to-cart').removeAttr('disabled');
				$('#calc-manual-cart-loading').hide();
				return false
			}
			__errorCount = 0;
			var __itemAddCount = 0;
			var __catElementHighlight = [];
			for (i in cartData) {
				var data = {
					action : 'ADD2BASKET',
					id : i,
					cutting : cartData[i]
				};
				(function(i) {
					$.post(url, data, function(response) {
						__itemAddCount++;
						if ('success' != response) {
							__errorCount++;
							showError('#manual-add-to-cart', 'Ошибка при добавлении резки товара ' + globalObjectCuttingType[i]['catalogElementName'])
						} else {
							__catElementHighlight.push(globalObjectCuttingType[i]['catalogElementId'])
						}
						if (__itemAddCount == __cartCount) {
							$('#manual-add-to-cart').removeAttr('disabled');
							$('#calc-manual-cart-loading').hide();
							if (__errorCount) {
								return false
							}
							basketInformerUpdate(function() {
								basketShowAdded('#manual-add-to-cart', __catElementHighlight)
							});
							manualCalcCut_updateLimits()
						}
						return true
					})
				})(i)
			}
			return true
		});
		return false
	});
	$('#catalog-cutting').submit(function() {
		return false
	})
});
var delivFillForm, delivInStreetLoadedFn;
$(document).ready(function() {
	var t = 'object' == typeof console ? function() {
		console.log.apply(console, arguments)
	} : function() {
	};
	if (!$('body.page-shoping-bag').length) {
		return
	}
	var fn, data = pageData.deliv, $allFields = $('div.delivery-fields'), $selCity = $('#delivery-city-sel'), $inpKm = $('#delivery-newout-km'), $tran = $('.delivery-transport'), $tranDlinR = $('#delivery-transport-dlin-radio'), $tranGazR = $('#delivery-transport-gaz-radio'), $tranDlin = $('#delivery-transport-dlin'), $tranGaz = $('#delivery-transport-gaz'), $allSum = $('#all-sum'), $selInStreets = $('#delivery-in-street-input'), oInAreas, curInStreetInfo;
	fn = function() {
		calcKm(this.value)
	};
	$inpKm.keyup(fn).change(fn);
	fn = function() {
		t('[radio] value:' + this.value + ' checked:' + this.checked);
		if (this.checked) {
			allCalculated(parseFloat($('span', this.parentNode.parentNode).html().replace(/[^\d\.]/g, '')))
		}
	};
	$('input', $tran).change(fn);
	$('#delivery-msg-too-long a.internal-link').click(function() {
		$('#deliv-too-long-instructions').slideToggle(333);
		return false
	});
	var sum = data.sum, quant = data.quant, maxLength = data.maxLength, capacityG = data.capacityG, capacityD = data.capacityD, capacityGLength = data.capacityGLength, tarifD = data.tarifD, tarifD23 = data.tarifD23, tarifG = data.tarifG, freeCityQuant = data.freeCityQuant, formVals = data.formVals || {};
	var KMD = Math.ceil(quant / capacityD);
	var KMG = Math.ceil(quant / capacityG);
	window.setMaxLen = function(v) {
		maxLength = v
	};
	window.setQuant = function(v) {
		quant = v
	};
	var sStreetsDataUrl = '/bitrix/templates/trimet/ajax/order_delivery_selector.php?step=1&cityId=-1';
	$selInStreets.autocomplete(sStreetsDataUrl, {
		'delay' : 100,
		'max' : 100,
		'scrollHeight' : 300,
		'parse' : function(sData) {
			var data = eval('(' + sData + ')');
			oInAreas = data.areas;
			return $.map(data.streets, function(row) {
				return {
					data : row,
					result : row.name
				}
			})
		},
		'formatItem' : function(item) {
			return String(item.name)
		}
	}).result(function(event, item) {
		var fn = function() {
			$('#delivery-in-street').val(item.info);
			$('#delivery-in-street-name').val(item.name);
			curInStreetInfo = item.info;
			calcIn();
			isAutoChange = false
		};
		if ('undefined' === typeof oInAreas) {
			var tmpAutochange = isAutoChange;
			$.post(sStreetsDataUrl + '&q=zzz&limit=1', function(sData) {
				if (tmpAutochange) {
					isAutoChange = true
				}
				var data = eval('(' + sData + ')');
				oInAreas = data.areas;
				fn()
			})
		} else {
			fn()
		}
	});
	$('#delivery-in-building').val(formVals['delivery-in-building'] || '').keyup(calcIn).change(calcIn);
	var isAutoChange;
	fn = function() {
		var cityId = $(this).val();
		$allFields.addClass('none');
		switch(cityId) {
			case'0':
				{
					ok();
					sumCalculated(0, 0);
					isAutoChange = false
				}
				break;
			case'-1':
				{
					if (quant >= freeCityQuant) {
						$tran.addClass('none');
						$('#delivery-msg-free').removeClass('none');
						ok();
						isAutoChange = false;
						return
					}
					sumCalculated(0, 0);
					$('#delivery-fields-in').removeClass('none');
					if (isAutoChange) {
						$selInStreets.attr('value', formVals['delivery-in-street-name'] || '').trigger('result', [{
							name : formVals['delivery-in-street-name'] || '',
							info : formVals['delivery-in-street'] || ''
						}]);
						$('#delivery-in-building').val(formVals['delivery-in-building'] || '')
					} else {
						$selInStreets.attr('value', '');
						$('#delivery-in-building').attr('value', '')
					}
					calcIn();
					isAutoChange = false
				}
				break;
			case'-2':
				{
					sumCalculated(0, 0);
					$('#delivery-fields-newout').removeClass('none');
					if (isAutoChange) {
						$('#delivery-newout-km').attr('value', formVals['delivery-newout-km'] || '').change();
						$('#delivery-newout-city').attr('value', formVals['delivery-newout-city'] || '');
						$('#delivery-newout-street').attr('value', formVals['delivery-newout-street'] || '');
						$('#delivery-newout-building').attr('value', formVals['delivery-newout-building'] || '')
					} else {
						$('#delivery-fields-newout input').attr('value', '')
					}
					isAutoChange = false
				}
				break;
			default:
				{
					$('#delivery-fields-out').removeClass('none');
					if (isAutoChange) {
						$('#delivery-out-street').attr('value', formVals['delivery-out-street'] || '');
						$('#delivery-out-building').attr('value', formVals['delivery-out-building'] || '')
					} else {
						$('#delivery-fields-out input').attr('value', '')
					}
					var a = cityId.split('-');
					if ('1' == a[0]) {
						calcFix(a[2], a[3], a[4])
					} else {
						calcKm(a[2])
					}
					isAutoChange = false
				}
				break
		}
	};
	$selCity.change(fn);
	delivFillForm = function(overrideFormVals) {
		formVals = overrideFormVals || data.formVals || {};
		isAutoChange = true;
		$selCity.val(formVals['delivery-city-sel'] || '0').change()
	};
	delivFillForm();
	function ok() {
	}

	function err() {
	}

	function formatPrice(v) {
		return $().number_format(v || 0, {
			numberOfDecimals : 2,
			decimalSeparator : '.',
			thousandSeparator : '\u00a0'
		})
	}

	function calcIn() {
		if (!curInStreetInfo) {
			sumCalculated(0, 0);
			return
		}
		var i, n, a = curInStreetInfo.split('|'), areaId, sumDD = 0, sumDG = 0;
		var domNum = parseInt($('#delivery-in-building').val(), 10) || 0;
		t('domNum:' + domNum);
		var a2, numFrom, numTo;
		for ( i = 0, n = a.length; i < n; i++) {
			a2 = a[i].split('-');
			numFrom = parseInt(a2[0], 10);
			numTo = parseInt(a2[1], 10);
			if (numFrom <= domNum && (domNum <= numTo || 0 == numTo)) {
				areaId = parseInt(a2[2], 10);
				break
			}
		}
		if (areaId) {
			var area = oInAreas[areaId];
			$('#delivery-in-area-name').removeClass('none').find('span').html(area.name);
			var tarifD = area.priceLong;
			var tarifG = area.priceGazel;
			sumDD = tarifD * KMD;
			sumDG = tarifG * KMG;
			t('[calcIn] areaId:' + areaId + ' area.name:' + area.name + ' tarifD:' + tarifD + ' tarifG:' + tarifG + ' KMD:' + KMD + ' KMG:' + KMG)
		} else {
			t('[calcIn] no areaId');
			$('#delivery-in-area-name').addClass('none')
		}
		sumCalculated(sumDD, sumDG)
	}

	function calcFix(km, tarifTonD, tarifTonG) {
		km = parseFloat(km);
		tarifTonD = parseFloat(tarifTonD);
		tarifTonG = parseFloat(tarifTonG);
		t('[calcFix] km:' + km + ' tarifTonD:' + tarifTonD + ' tarifTonG:' + tarifTonG);
		var sumDD = 0, sumDG = 0;
		if (0 != tarifTonD) {
			var tarifNaMD = km * tarifD;
			var vesPTarifaD = tarifNaMD / tarifTonD;
			t('[calcFix D] tarifD:' + tarifD + ' quant:' + quant + ' capacityD:' + capacityD + ' | tarifNaMD:' + tarifNaMD + ' vesPTarifaD:' + vesPTarifaD);
			sumDD = parseInt(quant / capacityD) + parseInt((quant % capacityD) / vesPTarifaD) * tarifNaMD;
			t('[calcFix D] sumDD(1):' + sumDD);
			if ((quant % capacityD) < vesPTarifaD) {
				sumDD += ((quant % capacityD) % vesPTarifaD) * tarifTonD;
				var n1 = quant % capacityD;
				var n2 = n1 % vesPTarifaD;
				var n3 = n2 * tarifTonD;
				t('[calcFix D] n1: ' + n1 + ' n2:' + n2 + ' n3:' + n3)
			}
			t('[calcFix D] sumDD(2):' + sumDD)
		}
		if (0 != tarifTonG) {
			var tarifNaMG = km * tarifG;
			var vesPTarifaG = tarifNaMG / tarifTonG;
			sumDG = parseInt(quant / capacityG) + parseInt((quant % capacityG) / vesPTarifaG) * tarifNaMG;
			if ((quant % capacityG) < vesPTarifaG) {
				sumDG += ((quant % capacityG) % vesPTarifaG) * tarifTonG
			}
		}
		sumCalculated(sumDD, sumDG)
	}

	function calcKm(km) {
		var sumDG = tarifG * km * KMG;
		var KMD23 = Math.ceil(quant / capacityD / 1.15);
		if (KMD >= KMD23) {
			tarifD = tarifD23;
			KMD = KMD23
		}
		var sumDD = tarifD * km * KMD;
		sumCalculated(sumDD, sumDG)
	}

	function sumCalculated(sumDD, sumDG) {
		$tran.addClass('none');
		$('#delivery-msg-too-long').addClass('none');
		if (sumDG / sumDD > 3) {
			t('[sumCalculated] sumDG / sumDD > 3 sumDD:' + sumDD + ' sumDG:' + sumDG);
			sumDG = 0
		}
		if (!sumDD && !sumDG) {
			t('[sumCalculated] all 0');
			allCalculated(0);
			return
		}
		t('[sumCalculated] sumDD:' + sumDD + ' sumDG:' + sumDG);
		$('span', $tranDlinR).html(formatPrice(sumDD));
		$('span', $tranGazR).html(formatPrice(sumDG));
		var $inpD = $('input', $tranDlinR);
		var $inpG = $('input', $tranGazR);
		var isTooLong = maxLength > capacityGLength;
		if (sumDD && sumDG) {
			$tranDlinR.removeClass('none');
			$tranGazR.removeClass('none');
			$inpD.removeClass('none');
			$inpG.removeClass('none');
			if (isAutoChange && formVals['delivery-transport']) {
				(('dlin' == formVals['delivery-transport'] || isTooLong) ? $inpD : $inpG).attr('checked', 'checked').change()
			} else {
				if (sumDD < sumDG || isTooLong) {
					$inpD.attr('checked', 'checked').change()
				} else {
					$inpG.attr('checked', 'checked').change()
				}
			}
			if (isTooLong) {
				$inpG.attr({
					disabled : 'disabled'
				});
				$('#delivery-msg-too-long').removeClass('none')
			} else {
				$inpG.attr({
					disabled : null
				})
			}
		} else {
			( sumDD ? $tranDlinR : $tranDlinG).removeClass('none');
			( sumDD ? $inpD : $inpG).attr('checked', 'checked').change().addClass('none');
			allCalculated( sumDD ? sumDD : sumDG)
		}
	}

	function allCalculated(delivSum) {
		t('[allCalculated] sum:' + sum + ' delivSum:' + delivSum);
		$('#delivery-sum').attr({
			value : delivSum
		});
		$('#deliv-sum span').html(formatPrice(delivSum || 0));
		$('span', $allSum).html(formatPrice(sum + (delivSum || 0)))
	}

});
;(function($) {
	$.fn.extend({
		autocomplete : function(urlOrData, options) {
			var isUrl = typeof urlOrData == "string";
			options = $.extend({}, $.Autocompleter.defaults, {
				url : isUrl ? urlOrData : null,
				data : isUrl ? null : urlOrData,
				delay : isUrl ? $.Autocompleter.defaults.delay : 10,
				max : options && !options.scroll ? 10 : 150
			}, options);
			options.highlight = options.highlight ||
			function(value) {
				return value
			};
			options.formatMatch = options.formatMatch || options.formatItem;
			return this.each(function() {
				new $.Autocompleter(this, options)
			})
		},
		result : function(handler) {
			return this.bind("result", handler)
		},
		search : function(handler) {
			return this.trigger("search", [handler])
		},
		flushCache : function() {
			return this.trigger("flushCache")
		},
		setOptions : function(options) {
			return this.trigger("setOptions", [options])
		},
		unautocomplete : function() {
			return this.trigger("unautocomplete")
		}
	});
	$.Autocompleter = function(input, options) {
		var KEY = {
			UP : 38,
			DOWN : 40,
			DEL : 46,
			TAB : 9,
			RETURN : 13,
			ESC : 27,
			COMMA : 188,
			PAGEUP : 33,
			PAGEDOWN : 34,
			BACKSPACE : 8
		};
		var $input = $(input).attr("autocomplete", "off").addClass(options.inputClass);
		var timeout;
		var previousValue = "";
		var cache = $.Autocompleter.Cache(options);
		var hasFocus = 0;
		var lastKeyPressCode;
		var config = {
			mouseDownOnSelect : false
		};
		var select = $.Autocompleter.Select(options, input, selectCurrent, config);
		var blockSubmit;
		$.browser.opera && $(input.form).bind("submit.autocomplete", function() {
			if (blockSubmit) {
				blockSubmit = false;
				return false
			}
		});
		$input.bind(($.browser.opera ? "keypress" : "keydown") + ".autocomplete", function(event) {
			hasFocus = 1;
			lastKeyPressCode = event.keyCode;
			switch(event.keyCode) {
				case KEY.UP:
					event.preventDefault();
					if (select.visible()) {
						select.prev()
					} else {
						onChange(0, true)
					}
					break;
				case KEY.DOWN:
					event.preventDefault();
					if (select.visible()) {
						select.next()
					} else {
						onChange(0, true)
					}
					break;
				case KEY.PAGEUP:
					event.preventDefault();
					if (select.visible()) {
						select.pageUp()
					} else {
						onChange(0, true)
					}
					break;
				case KEY.PAGEDOWN:
					event.preventDefault();
					if (select.visible()) {
						select.pageDown()
					} else {
						onChange(0, true)
					}
					break;
				case options.multiple&&$.trim(options.multipleSeparator)==","&&KEY.COMMA:
				case KEY.TAB:
				case KEY.RETURN:
					if (selectCurrent()) {
						event.preventDefault();
						blockSubmit = true;
						return false
					}
					break;
				case KEY.ESC:
					select.hide();
					break;
				default:
					clearTimeout(timeout);
					timeout = setTimeout(onChange, options.delay);
					break
			}
		}).focus(function() {
			hasFocus++
		}).blur(function() {
			hasFocus = 0;
			if (!config.mouseDownOnSelect) {
				hideResults()
			}
		}).click(function() {
			if (hasFocus++ > 1 && !select.visible()) {
				onChange(0, true)
			}
		}).bind("search", function() {
			var fn = (arguments.length > 1) ? arguments[1] : null;
			function findValueCallback(q, data) {
				var result;
				if (data && data.length) {
					for (var i = 0; i < data.length; i++) {
						if (data[i].result.toLowerCase() == q.toLowerCase()) {
							result = data[i];
							break
						}
					}
				}
				if ( typeof fn == "function")
					fn(result);
				else
					$input.trigger("result", result && [result.data, result.value])
			}
			$.each(trimWords($input.val()), function(i, value) {
				request(value, findValueCallback, findValueCallback)
			})
		}).bind("flushCache", function() {
			cache.flush()
		}).bind("setOptions", function() {
			$.extend(options, arguments[1]);
			if ("data" in arguments[1])
				cache.populate()
		}).bind("unautocomplete", function() {
			select.unbind();
			$input.unbind();
			$(input.form).unbind(".autocomplete")
		});
		function selectCurrent() {
			var selected = select.selected();
			if (!selected)
				return false;
			var v = selected.result;
			previousValue = v;
			if (options.multiple) {
				var words = trimWords($input.val());
				if (words.length > 1) {
					var seperator = options.multipleSeparator.length;
					var cursorAt = $(input).selection().start;
					var wordAt, progress = 0;
					$.each(words, function(i, word) {
						progress += word.length;
						if (cursorAt <= progress) {
							wordAt = i;
							return false
						}
						progress += seperator
					});
					words[wordAt] = v;
					v = words.join(options.multipleSeparator)
				}
				v += options.multipleSeparator
			}
			$input.val(v);
			hideResultsNow();
			$input.trigger("result", [selected.data, selected.value]);
			return true
		}

		function onChange(crap, skipPrevCheck) {
			if (lastKeyPressCode == KEY.DEL) {
				select.hide();
				return
			}
			var currentValue = $input.val();
			if (!skipPrevCheck && currentValue == previousValue)
				return;
			previousValue = currentValue;
			currentValue = lastWord(currentValue);
			if (currentValue.length >= options.minChars) {
				$input.addClass(options.loadingClass);
				if (!options.matchCase)
					currentValue = currentValue.toLowerCase();
				request(currentValue, receiveData, hideResultsNow)
			} else {
				stopLoading();
				select.hide()
			}
		};
		function trimWords(value) {
			if (!value)
				return [""];
			if (!options.multiple)
				return [$.trim(value)];
			return $.map(value.split(options.multipleSeparator), function(word) {
				return $.trim(value).length ? $.trim(word) : null
			})
		}

		function lastWord(value) {
			if (!options.multiple)
				return value;
			var words = trimWords(value);
			if (words.length == 1)
				return words[0];
			var cursorAt = $(input).selection().start;
			if (cursorAt == value.length) {
				words = trimWords(value)
			} else {
				words = trimWords(value.replace(value.substring(cursorAt), ""))
			}
			return words[words.length - 1]
		}

		function autoFill(q, sValue) {
			if (options.autoFill && (lastWord($input.val()).toLowerCase() == q.toLowerCase()) && lastKeyPressCode != KEY.BACKSPACE) {
				$input.val($input.val() + sValue.substring(lastWord(previousValue).length));
				$(input).selection(previousValue.length, previousValue.length + sValue.length)
			}
		};
		function hideResults() {
			clearTimeout(timeout);
			timeout = setTimeout(hideResultsNow, 200)
		};
		function hideResultsNow() {
			var wasVisible = select.visible();
			select.hide();
			clearTimeout(timeout);
			stopLoading();
			if (options.mustMatch) {
				$input.search(function(result) {
					if (!result) {
						if (options.multiple) {
							var words = trimWords($input.val()).slice(0, -1);
							$input.val(words.join(options.multipleSeparator) + (words.length ? options.multipleSeparator : ""))
						} else {
							$input.val("");
							$input.trigger("result", null)
						}
					}
				})
			}
		};
		function receiveData(q, data) {
			if (data && data.length && hasFocus) {
				stopLoading();
				select.display(data, q);
				autoFill(q, data[0].value);
				select.show()
			} else {
				hideResultsNow()
			}
		};
		function request(term, success, failure) {
			if (!options.matchCase)
				term = term.toLowerCase();
			var data = cache.load(term);
			if (data && data.length) {
				success(term, data)
			} else if (( typeof options.url == "string") && (options.url.length > 0)) {
				var extraParams = {
					timestamp : +new Date()
				};
				$.each(options.extraParams, function(key, param) {
					extraParams[key] = typeof param == "function" ? param() : param
				});
				$.ajax({
					mode : "abort",
					port : "autocomplete" + input.name,
					dataType : options.dataType,
					url : options.url,
					data : $.extend({
						q : lastWord(term),
						limit : options.max
					}, extraParams),
					success : function(data) {
						var parsed = options.parse && options.parse(data) || parse(data);
						cache.add(term, parsed);
						success(term, parsed)
					}
				})
			} else {
				select.emptyList();
				failure(term)
			}
		};
		function parse(data) {
			var parsed = [];
			var rows = data.split("\n");
			for (var i = 0; i < rows.length; i++) {
				var row = $.trim(rows[i]);
				if (row) {
					row = row.split("|");
					parsed[parsed.length] = {
						data : row,
						value : row[0],
						result : options.formatResult && options.formatResult(row, row[0]) || row[0]
					}
				}
			}
			return parsed
		};
		function stopLoading() {
			$input.removeClass(options.loadingClass)
		}

	};
	$.Autocompleter.defaults = {
		inputClass : "ac_input",
		resultsClass : "ac_results",
		loadingClass : "ac_loading",
		minChars : 1,
		delay : 400,
		matchCase : false,
		matchSubset : true,
		matchContains : false,
		cacheLength : 10,
		max : 100,
		mustMatch : false,
		extraParams : {},
		selectFirst : true,
		formatItem : function(row) {
			return row[0]
		},
		formatMatch : null,
		autoFill : false,
		width : 0,
		multiple : false,
		multipleSeparator : ", ",
		highlight : function(value, term) {
			return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>")
		},
		scroll : true,
		scrollHeight : 180
	};
	$.Autocompleter.Cache = function(options) {
		var data = {};
		var length = 0;
		function matchSubset(s, sub) {
			s = s || '';
			if (!options.matchCase)
				s = s.toLowerCase();
			var i = s.indexOf(sub);
			if (options.matchContains == "word") {
				i = s.toLowerCase().search("\\b" + sub.toLowerCase())
			}
			if (i == -1)
				return false;
			return i == 0 || options.matchContains
		}

		function add(q, value) {
			if (length > options.cacheLength) {
				flush()
			}
			if (!data[q]) {
				length++
			}
			data[q] = value
		}

		function populate() {
			if (!options.data)
				return false;
			var stMatchSets = {}, nullData = 0;
			if (!options.url)
				options.cacheLength = 1;
			stMatchSets[""] = [];
			for (var i = 0, ol = options.data.length; i < ol; i++) {
				var rawValue = options.data[i];
				rawValue = ( typeof rawValue == "string") ? [rawValue] : rawValue;
				var value = options.formatMatch(rawValue, i + 1, options.data.length);
				if (value === false)
					continue;
				var firstChar = value.charAt(0).toLowerCase();
				if (!stMatchSets[firstChar])
					stMatchSets[firstChar] = [];
				var row = {
					value : value,
					data : rawValue,
					result : options.formatResult && options.formatResult(rawValue) || value
				};
				stMatchSets[firstChar].push(row);
				if (nullData++ < options.max) {
					stMatchSets[""].push(row)
				}
			};
			$.each(stMatchSets, function(i, value) {
				options.cacheLength++;
				add(i, value)
			})
		}

		setTimeout(populate, 25);
		function flush() {
			data = {};
			length = 0
		}
		return {
			flush : flush,
			add : add,
			populate : populate,
			load : function(q) {
				if (!options.cacheLength || !length)
					return null;
				if (!options.url && options.matchContains) {
					var csub = [];
					for (var k in data) {
						if (k.length > 0) {
							var c = data[k];
							$.each(c, function(i, x) {
								if (matchSubset(x.value, q)) {
									csub.push(x)
								}
							})
						}
					}
					return csub
				} else if (data[q]) {
					return data[q]
				} else if (options.matchSubset) {
					for (var i = q.length - 1; i >= options.minChars; i--) {
						var c = data[q.substr(0, i)];
						if (c) {
							var csub = [];
							$.each(c, function(i, x) {
								if (matchSubset(x.value, q)) {
									csub[csub.length] = x
								}
							});
							return csub
						}
					}
				}
				return null
			}
		}
	};
	$.Autocompleter.Select = function(options, input, select, config) {
		var CLASSES = {
			ACTIVE : "ac_over"
		};
		var listItems, active = -1, data, term = "", needsInit = true, element, list;
		function init() {
			if (!needsInit)
				return;
			element = $("<div/>").hide().addClass(options.resultsClass).css("position", "absolute").appendTo(document.body);
			list = $("<ul/>").appendTo(element).mouseover(function(event) {
				if (target(event).nodeName && target(event).nodeName.toUpperCase() == 'LI') {
					active = $("li", list).removeClass(CLASSES.ACTIVE).index(target(event));
					$(target(event)).addClass(CLASSES.ACTIVE)
				}
			}).click(function(event) {
				$(target(event)).addClass(CLASSES.ACTIVE);
				select();
				input.focus();
				return false
			}).mousedown(function() {
				config.mouseDownOnSelect = true
			}).mouseup(function() {
				config.mouseDownOnSelect = false
			});
			if (options.width > 0)
				element.css("width", options.width);
			needsInit = false
		}

		function target(event) {
			var element = event.target;
			while (element && element.tagName != "LI")
			element = element.parentNode;
			if (!element)
				return [];
			return element
		}

		function moveSelect(step) {
			listItems.slice(active, active + 1).removeClass(CLASSES.ACTIVE);
			movePosition(step);
			var activeItem = listItems.slice(active, active + 1).addClass(CLASSES.ACTIVE);
			if (options.scroll) {
				var offset = 0;
				listItems.slice(0, active).each(function() {
					offset += this.offsetHeight
				});
				if ((offset + activeItem[0].offsetHeight - list.scrollTop()) > list[0].clientHeight) {
					list.scrollTop(offset + activeItem[0].offsetHeight - list.innerHeight())
				} else if (offset < list.scrollTop()) {
					list.scrollTop(offset)
				}
			}
		};
		function movePosition(step) {
			active += step;
			if (active < 0) {
				active = listItems.size() - 1
			} else if (active >= listItems.size()) {
				active = 0
			}
		}

		function limitNumberOfItems(available) {
			return options.max && options.max < available ? options.max : available
		}

		function fillList() {
			list.empty();
			var max = limitNumberOfItems(data.length);
			for (var i = 0; i < max; i++) {
				if (!data[i])
					continue;
				var formatted = options.formatItem(data[i].data, i + 1, max, data[i].value, term);
				if (formatted === false)
					continue;
				var li = $("<li/>").html(options.highlight(formatted,term)).addClass(i%2==0?"ac_even":"ac_odd").appendTo(list)[0];
				$.data(li, "ac_data", data[i])
			}
			listItems = list.find("li");
			if (options.selectFirst) {
				listItems.slice(0, 1).addClass(CLASSES.ACTIVE);
				active = 0
			}
			if ($.fn.bgiframe)
				list.bgiframe()
		}
		return {
			display : function(d, q) {
				init();
				data = d;
				term = q;
				fillList()
			},
			next : function() {
				moveSelect(1)
			},
			prev : function() {
				moveSelect(-1)
			},
			pageUp : function() {
				if (active != 0 && active - 8 < 0) {
					moveSelect(-active)
				} else {
					moveSelect(-8)
				}
			},
			pageDown : function() {
				if (active != listItems.size() - 1 && active + 8 > listItems.size()) {
					moveSelect(listItems.size() - 1 - active)
				} else {
					moveSelect(8)
				}
			},
			hide : function() {
				element && element.hide();
				listItems && listItems.removeClass(CLASSES.ACTIVE);
				active = -1
			},
			visible : function() {
				return element && element.is(":visible")
			},
			current : function() {
				return this.visible() && (listItems.filter("."+CLASSES.ACTIVE)[0] || options.selectFirst && listItems[0])
			},
			show : function() {
				var offset = $(input).offset();
				element.css({
					width : typeof options.width == "string" || options.width > 0 ? options.width : $(input).width(),
					top : offset.top + input.offsetHeight,
					left : offset.left
				}).show();
				if (options.scroll) {
					list.scrollTop(0);
					list.css({
						maxHeight : options.scrollHeight,
						overflow : 'auto'
					});
					if ($.browser.msie && typeof document.body.style.maxHeight === "undefined") {
						var listHeight = 0;
						listItems.each(function() {
							listHeight += this.offsetHeight
						});
						var scrollbarsVisible = listHeight > options.scrollHeight;
						list.css('height', scrollbarsVisible ? options.scrollHeight : listHeight);
						if (!scrollbarsVisible) {
							listItems.width(list.width() - parseInt(listItems.css("padding-left")) - parseInt(listItems.css("padding-right")))
						}
					}
				}
			},
			selected : function() {
				var selected = listItems && listItems.filter("." + CLASSES.ACTIVE).removeClass(CLASSES.ACTIVE);
				return selected && selected.length && $.data(selected[0], "ac_data")
			},
			emptyList : function() {
				list && list.empty()
			},
			unbind : function() {
				element && element.remove()
			}
		}
	};
	$.fn.selection = function(start, end) {
		if (start !== undefined) {
			return this.each(function() {
				if (this.createTextRange) {
					var selRange = this.createTextRange();
					if (end === undefined || start == end) {
						selRange.move("character", start);
						selRange.select()
					} else {
						selRange.collapse(true);
						selRange.moveStart("character", start);
						selRange.moveEnd("character", end);
						selRange.select()
					}
				} else if (this.setSelectionRange) {
					this.setSelectionRange(start, end)
				} else if (this.selectionStart) {
					this.selectionStart = start;
					this.selectionEnd = end
				}
			})
		}
		var field = this[0];
		if (field.createTextRange) {
			var range = document.selection.createRange(), orig = field.value, teststring = "<->", textLength = range.text.length;
			range.text = teststring;
			var caretAt = field.value.indexOf(teststring);
			field.value = orig;
			this.selection(caretAt, caretAt + textLength);
			return {
				start : caretAt,
				end : caretAt + textLength
			}
		} else if (field.selectionStart !== undefined) {
			return {
				start : field.selectionStart,
				end : field.selectionEnd
			}
		}
	}
})(jQuery);
;(function($) {
	function TooltipGroup() {
		this.nOffsetX = 4;
		this.nOffsetY = -4;
		this.nDelayShow = 100;
		this.nDelayHide = 600;
		this.bAbove = true;
		this.bOnLeft = true;
		this.bMoveUp = true;
		this.bTtHover = true;
		this.bManualShow = false;
		this.bManualHide = false;
		this.bAppendTtInBody = false;
		this.oHover
		this.oTooltip
		this.onShow
		this.onHide
		this.sHoveredClass = '';
		this.sRevertedTooltip = '';
		this.init = function() {
			if (!this.oHover || !this.oTooltip) {
				return
			}
			var $hover = $(this.bTtHover ? [this.oTooltip, this.oHover] : this.oHover);
			if (!this.bManualShow) {
				$hover.mouseover(mouseover)
			}
			if (!this.bManualHide) {
				$hover.mouseout(mouseout)
			}
			if (this.bAppendTtInBody) {
				$("body").append(this.oTooltip)
			}
		};
		this.forceShow = function(onDone) {
			mouseover(null, onDone)
		};
		this.forceHide = function(onDone) {
			delTimerShow();
			delTimerHide();
			hide(onDone)
		};
		var _nMoveRange = 10, _this = this, _nStartX, _nStartY, _nTimerShow, _nTimerHide, _bNeedShow = false;
		function mouseover(evt, onDone) {
			_bNeedShow = true;
			delTimerHide();
			if ("none" != $(_this.oTooltip).css("display") || "" == $(_this.oTooltip).html()) {
				return
			}
			_nTimerShow = setTimeout(function() {
				var hov = _this.oHover, tt = _this.oTooltip;
				_nTimerShow = null;
				_this.onShow(_this);
				$(tt).css({
					display : "block",
					opacity : 0
				});
				var addLeft = (_this.bOnLeft ? 0 : hov.offsetWidth) + _this.nOffsetX;
				if ('' != _this.sRevertedTooltip && $(tt).is(_this.sRevertedTooltip)) {
					addLeft = -(_this.bOnLeft ? (tt.offsetWidth - hov.offsetWidth) : 0) - _this.nOffsetX
				}
				if ('' != _this.sHoveredClass) {
					$(hov).addClass(_this.sHoveredClass)
				}
				_nStartX = $(hov)[_this.bAppendTtInBody?"offset":"position"]().left + addLeft;
				_nStartY = $(hov)[_this.bAppendTtInBody?"offset":"position"]().top + (_this.bAbove ? -tt.offsetHeight : hov.offsetHeight) + _this.nOffsetY + _nMoveRange * (_this.bMoveUp ? 1 : -1);
				$(tt).css({
					left : _nStartX,
					top : _nStartY
				}).stop().animate({
					top : _nStartY - _nMoveRange * (_this.bMoveUp ? 1 : -1),
					opacity : 1
				}, 200, "swing", function() {
					( onDone instanceof Function) && onDone()
				})
			}, _this.nDelayShow)
		}

		function mouseout(evt) {
			delTimerShow();
			_nTimerHide = setTimeout(hide, _this.nDelayHide)
		}

		function hide(onDone) {
			_bNeedShow = false;
			_nTimerHide = null;
			if ("none" == $(_this.oTooltip).css("display")) {
				return
			}
			$(_this.oTooltip).stop().animate({
				top : _nStartY - _nMoveRange * (_this.bMoveUp ? 1 : -1) * 2,
				opacity : 0
			}, 200, "swing", function() {
				if ('' != _this.sHoveredClass) {
					$(_this.oHover).removeClass(_this.sHoveredClass)
				}
				$(this).css({
					display : "none"
				});
				if (_bNeedShow) {
					mouseover()
				}
				_this.onHide(_this);
				( onDone instanceof Function) && onDone()
			})
		}

		function delTimerShow() {
			if (_nTimerShow) {
				clearTimeout(_nTimerShow);
				_nTimerShow = null
			}
		}

		function delTimerHide() {
			if (_nTimerHide) {
				clearTimeout(_nTimerHide);
				_nTimerHide = null
			}
		}

	}
	$.fn.extend({
		bubble_tooltip_init : function(oOverrideTG, oOverrideConfig) {
			var oConfig = {
				sFindGroup : "li",
				sFindHover : "a",
				sFindTooltip : "div.tooltip",
				onShow : function() {
				},
				onHide : function() {
				},
				iface : function() {
				}
			}, oLastShowed, aTg = [];
			$.extend(oConfig, oOverrideConfig || {});
			this.each(function() {
				$(oConfig.sFindGroup, this).each(function() {
					var tg = new TooltipGroup();
					tg.oHover = $(oConfig.sFindHover,this)[0];
					tg.oTooltip = $(oConfig.sFindTooltip,this)[0];
					tg.onShow = function(tg) {
						if (oLastShowed) {
							oLastShowed.forceHide()
						}
						oLastShowed = tg;
						oConfig.onShow()
					};
					tg.onHide = function() {
						oConfig.onHide()
					};
					$.extend(tg, oOverrideTG || {});
					tg.init();
					$("a", this).removeAttr("title");
					$("img", this).removeAttr("alt");
					aTg.push(tg)
				})
			});
			oConfig.iface(function(onDone) {
				var i, n;
				for ( i = 0, n = aTg.length; i < n; i++) {
					aTg[i].forceShow(onDone)
				}
			}, function(onDone) {
				var i, n;
				for ( i = 0, n = aTg.length; i < n; i++) {
					aTg[i].forceHide(onDone)
				}
			});
			return this
		}
	})
})(jQuery);
;
jQuery.effects || (function($) {
	$.effects = {
		version : "1.7.2",
		save : function(element, set) {
			for (var i = 0; i < set.length; i++) {
				if (set[i] !== null)
					element.data("ec.storage." + set[i], element[0].style[set[i]])
			}
		},
		restore : function(element, set) {
			for (var i = 0; i < set.length; i++) {
				if (set[i] !== null)
					element.css(set[i], element.data("ec.storage." + set[i]))
			}
		},
		setMode : function(el, mode) {
			if (mode == 'toggle')
				mode = el.is(':hidden') ? 'show' : 'hide';
			return mode
		},
		getBaseline : function(origin, original) {
			var y, x;
			switch(origin[0]) {
				case'top':
					y = 0;
					break;
				case'middle':
					y = 0.5;
					break;
				case'bottom':
					y = 1;
					break;
				default:
					y = origin[0] / original.height
			};
			switch(origin[1]) {
				case'left':
					x = 0;
					break;
				case'center':
					x = 0.5;
					break;
				case'right':
					x = 1;
					break;
				default:
					x = origin[1] / original.width
			};
			return {
				x : x,
				y : y
			}
		},
		createWrapper : function(element) {
			if (element.parent().is('.ui-effects-wrapper'))
				return element.parent();
			var props = {
				width : element.outerWidth(true),
				height : element.outerHeight(true),
				'float' : element.css('float')
			};
			element.wrap('<div class="ui-effects-wrapper" style="font-size:100%;background:transparent;border:none;margin:0;padding:0"></div>');
			var wrapper = element.parent();
			if (element.css('position') == 'static') {
				wrapper.css({
					position : 'relative'
				});
				element.css({
					position : 'relative'
				})
			} else {
				var top = element.css('top');
				if (isNaN(parseInt(top, 10)))
					top = 'auto';
				var left = element.css('left');
				if (isNaN(parseInt(left, 10)))
					left = 'auto';
				wrapper.css({
					position : element.css('position'),
					top : top,
					left : left,
					zIndex : element.css('z-index')
				}).show();
				element.css({
					position : 'relative',
					top : 0,
					left : 0
				})
			}
			wrapper.css(props);
			return wrapper
		},
		removeWrapper : function(element) {
			if (element.parent().is('.ui-effects-wrapper'))
				return element.parent().replaceWith(element);
			return element
		},
		setTransition : function(element, list, factor, value) {
			value = value || {};
			$.each(list, function(i, x) {
				unit = element.cssUnit(x);
				if (unit[0] > 0)
					value[x] = unit[0] * factor + unit[1]
			});
			return value
		},
		animateClass : function(value, duration, easing, callback) {
			var cb = ( typeof easing == "function" ? easing : ( callback ? callback : null));
			var ea = ( typeof easing == "string" ? easing : null);
			return this.each(function() {
				var offset = {};
				var that = $(this);
				var oldStyleAttr = that.attr("style") || '';
				if ( typeof oldStyleAttr == 'object')
					oldStyleAttr = oldStyleAttr["cssText"];
				if (value.toggle) {
					that.hasClass(value.toggle) ? value.remove = value.toggle : value.add = value.toggle
				}
				var oldStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle));
				if (value.add)
					that.addClass(value.add);
				if (value.remove)
					that.removeClass(value.remove);
				var newStyle = $.extend({}, (document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle));
				if (value.add)
					that.removeClass(value.add);
				if (value.remove)
					that.addClass(value.remove);
				for (var n in newStyle) {
					if ( typeof newStyle[n] != "function" && newStyle[n] && n.indexOf("Moz") == -1 && n.indexOf("length") == -1 && newStyle[n] != oldStyle[n] && (n.match(/color/i) || (!n.match(/color/i) && !isNaN(parseInt(newStyle[n], 10)))) && (oldStyle.position != "static" || (oldStyle.position == "static" && !n.match(/left|top|bottom|right/))))
						offset[n] = newStyle[n]
				}
				that.animate(offset, duration, ea, function() {
					if ( typeof $(this).attr("style") == 'object') {
						$(this).attr("style")["cssText"] = "";
						$(this).attr("style")["cssText"] = oldStyleAttr
					} else
						$(this).attr("style", oldStyleAttr);
					if (value.add)
						$(this).addClass(value.add);
					if (value.remove)
						$(this).removeClass(value.remove);
					if (cb)
						cb.apply(this, arguments)
				})
			})
		}
	};
	function _normalizeArguments(a, m) {
		var o = a[1] && a[1].constructor == Object ? a[1] : {};
		if (m)
			o.mode = m;
		var speed = a[1] && a[1].constructor != Object ? a[1] : (o.duration ? o.duration : a[2]);
		speed = $.fx.off ? 0 : typeof speed === "number" ? speed : $.fx.speeds[speed] || $.fx.speeds._default;
		var callback = o.callback || ($.isFunction(a[1]) && a[1]) || ($.isFunction(a[2]) && a[2]) || ($.isFunction(a[3]) && a[3]);
		return [a[0], o, speed, callback]
	}
	$.fn.extend({
		_show : $.fn.show,
		_hide : $.fn.hide,
		__toggle : $.fn.toggle,
		_addClass : $.fn.addClass,
		_removeClass : $.fn.removeClass,
		_toggleClass : $.fn.toggleClass,
		effect : function(fx, options, speed, callback) {
			return $.effects[fx] ? $.effects[fx].call(this, {
				method : fx,
				options : options || {},
				duration : speed,
				callback : callback
			}) : null
		},
		show : function() {
			if (!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])))
				return this._show.apply(this, arguments);
			else {
				return this.effect.apply(this, _normalizeArguments(arguments, 'show'))
			}
		},
		hide : function() {
			if (!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])))
				return this._hide.apply(this, arguments);
			else {
				return this.effect.apply(this, _normalizeArguments(arguments, 'hide'))
			}
		},
		toggle : function() {
			if (!arguments[0] || (arguments[0].constructor == Number || (/(slow|normal|fast)/).test(arguments[0])) || ($.isFunction(arguments[0]) || typeof arguments[0] == 'boolean')) {
				return this.__toggle.apply(this, arguments)
			} else {
				return this.effect.apply(this, _normalizeArguments(arguments, 'toggle'))
			}
		},
		addClass : function(classNames, speed, easing, callback) {
			return speed ? $.effects.animateClass.apply(this, [{
				add : classNames
			}, speed, easing, callback]) : this._addClass(classNames)
		},
		removeClass : function(classNames, speed, easing, callback) {
			return speed ? $.effects.animateClass.apply(this, [{
				remove : classNames
			}, speed, easing, callback]) : this._removeClass(classNames)
		},
		toggleClass : function(classNames, speed, easing, callback) {
			return (( typeof speed !== "boolean") && speed) ? $.effects.animateClass.apply(this, [{
				toggle : classNames
			}, speed, easing, callback]) : this._toggleClass(classNames, speed)
		},
		morph : function(remove, add, speed, easing, callback) {
			return $.effects.animateClass.apply(this, [{
				add : add,
				remove : remove
			}, speed, easing, callback])
		},
		switchClass : function() {
			return this.morph.apply(this, arguments)
		},
		cssUnit : function(key) {
			var style = this.css(key), val = [];
			$.each(['em', 'px', '%', 'pt'], function(i, unit) {
				if (style.indexOf(unit) > 0)
					val = [parseFloat(style), unit]
			});
			return val
		}
	});
	$.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i, attr) {
		$.fx.step[attr] = function(fx) {
			if (fx.state == 0) {
				fx.start = getColor(fx.elem, attr);
				fx.end = getRGB(fx.end)
			}
			fx.elem.style[attr] = "rgb(" + [Math.max(Math.min(parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0], 10), 255), 0), Math.max(Math.min(parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1], 10), 255), 0), Math.max(Math.min(parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2], 10), 255), 0)].join(",") + ")"
		}
	});
	function getRGB(color) {
		var result;
		if (color && color.constructor == Array && color.length == 3)
			return color;
		if ( result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10)];
		if ( result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
		if ( result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
		if ( result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
		if ( result = /rgba\(0, 0, 0, 0\)/.exec(color))
			return colors['transparent'];
		return colors[$.trim(color).toLowerCase()]
	}

	function getColor(elem, attr) {
		var color;
		do {
			color = $.curCSS(elem, attr);
			if (color != '' && color != 'transparent' || $.nodeName(elem, "body"))
				break;
			attr = "backgroundColor"
		} while(elem=elem.parentNode);
		return getRGB(color)
	};
	var colors = {
		aqua : [0, 255, 255],
		azure : [240, 255, 255],
		beige : [245, 245, 220],
		black : [0, 0, 0],
		blue : [0, 0, 255],
		brown : [165, 42, 42],
		cyan : [0, 255, 255],
		darkblue : [0, 0, 139],
		darkcyan : [0, 139, 139],
		darkgrey : [169, 169, 169],
		darkgreen : [0, 100, 0],
		darkkhaki : [189, 183, 107],
		darkmagenta : [139, 0, 139],
		darkolivegreen : [85, 107, 47],
		darkorange : [255, 140, 0],
		darkorchid : [153, 50, 204],
		darkred : [139, 0, 0],
		darksalmon : [233, 150, 122],
		darkviolet : [148, 0, 211],
		fuchsia : [255, 0, 255],
		gold : [255, 215, 0],
		green : [0, 128, 0],
		indigo : [75, 0, 130],
		khaki : [240, 230, 140],
		lightblue : [173, 216, 230],
		lightcyan : [224, 255, 255],
		lightgreen : [144, 238, 144],
		lightgrey : [211, 211, 211],
		lightpink : [255, 182, 193],
		lightyellow : [255, 255, 224],
		lime : [0, 255, 0],
		magenta : [255, 0, 255],
		maroon : [128, 0, 0],
		navy : [0, 0, 128],
		olive : [128, 128, 0],
		orange : [255, 165, 0],
		pink : [255, 192, 203],
		purple : [128, 0, 128],
		violet : [128, 0, 128],
		red : [255, 0, 0],
		silver : [192, 192, 192],
		white : [255, 255, 255],
		yellow : [255, 255, 0],
		transparent : [255, 255, 255]
	};
	$.easing.jswing = $.easing.swing;
	$.extend($.easing, {
		def : 'easeOutQuad',
		swing : function(x, t, b, c, d) {
			return $.easing[$.easing.def](x, t, b, c, d)
		},
		easeInQuad : function(x, t, b, c, d) {
			return c * (t /= d) * t + b
		},
		easeOutQuad : function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b
		},
		easeInOutQuad : function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b
		},
		easeInCubic : function(x, t, b, c, d) {
			return c * (t /= d) * t * t + b
		},
		easeOutCubic : function(x, t, b, c, d) {
			return c * (( t = t / d - 1) * t * t + 1) + b
		},
		easeInOutCubic : function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b
		},
		easeInQuart : function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t + b
		},
		easeOutQuart : function(x, t, b, c, d) {
			return -c * (( t = t / d - 1) * t * t * t - 1) + b
		},
		easeInOutQuart : function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b
		},
		easeInQuint : function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b
		},
		easeOutQuint : function(x, t, b, c, d) {
			return c * (( t = t / d - 1) * t * t * t * t + 1) + b
		},
		easeInOutQuint : function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
		},
		easeInSine : function(x, t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
		},
		easeOutSine : function(x, t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b
		},
		easeInOutSine : function(x, t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
		},
		easeInExpo : function(x, t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
		},
		easeOutExpo : function(x, t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
		},
		easeInOutExpo : function(x, t, b, c, d) {
			if (t == 0)
				return b;
			if (t == d)
				return b + c;
			if ((t /= d / 2) < 1)
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
		},
		easeInCirc : function(x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
		},
		easeOutCirc : function(x, t, b, c, d) {
			return c * Math.sqrt(1 - ( t = t / d - 1) * t) + b
		},
		easeInOutCirc : function(x, t, b, c, d) {
			if ((t /= d / 2) < 1)
				return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
		},
		easeInElastic : function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0)
				return b;
			if ((t /= d) == 1)
				return b + c;
			if (!p)
				p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
		},
		easeOutElastic : function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0)
				return b;
			if ((t /= d) == 1)
				return b + c;
			if (!p)
				p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
		},
		easeInOutElastic : function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0)
				return b;
			if ((t /= d / 2) == 2)
				return b + c;
			if (!p)
				p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4
			} else
				var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1)
				return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
		},
		easeInBack : function(x, t, b, c, d, s) {
			if (s == undefined)
				s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b
		},
		easeOutBack : function(x, t, b, c, d, s) {
			if (s == undefined)
				s = 1.70158;
			return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
		},
		easeInOutBack : function(x, t, b, c, d, s) {
			if (s == undefined)
				s = 1.70158;
			if ((t /= d / 2) < 1)
				return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b
		},
		easeInBounce : function(x, t, b, c, d) {
			return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b
		},
		easeOutBounce : function(x, t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b
			}
		},
		easeInOutBounce : function(x, t, b, c, d) {
			if (t < d / 2)
				return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
			return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
		}
	})
})(jQuery);
(function($) {
	$.effects.transfer = function(o) {
		return this.queue(function() {
			var elem = $(this), target = $(o.options.to), endPosition = target.offset(), animation = {
				top : endPosition.top,
				left : endPosition.left,
				height : target.innerHeight(),
				width : target.innerWidth()
			}, startPosition = elem.offset(), transfer = $('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(o.options.className).css({
				top : startPosition.top,
				left : startPosition.left,
				height : elem.innerHeight(),
				width : elem.innerWidth(),
				position : 'absolute'
			}).animate(animation, o.duration, o.options.easing, function() {
				transfer.remove();
				(o.callback && o.callback.apply(elem[0], arguments));
				elem.dequeue()
			})
		})
	}
})(jQuery);
jQuery.fn.extend({
	number_format : function(numero, params) {
		var sDefaults = {
			numberOfDecimals : 2,
			decimalSeparator : ',',
			thousandSeparator : '.',
			symbol : ''
		};
		var options = jQuery.extend(sDefaults, params);
		var number = numero;
		var decimals = options.numberOfDecimals;
		var dec_point = options.decimalSeparator;
		var thousands_sep = options.thousandSeparator;
		var currencySymbol = options.symbol;
		var exponent = "";
		var numberstr = number.toString();
		var eindex = numberstr.indexOf("e");
		if (eindex > -1) {
			exponent = numberstr.substring(eindex);
			number = parseFloat(numberstr.substring(0, eindex))
		}
		if (decimals != null) {
			var temp = Math.pow(10, decimals);
			number = Math.round(number * temp) / temp
		}
		var sign = number < 0 ? "-" : "";
		var integer = (number > 0 ? Math.floor(number) : Math.abs(Math.ceil(number))).toString();
		var fractional = number.toString().substring(integer.length + sign.length);
		dec_point = dec_point != null ? dec_point : ".";
		fractional = decimals != null && decimals > 0 || fractional.length > 1 ? (dec_point + fractional.substring(1)) : "";
		if (decimals != null && decimals > 0) {
			for ( i = fractional.length - 1, z = decimals; i < z; ++i)
				fractional += "0"
		}
		thousands_sep = (thousands_sep != dec_point || fractional.length == 0) ? thousands_sep : null;
		if (thousands_sep != null && thousands_sep != "") {
			for ( i = integer.length - 3; i > 0; i -= 3)
				integer = integer.substring(0, i) + thousands_sep + integer.substring(i)
		}
		if (options.symbol == '') {
			return sign + integer + fractional + exponent
		} else {
			return currencySymbol + ' ' + sign + integer + fractional + exponent
		}
	}
});
;(function($) {
	$(document).ready(function() {
		$('#calculate-mode').tabs();
		$('#calc-manual-titlebar').click(function() {
			$('#manual-content').slideToggle(100);
			$(this).parent().toggleClass('ui-tabs-selected');
			return false
		});
		$('#calc-auto-titlebar').click(function() {
			$('#auto-content').slideToggle(100);
			$(this).parent().toggleClass('ui-tabs-selected');
			return false
		});
		$('#calc-weighing-titlebar').click(function() {
			$('#calc-1-content').slideToggle(100);
			$(this).parent().toggleClass('ui-tabs-selected');
			return false
		});
		if ($('.slideshow').length > 0) {
			$('.slideshow').slideshow({
				'imageContSelector' : '#post-header',
				'switcherItemSelector' : '.slideshow-switcher a'
			})
		}
		var lbOpt = {
			overlayOpacity : '0.3',
			imageLoading : '/bitrix/templates/trimet/images/ajax-loader-t.gif',
			imageBtnClose : '/bitrix/templates/trimet/images/ajax-close-2.gif'
		};
		$('.map-1').lightBox(lbOpt);
		$('.map-2').lightBox(lbOpt);
		$('.map-3').lightBox(lbOpt);
		$('.map-4').lightBox(lbOpt);
		$('.map-1-1').lightBox(lbOpt);
		$('.map-2-1').lightBox(lbOpt);
		$('.map-3-1').lightBox(lbOpt);
		$('.map-4-1').lightBox(lbOpt);
		$('#history-list .history-link').click(function() {
			var i = parseInt($(this).attr('id').substr(3));
			var opened = $('#hi-' + i + ' .history-detail:visible').length;
			var current = $('#history-list .history-detail:visible').parent().attr('id');
			if (null != current) {
				current = parseInt(current.substr(3));
				if (i == current) {
					$('.mod-history #history-list').removeClass('open')
				} else {
					showHistoryItem(i)
				}
				$('#hi-' + current).removeClass('act');
				$('#hi-' + current + ' .history-detail').hide();
				$('#hi-' + current + ' .history-link').parent().removeClass('title first')
			} else {
				showHistoryItem(i)
			}
			return false
		});
		$('.mod-contacts .open-button').click(function() {
			var i = parseInt($(this).attr('id').substr(3));
			var current = $('.mod-contacts tbody:visible').attr('id');
			if (null != current) {
				current = parseInt(current.substr(3));
				if (i == current) {
					$('.mod-contacts').removeClass('open')
				} else {
					showToggledItem(i)
				}
				$('#ti-' + current).removeClass('act');
				$('.mod-contacts #tc-' + current).hide()
			} else {
				showToggledItem(i)
			}
			return false
		});
		if ($('div.page-dostavka').size() > 0) {
			$('div.page-dostavka a[href^=#section2]').toggle(function() {
				$('#section2').show();
				$('#section1').hide()
			}, function() {
				$('#section1').show();
				$('#section2').hide()
			});
			$('div.page-dostavka caption a').click(function() {
				var $self = $(this), $selected = $('div.page-dostavka caption a.selected'), $self_panel_id = $self.attr('href').replace('#', ''), $selected_panel_id = $selected.attr('href').replace('#', '');
				$selected.removeClass('selected');
				$self.addClass('selected');
				$('#' + $selected_panel_id + ', #' + $selected_panel_id + '-note').hide();
				$('#' + $self_panel_id + ', #' + $self_panel_id + '-note').show();
				return false
			})
		} else if ($('body.page-main').size() > 0) {
			var userLogin = $('#USER_LOGIN')[0], $userLoginLabel = $('#login-label'), userPwd = $('#USER_PASSWORD')[0], $userPwdLabel = $('#passw-label');
			setTimeout(function() {
				('' === userLogin.value) && $userLoginLabel.removeClass('none');
				('' === userPwd.value) && $userPwdLabel.removeClass('none')
			}, 100);
			$(userLogin).focus(function() {
				$userLoginLabel.addClass('none')
			}).blur(function() {
				('' === this.value) && $userLoginLabel.removeClass('none')
			});
			$(userPwd).focus(function() {
				$userPwdLabel.addClass('none')
			}).blur(function() {
				('' === this.value) && $userPwdLabel.removeClass('none')
			})
		} else if ($('body.page-catalog').size() > 0) {
			$('a.catalog-link-group').live('click', function() {
				$(this).parent().prepend('<div class="preloader">&nbsp;</div>');
				$('#obj-menu').load(this.href, function() {
					$('.preloader').remove()
				});
				return false
			});
			$('table.sizes-prices th span a').click(function() {
				var $cont = $(this).parent();
				var $prnt = $cont.parent();
				if ($cont.hasClass('none')) {
					$prnt.find('span').css({
						borderWidth : '0',
						display : 'none',
						padding : '0',
						position : 'static',
						width : 'auto'
					});
					$cont.removeClass('none').css({
						display : 'inline'
					});
					$('table.sizes-prices tbody:visible').addClass('none');
					$('#price-group-' + $cont.attr('id').split('-').slice(-1)[0]).removeClass('none')
				} else {
					$prnt.find('span').addClass('none').css({
						background : '#fff',
						borderWidth : '0 1px',
						borderColor : '#999',
						borderStyle : 'solid',
						display : 'block',
						padding : '2px 4px',
						position : 'absolute',
						left : '0px',
						width : '100px'
					}).each(function(i) {
						$this = $(this);
						$this.css({
							top : (i * ($this.height() + 2)) + 'px'
						})
					}).parent().find('span:first').css({
						borderTopWidth : '1px'
					}).parent().find('span:last').css({
						borderBottomWidth : '1px'
					})
				}
				return false
			});
			$('#autocomplete-field').autocomplete('/bitrix/templates/trimet/ajax/catalog_search.php', {
				'delay' : 100,
				'max' : 999,
				'scrollHeight' : 265,
				'parse' : function(data) {
					return $.map(eval(data), function(row) {
						return {
							data : row,
							result : row.name
						}
					})
				},
				'formatItem' : function(item) {
					return String(item.name)
				}
			}).result(function(event, item) {
				location.href = item.link
			});
			function fieldRule(sel, rule) {
				function _default(e) {
					var c = e.which;
					return (0 == c || 8 == c) ? true : false
				}

				function _int(e) {
					var c = e.which;
					return (48 <= c && c <= 57) ? true : _default(e)
				}

				function _float(e) {
					var c = e.which;
					if (46 == c || 44 == c) {
						if ('value' in this) {
							return /[.,]/.test(this.value) ? false : true
						} else {
							return true
						}
					} else {
						return _int(e)
					}
				}

				function _cutting(e) {
					var c = e.which;
					return (59 == c || 32 == c) ? true : _float(e)
				}

				var rel = {
					'int' : _int,
					'float' : _float,
					'cutting' : _cutting
				};
				$(sel).live('keypress', rel[rule])
			}

			fieldRule('#auto-sc-c1', 'int');
			fieldRule('#auto-sc-s1', 'float');
			fieldRule('#calc-1-pie', 'int');
			fieldRule('#calc-1-met', 'float');
			fieldRule('#calc-1-ton', 'float');
			fieldRule('input.add-size-scheme-field', 'cutting');
			fieldRule('input.add-size-count', 'int')
		} else if ($('body.page-history-photo').size() > 0) {
			var $imgs = $('#layer div > img'), iMax = $imgs.length - 1, oCont = $('div.mod-gallery-preview-cont'), iImgWidth = 96, iCenter = Math.round((oCont.width() - iImgWidth) / 2);
			function onChangePic(i) {
				var s = $imgs.get(i).alt;
				$('div.mod-gallery h6').html('' === s ? '&nbsp;' : s);
				$("#page-status span").text(i + 1);
				$('ul.mod-gallery-preview li').removeClass('active').eq(i).addClass('active');
				oCont.scrollLeft(iImgWidth * i - iCenter)
			}
			oCont.mousewheel(function(evt, delta) {
				$(this).scrollTo((delta < 0 ? '+' : '-') + '=' + Math.abs(delta * iImgWidth) + 'px');
				return false
			});
			$('ul.mod-gallery-preview a').click(function() {
				$imgs.filter(':visible').addClass('none');
				var iNext = $(this).parent().index();
				var next = $imgs.get(iNext);
				$(next).removeClass('none');
				if (0 == iNext) {
					$('#back').addClass('none')
				} else {
					$('#back').removeClass('none')
				}
				if (iMax == iNext) {
					$('#next').addClass('none')
				} else {
					$('#next').removeClass('none')
				}
				onChangePic(iNext);
				return false
			});
			$('#back, #next').click(function() {
				var $cur = $imgs.filter(':visible'), iCur = $cur.index(), iNext;
				if ('back' == this.id) {
					iNext = iCur - 1;
					if (0 == iNext) {
						$(this).addClass('none')
					}
					$('#next').removeClass('none')
				} else {
					iNext = iCur + 1;
					if (iMax == iNext) {
						$(this).addClass('none')
					}
					$('#back').removeClass('none')
				}
				$cur.addClass('none');
				var next = $imgs.get(iNext);
				$(next).removeClass('none');
				onChangePic(iNext);
				return false
			})
		} else if ($('div.page-postavshik').size() > 0) {
			$('div.page-postavshik').tabs()
		} else if ($('div.page-rezka').size() > 0) {
			$('div.page-rezka').tabs()
		} else if ($('body.page-auth').size() > 0) {
			$('#cont2, #panel3').tabs()
		} else if ($('body.page-shoping-bag').size() > 0) {
			$('div.bag-cutting-info a.internal-link').click(function() {
				$(this).parent().parent().addClass('none');
				return false
			});
			$('td.bag-item-info a.internal-link').click(function() {
				var $e = $('#cutting-tbl-' + this.id.split('-').pop());
				if ($e.hasClass('none')) {
					$('div.bag-cutting-info').addClass('none');
					$e.removeClass('none').css({
						left : $('#col2').width() / 2 - $e.width() / 2,
						top : $(this).position().top - 100
					})
				} else {
					$e.addClass('none')
				}
				return false
			});
			var $btnsDel = $('button[name="BasketRefresh"]');
			if (2 == $btnsDel.length) {
				var btnDelParent1 = $btnsDel[0].parentNode;
				var btnDelParent2 = $btnsDel[1].parentNode
			}
			function changeSubmits() {
				if (2 != $btnsDel.length) {
					return
				}
				if ($('#shoping-bag:visible').length) {
					btnDelParent1.appendChild($btnsDel[0]);
					btnDelParent2.appendChild($btnsDel[1])
				} else {
					$btnsDel.detach()
				}
			}

			changeSubmits();
			$('#bag-order-make').tabs();
			var $personType = $('#person_type');
			var $isAuthForm = $('#is-auth-form');
			var $orderFormFields = $('#order-form-fields');
			$('ul.ui-tabs-nav a').click(function() {
				var s = this.href.split('#')[1];
				switch(s) {
					case'fields-person-type-ur':
						{
							$orderFormFields.show();
							$personType.val('ur');
							$isAuthForm.val('')
						}
						break;
					case'fields-person-type-fiz':
						{
							$orderFormFields.show();
							$personType.val('fiz');
							$isAuthForm.val('')
						}
						break;
					case'auth-form':
						{
							$orderFormFields.hide();
							$isAuthForm.val('1')
						}
						break
				}
			});
			var $profileSel = $('#profile').change(function() {
				var id = $(this).val(), profiles = pageData.user.profiles;
				if (undefined == profiles[id]) {
				} else {
					var k, o = profiles[id];
					$('#bag-order-make ul.ui-tabs-nav li:' + ('fiz' === o.personType ? 'last' : 'first')).find('a').click();
					for (k in o.props) {
						if ('deliv_' == k.substr(0, 6)) {
							continue
						}
						$('input[name="' + k + '"]').val(o.props[k]);
						$('textarea[name="' + k + '"]').html(o.props[k])
					}
					if (undefined != o.props.deliv_city) {
						var delivProps = {};
						if ('Доставка не нужна' === o.props.deliv_city) {
							delivProps['delivery-city-sel'] = '0'
						} else {
							var val = $('#delivery-city-sel option:contains(' + o.props.deliv_city + ')').val();
							if (!val) {
								delivProps['delivery-city-sel'] = '-2';
								delivProps['delivery-newout-city'] = o.props.deliv_city;
								delivProps['delivery-newout-km'] = o.props.deliv_km || '';
								delivProps['delivery-newout-street'] = o.props.deliv_street || '';
								delivProps['delivery-newout-building'] = o.props.deliv_building || ''
							} else if ('-1' == val) {
								delivProps['delivery-city-sel'] = val;
								delivProps['delivery-in-building'] = o.props.deliv_building || '';
								delivInStreetLoadedFn = function() {
									delivProps['delivery-in-street'] = $('#delivery-selector-place option:contains(' + o.props.deliv_street + ')').val();
									delivFillForm(delivProps)
								};
								if ($('#delivery-selector-place').length) {
									delivInStreetLoadedFn()
								}
							} else {
								delivProps['delivery-city-sel'] = val;
								delivProps['delivery-out-street'] = o.props.deliv_street || '';
								delivProps['delivery-out-building'] = o.props.deliv_building || ''
							}
						}
						delivFillForm(delivProps)
					}
				}
			});
			if (!pageData.isFormSent) {
				$profileSel.change()
			}
			$('.bag-tbl tr:not(.bag-cutting)').each(function(i) {
				var $chk = $('td input[type="checkbox"]', this);
				if (!$chk.length) {
					return
				}
				var $cutChks = $(this).nextUntil('tr:not(.bag-cutting)').find('input[type="checkbox"]');
				if (!$cutChks.length) {
					return
				}
				var aCutChecks = {};
				$chk.click(function() {
					if (this.checked) {
						$cutChks.each(function() {
							aCutChecks[this.id] = this.checked;
							this.checked = true;
							this.disabled = true
						})
					} else {
						$cutChks.each(function() {
							this.checked = aCutChecks[this.id];
							this.disabled = false
						})
					}
				})
			});
			$('#deliv-user-acc-exists').change(function() {
				if (this.checked) {
					window.location = '/personal/?backurl=' + encodeURI('/personal/cart/')
				}
			})
		}
	});
	$('div.obj-catalog3').tabs();
	if ('undefined' !== typeof pageData.basketUpdateHeader) {
		basketUpdateHeader()
	}
})(jQuery);
function showHistoryItem(i) {
	var $ = jQuery;
	if (null == i || undefined == i)
		return false;
	$('#hi-' + i).addClass('act');
	$('#hi-' + i + ' .history-link').parent().addClass('title first');
	$('#hi-' + i + ' .history-detail').show();
	$('#history-list').addClass('open');
	return true
}

function showToggledItem(i) {
	var $ = jQuery;
	if (null == i || undefined == i)
		return false;
	$('#ti-' + i).addClass('act');
	$('.mod-contacts #tc-' + i).show();
	$('.mod-contacts').addClass('open');
	return true
}

function showEmail(name, domain) {
	window.location = 'mailto:' + name + '@' + domain;
	return false
}

function basketInformerUpdate(onRightColDone) {
	basketUpdateHeader();
	basketUpdateRightCol(onRightColDone)
}

function basketUpdateHeader() {
	var $ = jQuery;
	$.post('/products/catalog/', {
		act : 'basketUpdateHeader'
	}, function(data) {
		$('#obj-auth').replaceWith(data)
	})
}

function basketUpdateRightCol(onRightColDone) {
	var $ = jQuery;
	$.post('/products/catalog/', {
		act : 'basketUpdateRightCol'
	}, function(data) {
		$('div.obj-catalog-basket').replaceWith(data);
		( onRightColDone instanceof Function) && onRightColDone()
	})
}

function basketShowAdded(sId, aIds) {
	var $ = jQuery;
	$(sId).effect('transfer', {
		to : 'div.obj-catalog-basket'
	}, 850, function() {
		$('div.obj-catalog-basket tr').removeClass('added');
		var i, n;
		for ( i = 0, n = aIds.length; i < n; i++) {
			$('#catalog-el-' + aIds[i]).addClass('added')
		}
	})
}

var showError;
(function() {
	var fShow, fHide;
	showError = function(sel, sMsg, clean) {
		clean = (undefined == clean) ? false : true;
		var $ = jQuery, $tt, $hover = $(sel), $tg = $hover.parent().css({
			position : 'relative'
		});
		$tt = $('ul.tt-error', $tg);
		if ($tt.size() > 0 && !clean) {
			$tt.append('<li>' + sMsg + '</li>');
			fHide(function() {
				fShow()
			})
		} else {
			if ($tt.size() > 0) {
				$tt.remove()
			}
			$tt = $('<ul class="tt-error" style="position: absolute; display: none;"><li><span>&nbsp;</span>' + sMsg + '</li></ul>');
			$tg.append($tt);
			$tg.parent().bubble_tooltip_init({
				nDelayHide : 100,
				bManualHide : true
			}, {
				sFindGroup : $tg,
				sFindHover : $hover,
				sFindTooltip : $tt,
				iface : function(show, hide) {
					fShow = show;
					fHide = hide
				}
			});
			fShow();
			$('span', $tt).click(function() {
				fHide(function() {
					$tt.detach()
				})
			})
		}
	}
})(); 